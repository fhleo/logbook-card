import { DEFAULT_SHOW, DEFAULT_DURATION, DEFAULT_SEPARATOR_STYLE } from './const';
import { LitElement, html, TemplateResult, CSSResult, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent, LovelaceCardEditor, ActionConfig } from 'custom-card-helpers';

import {
  LogbookCardConfig,
  StateMap,
  AttributeConfig,
  LayoutElementKey,
  LayoutConfiguration,
  ElementStyleConfig,
} from './types';
import { normalizeLayout, layoutRows } from './layout';
import { localize, setHass } from './localize/localize';
import { CARD_VERSION } from './const';

/**
 * 动态构建选项对象 — 在 render 时调用，确保 localize() 能拿到正确的 hass 语言
 * show 状态保存在独立的 _showState 中，与 label 翻译解耦
 */
type OptionKey = 'required' | 'appearance' | 'dataConfig' | 'actions';

const ALL_OPTION_KEYS: OptionKey[] = ['required', 'appearance', 'dataConfig', 'actions'];

const optionShowState: Record<OptionKey, boolean> = {
  required: true,
  appearance: false,
  dataConfig: false,
  actions: false,
};

/** 分区内的嵌套折叠组 */
type SubKey = 'show' | 'layout' | 'styles' | 'separator' | 'stateMap' | 'hiddenState' | 'attributes' | 'duration';

function buildOption(key: OptionKey) {
  const configs: Record<OptionKey, { icon: string; nameKey: string; secondaryKey: string }> = {
    required: {
      icon: 'tune',
      nameKey: 'editor.required_option_name',
      secondaryKey: 'editor.required_option_description',
    },
    appearance: {
      icon: 'palette',
      nameKey: 'editor.appearance_option_name',
      secondaryKey: 'editor.appearance_option_description',
    },
    dataConfig: {
      icon: 'database',
      nameKey: 'editor.data_option_name',
      secondaryKey: 'editor.data_option_description',
    },
    actions: {
      icon: 'gesture-tap',
      nameKey: 'editor.actions_option_name',
      secondaryKey: 'editor.actions_option_description',
    },
  };
  const cfg = configs[key];
  return {
    icon: cfg.icon,
    name: localize(cfg.nameKey),
    secondary: localize(cfg.secondaryKey),
    show: optionShowState[key],
  };
}

type ActionKey = 'tap_action' | 'hold_action' | 'double_tap_action';
const ACTION_KEYS: ActionKey[] = ['tap_action', 'hold_action', 'double_tap_action'];

/**
 * 分隔符线型（合并视觉相同的样式：groove/ridge/inset/outset 在细线宽度下与 solid 一致）
 * 每种线型以实际线条样式呈现在按钮中
 */
const SEPARATOR_STYLES = ['solid', 'dashed', 'dotted', 'double', 'none'] as const;
type SeparatorStyle = typeof SEPARATOR_STYLES[number];

/** 把任意配置值归一到可视线型（未知值按 solid 处理） */
const normalizeSeparatorStyle = (value?: string): SeparatorStyle =>
  (SEPARATOR_STYLES as readonly string[]).includes(value ?? '') ? (value as SeparatorStyle) : 'solid';

const DURATION_LABEL_FIELDS = ['second', 'minute', 'hour', 'day', 'week', 'month'] as const;

/** 可布局的元素 */
const LAYOUT_ELEMENT_KEYS: LayoutElementKey[] = ['state', 'duration', 'attributes', 'time'];

/** 字号单位与对应滑块范围 */
const FONT_UNITS = ['rem', 'px', 'em', '%'];
const SIZE_RANGE: Record<string, { min: number; max: number; step: number }> = {
  rem: { min: 0.6, max: 2, step: 0.05 },
  em: { min: 0.6, max: 2, step: 0.05 },
  px: { min: 10, max: 40, step: 1 },
  '%': { min: 60, max: 200, step: 5 },
};

@customElement('logbook-card-editor')
export class LogbookCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false })
  public set hass(value: HomeAssistant | undefined) {
    // 缓存 hass 引用到 localize 模块，让它能读取 HA 的语言设置
    if (value) {
      setHass(value);
    }
    (this as any)._hass = value;
    this.requestUpdate('hass', (this as any)._prevHass);
    (this as any)._prevHass = value;
  }
  public get hass(): HomeAssistant | undefined {
    return (this as any)._hass;
  }

  @state() private _config?: Partial<LogbookCardConfig>;
  @state() private _toggle?: boolean;
  @state() private _helpers?: any;
  @state() private _subOpen: Record<SubKey, boolean> = {
    show: true,
    layout: false,
    styles: false,
    separator: false,
    stateMap: false,
    hiddenState: false,
    attributes: false,
    duration: false,
  };

  private _toggleSub(ev: Event): void {
    const key = (ev.currentTarget as HTMLElement).sub as SubKey;
    this._subOpen = { ...this._subOpen, [key]: !this._subOpen[key] };
  }

  private _subSection(key: SubKey, title: string, content: TemplateResult): TemplateResult {
    const open = this._subOpen[key];
    return html`
      <div class="suboption" @click=${this._toggleSub} .sub=${key}>
        <ha-icon class="suboption-chevron" .icon=${open ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
        <div class="suboption-title">${title}</div>
      </div>
      ${open
        ? html`
            <div class="values sub-values">${content}</div>
          `
        : ''}
    `;
  }

  private _renderShowToggles(): TemplateResult {
    return html`
      <ha-formfield .label=${localize('editor.display_state_label')}>
        <ha-switch
          aria-label=${`Toggle display of state ${this._show_state ? 'off' : 'on'}`}
          .checked=${this._show_state !== false}
          .configValue=${'state'}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${localize('editor.display_duration_label')}>
        <ha-switch
          aria-label=${`Toggle display of duration ${this._show_duration ? 'off' : 'on'}`}
          .checked=${this._show_duration !== false}
          .configValue=${'duration'}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${localize('editor.display_start_date_label')}>
        <ha-switch
          aria-label=${`Toggle display of start date ${this._show_start_date ? 'off' : 'on'}`}
          .checked=${this._show_start_date !== false}
          .configValue=${'start_date'}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${localize('editor.display_end_date_label')}>
        <ha-switch
          aria-label=${`Toggle display of end date ${this._show_end_date ? 'off' : 'on'}`}
          .checked=${this._show_end_date !== false}
          .configValue=${'end_date'}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${localize('editor.display_icon_label')}>
        <ha-switch
          aria-label=${`Toggle display of icon ${this._show_icon ? 'off' : 'on'}`}
          .checked=${this._show_icon === true}
          .configValue=${'icon'}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${localize('editor.display_separator_label')}>
        <ha-switch
          aria-label=${`Toggle display of event separator ${this._show_separator ? 'off' : 'on'}`}
          .checked=${this._show_separator !== false}
          .configValue=${'separator'}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${localize('editor.display_custom_logs_label')}>
        <ha-switch
          aria-label=${`Toggle display of custom logs ${this._custom_logs ? 'off' : 'on'}`}
          .checked=${this._custom_logs !== false}
          .configValue=${'custom_logs'}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${localize('editor.show_history_label')}>
        <ha-switch
          aria-label=${`Toggle display of history ${this._show_history ? 'off' : 'on'}`}
          .checked=${this._show_history}
          .configValue=${'show_history'}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${localize('editor.scroll_label')}>
        <ha-switch
          aria-label=${`Toggle scroll ${this._scroll ? 'off' : 'on'}`}
          .checked=${this._scroll}
          .configValue=${'scroll'}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
      <ha-formfield .label=${localize('editor.group_by_day_label')}>
        <ha-switch
          aria-label=${`Toggle group by day ${this._group_by_day ? 'off' : 'on'}`}
          .checked=${this._group_by_day}
          .configValue=${'group_by_day'}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
    `;
  }

  // ---------- 布局（预览 + 行/对齐/顺序） ----------
  /** 每个元素当前所在的行与对齐（从布局配置反解析） */
  private _layoutAssign(): Record<LayoutElementKey, { row: number; align: 'left' | 'right' }> {
    const layout = this._config?.layout;
    const plan = normalizeLayout(layout);
    const result: any = {};
    let row = 1;
    plan.forEach(item => {
      // 未配置布局时保持旧行为：持续时间靠右；配置后按 align 声明
      const align = layout
        ? layout.align?.[item.key] === 'right'
          ? 'right'
          : 'left'
        : item.key === 'duration'
        ? 'right'
        : 'left';
      result[item.key] = { row, align };
      if (item.breakAfter) {
        row++;
      }
    });
    return result;
  }

  /** 实时预览：按行渲染元素胶囊，右组靠右 */
  private _renderLayoutPreview(): TemplateResult {
    const rows = layoutRows(this._config?.layout);
    const chip = (key: LayoutElementKey) =>
      html`
        <span class="layout-chip">${localize(`editor.layout_elem_${key}`)}</span>
      `;
    return html`
      <div class="layout-preview">
        ${rows.map(
          row => html`
            <div class="layout-preview-row">
              <div class="layout-preview-side">${row.left.map(chip)}</div>
              ${row.right.length
                ? html`
                    <div class="layout-preview-side layout-preview-right">${row.right.map(chip)}</div>
                  `
                : ''}
            </div>
          `,
        )}
      </div>
    `;
  }

  private _renderLayoutEditor(): TemplateResult {
    const assign = this._layoutAssign();
    return html`
      <p class="hint">${localize('editor.layout_hint')}</p>
      ${this._renderLayoutPreview()}
      <div class="layout-config">
        ${LAYOUT_ELEMENT_KEYS.map(key => {
          const a = assign[key];
          return html`
            <div class="layout-config-row">
              <span class="layout-config-name">${localize(`editor.layout_elem_${key}`)}</span>
              <select
                class="native-select"
                title=${localize('editor.layout_row_label')}
                @change=${(ev: Event) =>
                  this._layoutRowChanged(key, Number.parseInt((ev.target as HTMLSelectElement).value))}
              >
                ${[1, 2, 3, 4].map(
                  n => html`
                    <option value=${n} ?selected=${a.row === n}
                      >${localize('editor.layout_row_n', '{n}', String(n))}</option
                    >
                  `,
                )}
              </select>
              <select
                class="native-select"
                title=${localize('editor.layout_align_label')}
                @change=${(ev: Event) =>
                  this._layoutAlignChanged(key, (ev.target as HTMLSelectElement).value as 'left' | 'right')}
              >
                <option value="left" ?selected=${a.align === 'left'}>${localize('editor.layout_align_left')}</option>
                <option value="right" ?selected=${a.align === 'right'}>${localize('editor.layout_align_right')}</option>
              </select>
              <button
                type="button"
                class="layout-btn"
                title=${localize('editor.layout_move_up')}
                @click=${() => this._layoutOrderMove(key, -1)}
              >
                ◀
              </button>
              <button
                type="button"
                class="layout-btn"
                title=${localize('editor.layout_move_down')}
                @click=${() => this._layoutOrderMove(key, 1)}
              >
                ▶
              </button>
            </div>
          `;
        })}
      </div>
    `;
  }

  /** 把元素行/对齐配置写回 layout 配置（组内顺序沿用 baseOrder 或当前显示顺序） */
  private _writeLayoutAssign(
    assign: Record<LayoutElementKey, { row: number; align: 'left' | 'right' }>,
    baseOrder?: LayoutElementKey[],
  ): void {
    if (!this._config || !this.hass) {
      return;
    }
    const currentOrder = baseOrder ?? normalizeLayout(this._config.layout).map(item => item.key);
    const idxOf = (k: LayoutElementKey) => {
      const i = currentOrder.indexOf(k);
      return i < 0 ? 99 : i;
    };
    const rowNums = Array.from(new Set(LAYOUT_ELEMENT_KEYS.map(k => assign[k].row))).sort((a, b) => a - b);
    const order: LayoutElementKey[] = [];
    const lineBreaks: LayoutElementKey[] = [];
    rowNums.forEach((r, i) => {
      const inRow = LAYOUT_ELEMENT_KEYS.filter(k => assign[k].row === r);
      const left = inRow.filter(k => assign[k].align === 'left').sort((a, b) => idxOf(a) - idxOf(b));
      const right = inRow.filter(k => assign[k].align === 'right').sort((a, b) => idxOf(a) - idxOf(b));
      order.push(...left, ...right);
      if (i < rowNums.length - 1) {
        lineBreaks.push(order[order.length - 1]);
      }
    });
    const layout: LayoutConfiguration = { order, line_breaks: lineBreaks };
    const align: Partial<Record<LayoutElementKey, 'right'>> = {};
    LAYOUT_ELEMENT_KEYS.forEach(k => {
      if (assign[k].align === 'right') {
        align[k] = 'right';
      }
    });
    if (Object.keys(align).length > 0) {
      layout.align = align;
    }
    const cfg = { ...this._config };
    cfg.layout = layout;
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _layoutRowChanged(key: LayoutElementKey, row: number): void {
    if (Number.isNaN(row)) {
      return;
    }
    const assign = this._layoutAssign();
    assign[key].row = row;
    this._writeLayoutAssign(assign);
  }

  private _layoutAlignChanged(key: LayoutElementKey, align: 'left' | 'right'): void {
    const assign = this._layoutAssign();
    assign[key].align = align;
    this._writeLayoutAssign(assign);
  }

  /** 同行同侧内调整顺序：交换两个元素在显示序列中的位置 */
  private _layoutOrderMove(key: LayoutElementKey, dir: -1 | 1): void {
    const order = normalizeLayout(this._config?.layout).map(item => item.key);
    const assign = this._layoutAssign();
    const group = LAYOUT_ELEMENT_KEYS.filter(
      k => assign[k].row === assign[key].row && assign[k].align === assign[key].align,
    );
    group.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    const pos = group.indexOf(key);
    const other = group[pos + dir];
    if (!other) {
      return;
    }
    const iA = order.indexOf(key);
    const iB = order.indexOf(other);
    order[iA] = other;
    order[iB] = key;
    this._writeLayoutAssign(assign, order);
  }

  private _renderStyleRows(): TemplateResult {
    return html`
      <div class="style-row style-head">
        <span class="style-label"></span>
        <span class="style-col">${localize('editor.style_color_label')}</span>
        <span class="style-col">${localize('editor.style_size_label')}</span>
        <span class="style-col"></span>
      </div>
      ${(['state', 'duration', 'attributes', 'time'] as LayoutElementKey[]).map(key => this._styleRow(key))}
    `;
  }

  private _renderSeparatorFields(): TemplateResult {
    return html`
      <div class="select-wrap">
        <label class="select-label">${localize('editor.separator_width_label')}</label>
        <select
          class="native-select"
          @change=${(ev: Event) => this._separatorStyleChanged('width', (ev.target as HTMLSelectElement).value)}
        >
          ${[
            { v: '', l: localize('editor.sep_width_default') },
            { v: '1', l: '1px' },
            { v: '2', l: '2px' },
            { v: '3', l: '3px' },
            { v: '4', l: '4px' },
            { v: '5', l: '5px' },
          ].map(
            o => html`
              <option
                value=${o.v}
                ?selected=${String(this._sep_width) === o.v || (o.v === '' && this._sep_width === '')}
              >
                ${o.l}
              </option>
            `,
          )}
        </select>
      </div>
      <div class="select-wrap">
        <label class="select-label">${localize('editor.separator_style_label')}</label>
        <div class="sep-styles">
          ${SEPARATOR_STYLES.map(s => {
            const active = normalizeSeparatorStyle(this._sep_style || undefined) === s;
            return html`
              <button
                type="button"
                class="sep-style-btn ${active ? 'active' : ''}"
                title=${s}
                @click=${() => this._separatorStyleChanged('style', s)}
              >
                <span class="sep-style-line" style=${`border-top-style: ${s}`}></span>
              </button>
            `;
          })}
        </div>
      </div>
      <label class="field">
        <span class="field-label">${localize('editor.separator_color_label')}</span>
        <input
          type="color"
          class="style-color"
          .value=${this._sep_color || this._cssVar('--divider-color', '#dddddd')}
          @change=${(ev: Event) => this._separatorStyleChanged('color', (ev.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  // ---------- 数据配置：状态映射 / 隐藏状态 / 属性 / 持续时间 ----------
  private _renderStateMapList(): TemplateResult {
    return html`
      ${this._state_map.map(
        (item, i) => html`
          <div class="list-row">
            <button
              class="remove-btn"
              title=${localize('editor.remove_item_label')}
              @click=${() => this._removeStateMapItem(i)}
            >
              ✕
            </button>
            <label class="field full">
              <span class="field-label">${localize('editor.state_map_value_label')}</span>
              <input
                type="text"
                .value=${item.value || ''}
                @input=${(ev: Event) => this._updateStateMapItem(i, 'value', (ev.target as HTMLInputElement).value)}
              />
            </label>
            <label class="field">
              <span class="field-label">${localize('editor.state_map_label_label')}</span>
              <input
                type="text"
                .value=${item.label || ''}
                @input=${(ev: Event) => this._updateStateMapItem(i, 'label', (ev.target as HTMLInputElement).value)}
              />
            </label>
            <ha-icon-picker
              class="icon-picker"
              .hass=${this.hass}
              .value=${item.icon || undefined}
              .label=${localize('editor.state_map_icon_label')}
              @value-changed=${(ev: CustomEvent) =>
                this._updateStateMapItem(i, 'icon', (ev.detail?.value as string) ?? '')}
            ></ha-icon-picker>
            <label class="field">
              <span class="field-label">${localize('editor.state_map_icon_color_label')}</span>
              <input
                type="color"
                class="style-color"
                .value=${item.icon_color || '#000000'}
                @change=${(ev: Event) =>
                  this._updateStateMapItem(i, 'icon_color', (ev.target as HTMLInputElement).value)}
              />
            </label>
          </div>
        `,
      )}
      <button class="add-btn" @click=${this._addStateMapItem}>
        ${localize('editor.add_item_label')}
      </button>
    `;
  }

  private _renderHiddenState(): TemplateResult {
    return html`
      ${this._hidden_state_has_objects
        ? html`
            <p class="hint">${localize('editor.hidden_state_objects_hint')}</p>
          `
        : ''}
      <label class="field">
        <span class="field-label">${localize('editor.hidden_state_option_name')}</span>
        <textarea
          rows="4"
          .value=${this._hidden_state_text}
          ?disabled=${this._hidden_state_has_objects}
          @input=${this._hiddenStateChanged}
        ></textarea>
      </label>
    `;
  }

  private _renderAttributesList(): TemplateResult {
    const entityAttributes = this._entityAttributeNames();
    return html`
      <ha-formfield .label=${localize('editor.attribute_hide_label_label')}>
        <ha-switch
          aria-label=${`Toggle hide attribute labels ${this._attribute_hide_label ? 'off' : 'on'}`}
          .checked=${this._attribute_hide_label}
          .configValue=${'attribute_hide_label'}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
      ${this._attributes.map(
        (item, i) => html`
          <div class="list-row">
            <button
              class="remove-btn"
              title=${localize('editor.remove_item_label')}
              @click=${() => this._removeAttributeItem(i)}
            >
              ✕
            </button>
            <label class="field full">
              <span class="field-label">${localize('editor.attribute_value_label')}</span>
              <select
                class="native-select"
                @change=${(ev: Event) => this._updateAttributeItem(i, 'value', (ev.target as HTMLSelectElement).value)}
              >
                <option value="" ?selected=${!item.value}>—</option>
                ${entityAttributes.map(
                  a => html`
                    <option value=${a} ?selected=${item.value === a}>${a}</option>
                  `,
                )}
                ${item.value && !entityAttributes.includes(item.value)
                  ? html`
                      <option value=${item.value} ?selected>${item.value}</option>
                    `
                  : ''}
              </select>
            </label>
            <label class="field">
              <span class="field-label">${localize('editor.attribute_label_label')}</span>
              <input
                type="text"
                .value=${item.label || ''}
                @input=${(ev: Event) => this._updateAttributeItem(i, 'label', (ev.target as HTMLInputElement).value)}
              />
            </label>
            <div class="select-wrap">
              <label class="select-label">${localize('editor.attribute_type_label')}</label>
              <select
                class="native-select"
                @change=${(ev: Event) => this._updateAttributeItem(i, 'type', (ev.target as HTMLSelectElement).value)}
              >
                <option value="" ?selected=${!item.type}>
                  ${localize('editor.attribute_type_none')}
                </option>
                <option value="date" ?selected=${item.type === 'date'}>
                  ${localize('editor.attribute_type_date')}
                </option>
                <option value="url" ?selected=${item.type === 'url'}>
                  ${localize('editor.attribute_type_url')}
                </option>
              </select>
            </div>
            <label class="field">
              <span class="field-label">${localize('editor.attribute_link_label')}</span>
              <input
                type="text"
                .value=${item.link_label || ''}
                @input=${(ev: Event) =>
                  this._updateAttributeItem(i, 'link_label', (ev.target as HTMLInputElement).value)}
              />
            </label>
          </div>
        `,
      )}
      <button class="add-btn" @click=${this._addAttributeItem}>
        ${localize('editor.add_item_label')}
      </button>
    `;
  }

  private _renderDurationFields(): TemplateResult {
    const units: string[] = ((this._config?.duration?.units as string[] | undefined) ??
      (DEFAULT_DURATION.units as string[])) as string[];
    const unitOptions = [
      { code: 'y', key: 'editor.unit_year' },
      { code: 'w', key: 'editor.unit_week' },
      { code: 'd', key: 'editor.unit_day' },
      { code: 'h', key: 'editor.unit_hour' },
      { code: 'm', key: 'editor.unit_minute' },
      { code: 's', key: 'editor.unit_second' },
    ];
    return html`
      <div class="select-wrap">
        <label class="select-label">${localize('editor.duration_largest_label')}</label>
        <select
          class="native-select"
          @change=${(ev: Event) => this._durationFieldChanged('largest', (ev.target as HTMLSelectElement).value)}
        >
          ${[
            { v: '1', l: localize('editor.duration_largest_default') },
            { v: '2', l: '2' },
            { v: '3', l: '3' },
            { v: '4', l: '4' },
            { v: 'full', l: localize('editor.duration_largest_full') },
          ].map(
            o => html`
              <option
                value=${o.v}
                ?selected=${this._durationLargest() === o.v || (o.v === '1' && this._durationLargest() === '')}
              >
                ${o.l}
              </option>
            `,
          )}
        </select>
      </div>
      <label class="field">
        <span class="field-label">${localize('editor.duration_delimiter_label')}</span>
        <input
          type="text"
          .value=${this._durationDelimiter()}
          @input=${(ev: Event) => this._durationFieldChanged('delimiter', (ev.target as HTMLInputElement).value)}
        />
      </label>
      <div class="units-row">
        <span class="field-label">${localize('editor.duration_units_label')}</span>
        <div class="units-list">
          ${unitOptions.map(
            u => html`
              <label class="unit-check">
                <input
                  type="checkbox"
                  .checked=${units.includes(u.code)}
                  @change=${(ev: Event) => this._durationUnitsChanged(u.code, (ev.target as HTMLInputElement).checked)}
                />
                ${localize(u.key)}
              </label>
            `,
          )}
        </div>
      </div>
      <p class="sub-title">${localize('editor.duration_labels_title')}</p>
      ${DURATION_LABEL_FIELDS.map(
        f => html`
          <label class="field">
            <span class="field-label">${localize(`editor.duration_${f}_label`)}</span>
            <input
              type="text"
              .value=${this._durationLabel(f)}
              @input=${(ev: Event) => this._durationFieldChanged(`labels.${f}`, (ev.target as HTMLInputElement).value)}
            />
          </label>
        `,
      )}
    `;
  }

  /** 标题输入：非空保存，清空则删除配置（卡片隐藏标题） */
  private _titleChanged(ev: Event): void {
    if (!this._config || !this.hass) {
      return;
    }
    const value = (ev.target as HTMLInputElement).value;
    const cfg = { ...this._config };
    if (value.trim() === '') {
      delete cfg.title;
    } else {
      cfg.title = value;
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _dateFormatChanged(value: string): void {
    if (!this._config || !this.hass) {
      return;
    }
    const cfg = { ...this._config };
    if (value === '') {
      delete cfg.date_format;
    } else {
      cfg.date_format = value;
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _durationUnitsChanged(code: string, checked: boolean): void {
    if (!this._config || !this.hass) {
      return;
    }
    const current =
      (this._config.duration?.units as string[] | undefined) ?? (DEFAULT_DURATION.units as string[]) ?? [];
    const next = checked ? Array.from(new Set([...current, code])) : current.filter(u => u !== code);
    const cur: any = { ...(this._config.duration || {}) };
    if (next.length === 0) {
      delete cur.units;
    } else {
      cur.units = next;
    }
    const cfg = { ...this._config };
    if (Object.keys(cur).length === 0) {
      delete cfg.duration;
    } else {
      cfg.duration = cur;
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  public setConfig(config: LogbookCardConfig): void {
    this._config = config;
    this.loadCardHelpers();
  }

  get _title(): string {
    // 只显示用户显式配置的标题；留空 = 不显示标题（卡片侧隐藏）
    return this._config?.title ?? '';
  }

  /** 标题输入框的占位提示（展示卡片默认会用的标题） */
  get _titlePlaceholder(): string {
    const entity = this._config?.entity;
    const friendly =
      entity && this.hass?.states && entity in this.hass.states
        ? (this.hass.states[entity] as any).attributes?.friendly_name
        : undefined;
    return friendly
      ? localize('logbook_card.default_title', '{entity}', friendly)
      : localize('editor.title_placeholder');
  }

  get _entity(): string {
    if (this._config) {
      return this._config.entity || '';
    }
    return '';
  }

  get _hours_to_show(): number | '' {
    if (this._config?.hours_to_show) {
      return this._config.hours_to_show;
    }
    // 卡片默认：history(5天) 换算为 120 小时
    return 120;
  }

  get _desc(): boolean {
    if (this._config && this._config.desc !== undefined) {
      return this._config.desc;
    }
    return true;
  }

  get _date_format(): string {
    if (this._config) {
      return this._config.date_format || '';
    }
    return '';
  }

  get _no_event(): string {
    if (this._config?.no_event !== undefined) {
      return this._config.no_event;
    }
    // 显示卡片实际使用的默认无事件文案
    return localize('common.default_no_event');
  }

  get _max_items(): number {
    if (this._config) {
      return this._config.max_items || -1;
    }
    return -1;
  }

  get _collapse(): number | undefined {
    if (this._config) {
      return this._config.collapse;
    }
    return undefined;
  }

  get _minimal_duration(): number | '' {
    return this._config?.minimal_duration ?? 0;
  }

  get _show_state(): boolean {
    if (this._config && this._config.show) {
      return this._config.show?.state;
    }
    return DEFAULT_SHOW.state;
  }

  get _show_duration(): boolean {
    if (this._config && this._config.show) {
      return this._config.show?.duration;
    }
    return DEFAULT_SHOW.duration;
  }

  get _show_start_date(): boolean {
    if (this._config && this._config.show) {
      return this._config.show?.start_date;
    }
    return DEFAULT_SHOW.start_date;
  }

  get _show_end_date(): boolean {
    if (this._config && this._config.show) {
      return this._config.show?.end_date;
    }
    return DEFAULT_SHOW.end_date;
  }

  get _show_icon(): boolean {
    if (this._config && this._config.show) {
      return this._config.show?.icon;
    }
    return DEFAULT_SHOW.icon;
  }

  get _show_separator(): boolean {
    return this._config?.show?.separator ?? DEFAULT_SHOW.separator;
  }

  get _custom_logs(): boolean {
    return this._config?.custom_logs || false;
  }

  get _attribute_hide_label(): boolean {
    return this._config?.attribute_hide_label === true;
  }

  /** 读取当前实体的属性名列表，供属性下拉选择 */
  private _entityAttributeNames(): string[] {
    const entity = this._config?.entity;
    if (!entity || !this.hass?.states || !(entity in this.hass.states)) {
      return [];
    }
    const attrs = (this.hass.states[entity] as any).attributes || {};
    return Object.keys(attrs).sort((a, b) => a.localeCompare(b));
  }

  // README 默认 true
  get _show_history(): boolean {
    return this._config?.show_history !== false;
  }

  // README 默认 true
  get _scroll(): boolean {
    return this._config?.scroll !== false;
  }

  // README 默认 false
  get _group_by_day(): boolean {
    return this._config?.group_by_day === true;
  }

  get _state_map(): Array<StateMap> {
    return Array.isArray(this._config?.state_map) ? (this._config!.state_map as Array<StateMap>) : [];
  }

  get _attributes(): Array<AttributeConfig> {
    return Array.isArray(this._config?.attributes) ? (this._config!.attributes as Array<AttributeConfig>) : [];
  }

  get _hidden_state_text(): string {
    const hs = this._config?.hidden_state;
    if (Array.isArray(hs) && hs.every(s => typeof s === 'string')) {
      return (hs as string[]).join('\n');
    }
    return '';
  }

  get _hidden_state_has_objects(): boolean {
    const hs = this._config?.hidden_state;
    return Array.isArray(hs) && hs.some(s => typeof s !== 'string');
  }

  get _sep_width(): number | '' {
    return this._config?.separator_style?.width ?? '';
  }

  get _sep_style(): string {
    return this._config?.separator_style?.style ?? '';
  }

  get _sep_color(): string {
    return this._config?.separator_style?.color ?? '';
  }

  private _durationLargest(): string {
    const l = this._config?.duration?.largest;
    return l === undefined ? '' : String(l);
  }

  private _durationDelimiter(): string {
    return this._config?.duration?.delimiter ?? '';
  }

  private _durationLabel(field: string): string {
    return (this._config?.duration?.labels as any)?.[field] ?? '';
  }

  private _actionConfig(key: ActionKey): ActionConfig | undefined {
    return this._config?.[key] as ActionConfig | undefined;
  }

  private _actionValue(key: ActionKey): string {
    return this._actionConfig(key)?.action || (key === 'tap_action' ? 'more-info' : 'none');
  }

  private _serviceDataText(key: ActionKey): string {
    const sd = (this._actionConfig(key) as any)?.service_data;
    return sd ? JSON.stringify(sd, null, 2) : '';
  }

  protected render(): TemplateResult | void {
    if (!this.hass) {
      return html``;
    }

    // render 时动态构建选项，确保 localize() 能读取到正确的语言
    const required = buildOption('required');
    const appearance = buildOption('appearance');
    const dataConfig = buildOption('dataConfig');
    const actions = buildOption('actions');

    return html`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${'required'}>
          <ha-icon class="option-icon" .icon=${`mdi:${required.icon}`}></ha-icon>
          <div class="option-title">${required.name}</div>
          <div class="option-secondary">${required.secondary}</div>
        </div>
        ${required.show
          ? html`
              <div class="values">
                <ha-entity-picker
                  .hass=${this.hass}
                  .label=${localize('editor.entity_label')}
                  .configValue=${'entity'}
                  .value=${this._entity}
                  .allowCustomEntity=${false}
                  @value-changed=${this._valueChanged}
                ></ha-entity-picker>
              </div>
            `
          : ''}
        <div class="option" @click=${this._toggleOption} .option=${'appearance'}>
          <ha-icon class="option-icon" .icon=${`mdi:${appearance.icon}`}></ha-icon>
          <div class="option-title">${appearance.name}</div>
          <div class="option-secondary">${appearance.secondary}</div>
        </div>
        ${appearance.show
          ? html`
              <div class="values">
                <div class="title-row">
                  <ha-formfield .label=${localize('editor.show_title_label')}>
                    <ha-switch
                      aria-label=${`Toggle title ${this._config?.show_title === false ? 'on' : 'off'}`}
                      .checked=${this._config?.show_title !== false}
                      .configValue=${'show_title'}
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </ha-formfield>
                  ${this._config?.show_title === false
                    ? ''
                    : html`
                        <label class="field title-field">
                          <span class="field-label">${localize('editor.title_label')}</span>
                          <input
                            type="text"
                            .value=${this._title}
                            .placeholder=${this._titlePlaceholder}
                            @input=${this._titleChanged}
                          />
                        </label>
                      `}
                </div>
                <label class="field">
                  <span class="field-label">${localize('editor.hours_to_show_label')}</span>
                  <input
                    type="number"
                    min="1"
                    .value=${this._hours_to_show}
                    .configValue=${'hours_to_show'}
                    @input=${this._valueChanged}
                  />
                </label>
                <label class="field">
                  <span class="field-label">${localize('editor.max_items_label')}</span>
                  <input
                    type="number"
                    min="-1"
                    .value=${this._max_items}
                    .configValue=${'max_items'}
                    @input=${this._valueChanged}
                  />
                </label>
                <label class="field">
                  <span class="field-label">${localize('editor.no_event_label')}</span>
                  <input type="text" .value=${this._no_event} .configValue=${'no_event'} @input=${this._valueChanged} />
                </label>
                <label class="field">
                  <span class="field-label">${localize('editor.collapse_label')}</span>
                  <input
                    type="number"
                    .value=${this._collapse}
                    .configValue=${'collapse'}
                    @input=${this._valueChanged}
                  />
                </label>
                <div class="select-wrap">
                  <label class="select-label">${localize('editor.date_format_label')}</label>
                  <select
                    class="native-select"
                    @change=${(ev: Event) => this._dateFormatChanged((ev.target as HTMLSelectElement).value)}
                  >
                    <option value="" ?selected=${this._date_format === ''}>
                      ${localize('editor.date_format_default')}
                    </option>
                    <option value="relative" ?selected=${this._date_format === 'relative'}>
                      ${localize('editor.date_format_relative')}
                    </option>
                    ${['YYYY-MM-DD HH:mm', 'YYYY-MM-DD', 'MM-DD HH:mm', 'HH:mm'].map(
                      f => html`
                        <option value=${f} ?selected=${this._date_format === f}>${f}</option>
                      `,
                    )}
                    ${this._date_format !== '' &&
                    this._date_format !== 'relative' &&
                    !['YYYY-MM-DD HH:mm', 'YYYY-MM-DD', 'MM-DD HH:mm', 'HH:mm'].includes(this._date_format)
                      ? html`
                          <option value=${this._date_format} ?selected>
                            ${localize('editor.date_format_custom')}（${this._date_format}）
                          </option>
                        `
                      : ''}
                  </select>
                </div>
                <label class="field">
                  <span class="field-label">${localize('editor.minimal_duration_label')}</span>
                  <input
                    type="number"
                    min="0"
                    .value=${this._minimal_duration}
                    .configValue=${'minimal_duration'}
                    @input=${this._valueChanged}
                  />
                </label>
                <ha-formfield .label=${localize('editor.desc_label')}>
                  <ha-switch
                    aria-label=${`Toggle desc ${this._desc ? 'on' : 'off'}`}
                    .checked=${this._desc !== false}
                    .configValue=${'desc'}
                    @change=${this._valueChanged}
                  ></ha-switch>
                </ha-formfield>
                ${this._subSection('show', localize('editor.show_option_name'), this._renderShowToggles())}
                ${this._subSection('layout', localize('editor.layout_option_name'), this._renderLayoutEditor())}
                ${this._subSection('styles', localize('editor.styles_option_name'), this._renderStyleRows())}
                ${this._subSection(
                  'separator',
                  localize('editor.separator_option_name'),
                  this._renderSeparatorFields(),
                )}
              </div>
            `
          : ''}
        <div class="option" @click=${this._toggleOption} .option=${'dataConfig'}>
          <ha-icon class="option-icon" .icon=${`mdi:${dataConfig.icon}`}></ha-icon>
          <div class="option-title">${dataConfig.name}</div>
          <div class="option-secondary">${dataConfig.secondary}</div>
        </div>
        ${dataConfig.show
          ? html`
              <div class="values">
                ${this._subSection('stateMap', localize('editor.state_map_option_name'), this._renderStateMapList())}
                ${this._subSection(
                  'hiddenState',
                  localize('editor.hidden_state_option_name'),
                  this._renderHiddenState(),
                )}
                ${this._subSection(
                  'attributes',
                  localize('editor.attributes_option_name'),
                  this._renderAttributesList(),
                )}
                ${this._subSection('duration', localize('editor.duration_option_name'), this._renderDurationFields())}
              </div>
            `
          : ''}
        <div class="option" @click=${this._toggleOption} .option=${'actions'}>
          <ha-icon class="option-icon" .icon=${`mdi:${actions.icon}`}></ha-icon>
          <div class="option-title">${actions.name}</div>
          <div class="option-secondary">${actions.secondary}</div>
        </div>
        ${actions.show
          ? html`
              <div class="values">
                ${ACTION_KEYS.map(key => this._renderActionBlock(key))}
              </div>
            `
          : ''}
      </div>

      <p class="note">
        ${localize('editor.note')}
      </p>
      <p class="version">logbook-card v${CARD_VERSION}</p>
    `;
  }

  private _renderActionBlock(key: ActionKey): TemplateResult {
    const current = this._actionConfig(key);
    const action = this._actionValue(key);
    const labelKey =
      key === 'tap_action'
        ? 'editor.tap_action_label'
        : key === 'hold_action'
        ? 'editor.hold_action_label'
        : 'editor.double_tap_action_label';

    return html`
      <div class="action-block">
        <p class="sub-title">${localize(labelKey)}</p>
        <select
          class="native-select"
          @change=${(ev: Event) => this._actionFieldChanged(key, 'action', (ev.target as HTMLSelectElement).value)}
        >
          <option value="none" ?selected=${action === 'none'}>
            ${localize('editor.action_none')}
          </option>
          <option value="more-info" ?selected=${action === 'more-info'}>
            ${localize('editor.action_more_info')}
          </option>
          <option value="toggle" ?selected=${action === 'toggle'}>
            ${localize('editor.action_toggle')}
          </option>
          <option value="call-service" ?selected=${action === 'call-service'}>
            ${localize('editor.action_call_service')}
          </option>
          <option value="navigate" ?selected=${action === 'navigate'}>
            ${localize('editor.action_navigate')}
          </option>
          <option value="url" ?selected=${action === 'url'}>
            ${localize('editor.action_url')}
          </option>
        </select>
        ${action === 'navigate'
          ? html`
              <label class="field">
                <span class="field-label">${localize('editor.action_navigation_path_label')}</span>
                <input
                  type="text"
                  .value=${(current as any)?.navigation_path || ''}
                  @input=${(ev: Event) =>
                    this._actionFieldChanged(key, 'navigation_path', (ev.target as HTMLInputElement).value)}
                />
              </label>
            `
          : ''}
        ${action === 'url'
          ? html`
              <label class="field">
                <span class="field-label">${localize('editor.action_url_label')}</span>
                <input
                  type="text"
                  .value=${(current as any)?.url || ''}
                  @input=${(ev: Event) => this._actionFieldChanged(key, 'url', (ev.target as HTMLInputElement).value)}
                />
              </label>
            `
          : ''}
        ${action === 'call-service'
          ? html`
              <label class="field">
                <span class="field-label">${localize('editor.action_service_label')}</span>
                <input
                  type="text"
                  .value=${(current as any)?.service || ''}
                  @input=${(ev: Event) =>
                    this._actionFieldChanged(key, 'service', (ev.target as HTMLInputElement).value)}
                />
              </label>
              <label class="field">
                <span class="field-label">${localize('editor.action_service_data_label')}</span>
                <textarea
                  rows="3"
                  .value=${this._serviceDataText(key)}
                  @input=${(ev: Event) => this._actionServiceDataChanged(key, (ev.target as HTMLTextAreaElement).value)}
                ></textarea>
              </label>
            `
          : ''}
        <label class="field">
          <span class="field-label">${localize('editor.action_haptic_label')}</span>
          <input
            type="text"
            .value=${(current as any)?.haptic || ''}
            @input=${(ev: Event) => this._actionFieldChanged(key, 'haptic', (ev.target as HTMLInputElement).value)}
          />
        </label>
        ${key === 'hold_action'
          ? html`
              <label class="field">
                <span class="field-label">${localize('editor.action_repeat_label')}</span>
                <input
                  type="number"
                  min="0"
                  .value=${(current as any)?.repeat ?? ''}
                  @input=${(ev: Event) =>
                    this._actionFieldChanged(key, 'repeat', (ev.target as HTMLInputElement).value)}
                />
              </label>
            `
          : ''}
      </div>
    `;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _toggleOption(ev: Event): void {
    // 用 currentTarget 替代 target，确保拿到绑定了 .option 属性的父元素
    // CSS 的 pointer-events: none 让子元素不接收点击，但 currentTarget 更可靠
    const target = ev.currentTarget as HTMLElement;
    if (!target || !target.option) return;
    const key = target.option as OptionKey;
    const show = !optionShowState[key];
    // 先全部关闭
    ALL_OPTION_KEYS.forEach(k => {
      optionShowState[k] = false;
    });
    optionShowState[key] = show;
    this._toggle = !this._toggle;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]:
            target.checked !== undefined
              ? target.checked
              : target.attributes['type'] &&
                target.attributes['type'].value === 'number' &&
                Number.parseInt(target.value)
              ? Number.parseInt(target.value)
              : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _showOptionChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (target.configValue) {
      this._config = {
        ...this._config,
        show: {
          ...(this._config.show || DEFAULT_SHOW),
          [target.configValue]: target.checked,
        },
      };
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // ---------- 元素样式（颜色/字号） ----------
  private _elementStyle(key: LayoutElementKey): ElementStyleConfig {
    return this._config?.element_styles?.[key] || {};
  }

  /** 读取主题 CSS 变量的实际值，用于让输入框显示当前生效的默认样式 */
  private _cssVar(name: string, fallback: string): string {
    try {
      const value = getComputedStyle(this)
        .getPropertyValue(name)
        .trim();
      return value || fallback;
    } catch {
      return fallback;
    }
  }

  private _defaultColor(key: LayoutElementKey): string {
    return key === 'time'
      ? this._cssVar('--secondary-text-color', '#7f8ea3')
      : this._cssVar('--primary-text-color', '#000000');
  }

  private _defaultSize(key: LayoutElementKey): string {
    if (key === 'time') {
      return '0.8rem';
    }
    if (key === 'duration') {
      return '0.85rem';
    }
    return '';
  }

  /** 解析元素的字号为数值+单位（未配置时显示当前实际生效的默认值） */
  private _parseFontSize(key: LayoutElementKey): { num: string; unit: string } {
    const round = (n: number) => String(Math.round(n * 100) / 100);
    const raw = (this._elementStyle(key).font_size || '').trim();
    const m = /^(\d*\.?\d+)(rem|px|em|%)$/.exec(raw);
    if (m) {
      return { num: round(parseFloat(m[1])), unit: m[2] };
    }
    const def = this._defaultSize(key) || '1rem';
    const dm = /^(\d*\.?\d+)(rem|px|em|%)$/.exec(def);
    return dm ? { num: round(parseFloat(dm[1])), unit: dm[2] } : { num: '1', unit: 'rem' };
  }

  private _styleRow(key: LayoutElementKey): TemplateResult {
    const style = this._elementStyle(key);
    const parsed = this._parseFontSize(key);
    const range = SIZE_RANGE[parsed.unit] ?? SIZE_RANGE.rem;
    const writeSize = (num: string, unit: string) => this._styleSizeChanged(key, num, unit);
    return html`
      <div class="style-row">
        <span class="style-label">${localize(`editor.layout_elem_${key}`)}</span>
        <input
          type="color"
          class="style-color"
          .value=${style.color || this._defaultColor(key)}
          @change=${(ev: Event) => this._styleColorChanged(key, ev)}
        />
        <div class="size-ctrl">
          <input
            type="range"
            class="size-slider"
            title=${localize('editor.style_size_label')}
            min=${range.min}
            max=${range.max}
            step=${range.step}
            .value=${parsed.num}
            @input=${(ev: Event) => writeSize((ev.target as HTMLInputElement).value, parsed.unit)}
          />
          <input
            type="number"
            class="size-num"
            min=${range.min}
            max=${range.max}
            step=${range.step}
            .value=${parsed.num}
            @input=${(ev: Event) => writeSize((ev.target as HTMLInputElement).value, parsed.unit)}
          />
          <select
            class="size-unit"
            title=${localize('editor.font_unit_label')}
            @change=${(ev: Event) => writeSize(parsed.num, (ev.target as HTMLSelectElement).value)}
          >
            ${FONT_UNITS.map(
              u => html`
                <option value=${u} ?selected=${parsed.unit === u}>${u}</option>
              `,
            )}
          </select>
        </div>
        <button
          type="button"
          class="style-clear"
          title=${localize('editor.style_clear_label')}
          @click=${() => this._styleClear(key)}
        >
          ✕
        </button>
      </div>
    `;
  }

  private _writeElementStyles(key: LayoutElementKey, style: ElementStyleConfig | undefined): void {
    if (!this._config || !this.hass) {
      return;
    }
    const styles = { ...(this._config.element_styles || {}) };
    if (style && Object.keys(style).length > 0) {
      styles[key] = style;
    } else {
      delete styles[key];
    }
    const cfg = { ...this._config };
    if (Object.keys(styles).length === 0) {
      delete cfg.element_styles;
    } else {
      cfg.element_styles = styles;
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _styleColorChanged(key: LayoutElementKey, ev: Event): void {
    const color = (ev.target as HTMLInputElement).value;
    const current = this._elementStyle(key);
    const style: ElementStyleConfig = {};
    if (color) {
      style.color = color;
    }
    if (current.font_size) {
      style.font_size = current.font_size;
    }
    this._writeElementStyles(key, Object.keys(style).length > 0 ? style : undefined);
  }

  private _styleSizeChanged(key: LayoutElementKey, num: string, unit: string): void {
    const current = this._elementStyle(key);
    const style: ElementStyleConfig = {};
    if (current.color) {
      style.color = current.color;
    }
    const n = parseFloat(num);
    if (num !== '' && !Number.isNaN(n) && n > 0) {
      style.font_size = `${Math.round(n * 100) / 100}${unit}`;
    }
    this._writeElementStyles(key, Object.keys(style).length > 0 ? style : undefined);
  }

  private _styleClear(key: LayoutElementKey): void {
    this._writeElementStyles(key, undefined);
  }

  // ---------- hidden_state ----------
  private _hiddenStateChanged(ev): void {
    if (!this._config || !this.hass) return;
    const lines = String(ev.target.value)
      .split('\n')
      .map(s => s.trim())
      .filter(s => s !== '');
    const cfg = { ...this._config };
    if (lines.length === 0) {
      delete cfg.hidden_state;
    } else {
      cfg.hidden_state = lines;
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // ---------- state_map ----------
  private _addStateMapItem(): void {
    if (!this._config || !this.hass) return;
    const list = [...this._state_map, { value: '', label: '' }];
    this._config = { ...this._config, state_map: list };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _removeStateMapItem(index: number): void {
    if (!this._config || !this.hass) return;
    const list = [...this._state_map];
    list.splice(index, 1);
    const cfg = { ...this._config };
    if (list.length === 0) {
      delete cfg.state_map;
    } else {
      cfg.state_map = list;
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _updateStateMapItem(index: number, field: string, value: string): void {
    if (!this._config || !this.hass) return;
    const list = this._state_map.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    this._config = { ...this._config, state_map: list };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // ---------- attributes ----------
  private _addAttributeItem(): void {
    if (!this._config || !this.hass) return;
    const list = [...this._attributes, { value: '' }];
    this._config = { ...this._config, attributes: list };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _removeAttributeItem(index: number): void {
    if (!this._config || !this.hass) return;
    const list = [...this._attributes];
    list.splice(index, 1);
    const cfg = { ...this._config };
    if (list.length === 0) {
      delete cfg.attributes;
    } else {
      cfg.attributes = list;
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _updateAttributeItem(index: number, field: string, value: string): void {
    if (!this._config || !this.hass) return;
    const list = this._attributes.map((item, i) => {
      if (i !== index) return item;
      const updated: any = { ...item };
      // value 为必填字段，允许为空（未选择时）；其他字段为空则删除
      if (value === '' && field !== 'value') {
        delete updated[field];
      } else {
        updated[field] = value;
      }
      return updated as AttributeConfig;
    });
    this._config = { ...this._config, attributes: list };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // ---------- separator_style ----------
  private _separatorStyleChanged(field: string, value: string): void {
    if (!this._config || !this.hass) return;
    const cur: any = { ...(this._config.separator_style || {}) };
    if (value === '') {
      delete cur[field];
    } else if (field === 'width') {
      const n = Number.parseInt(value);
      if (!Number.isNaN(n)) cur.width = n;
    } else {
      cur[field] = value;
    }
    const cfg = { ...this._config };
    if (Object.keys(cur).length === 0) {
      delete cfg.separator_style;
    } else {
      cfg.separator_style = cur;
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // ---------- duration ----------
  private _durationFieldChanged(field: string, value: string): void {
    if (!this._config || !this.hass) return;
    const cur: any = { ...(this._config.duration || {}) };

    if (field === 'largest') {
      if (value === '') {
        delete cur.largest;
      } else if (value === 'full') {
        cur.largest = 'full';
      } else {
        const n = Number.parseInt(value);
        if (!Number.isNaN(n)) cur.largest = n;
      }
    } else if (field === 'delimiter') {
      if (value === '') {
        delete cur.delimiter;
      } else {
        cur.delimiter = value;
      }
    } else if (field === 'units') {
      const units = value
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');
      if (units.length > 0) {
        cur.units = units;
      } else {
        delete cur.units;
      }
    } else if (field.startsWith('labels.')) {
      const lf = field.split('.')[1];
      const labels = { ...(cur.labels || {}) };
      if (value === '') {
        delete labels[lf];
      } else {
        labels[lf] = value;
      }
      if (Object.keys(labels).length > 0) {
        cur.labels = labels;
      } else {
        delete cur.labels;
      }
    }

    const cfg = { ...this._config };
    if (Object.keys(cur).length === 0) {
      delete cfg.duration;
    } else {
      cfg.duration = cur;
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // ---------- actions ----------
  private _actionFieldChanged(key: ActionKey, field: string, value: string): void {
    if (!this._config || !this.hass) return;
    const current = (this._config[key] || {}) as any;

    let updated: any;
    if (field === 'action') {
      // 切换动作类型时重置条件字段，保留 haptic
      updated = { action: value };
      if (current.haptic) updated.haptic = current.haptic;
    } else if (value === '') {
      updated = { ...current };
      delete updated[field];
    } else if (field === 'repeat') {
      updated = { ...current };
      const n = Number.parseInt(value);
      if (!Number.isNaN(n)) updated.repeat = n;
    } else {
      updated = { ...current, [field]: value };
    }

    this._config = { ...this._config, [key]: updated };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _actionServiceDataChanged(key: ActionKey, value: string): void {
    if (!this._config || !this.hass) return;
    const current = (this._config[key] || {}) as any;
    const updated = { ...current };

    if (String(value).trim() === '') {
      delete updated.service_data;
    } else {
      try {
        updated.service_data = JSON.parse(value);
      } catch (e) {
        // JSON 无效时忽略本次输入，等待用户补全
        return;
      }
    }

    this._config = { ...this._config, [key]: updated };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles(): CSSResult {
    return css`
      .option {
        padding: 0.6rem 0.75rem;
        margin-bottom: 0.25rem;
        cursor: pointer;
        display: grid;
        grid-template-areas:
          'icon title'
          'icon secondary';
        grid-template-columns: 2rem auto;
        column-gap: 0.5rem;
        border-radius: 10px;
        transition: background 0.15s ease;
      }
      .option:hover {
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .option > * {
        pointer-events: none;
      }
      .option-title {
        grid-area: title;
        font-weight: 500;
      }
      .option-icon {
        grid-area: icon;
        align-self: center;
        color: var(--primary-color);
      }
      .option-secondary {
        grid-area: secondary;
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }
      .values {
        padding: 0.75rem 1rem;
        margin: 0 0.25rem 0.75rem;
        border-left: 2px solid var(--primary-color);
        border-radius: 0 10px 10px 0;
        background: var(--secondary-background-color, transparent);
      }
      .suboption {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 0.6rem;
        margin-top: 0.5rem;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        cursor: pointer;
        background: var(--card-background-color, transparent);
        transition: background 0.15s ease;
      }
      .suboption:hover {
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .suboption > * {
        pointer-events: none;
      }
      .suboption-title {
        flex: 1;
        font-weight: 500;
        font-size: 0.9rem;
      }
      .suboption-chevron {
        color: var(--secondary-text-color);
        --mdc-icon-size: 20px;
      }
      .values.sub-values {
        margin: 0 0 0.5rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--divider-color);
        border-top: none;
        border-radius: 0 0 8px 8px;
        background: var(--card-background-color, transparent);
      }
      ha-select,
      ha-textfield,
      ha-textarea {
        margin-bottom: 1rem;
        display: block;
      }
      ha-formfield {
        display: block;
        margin-inline: 0.5rem;
        margin-block: 1rem;
      }
      ha-switch {
        --mdc-theme-secondary: var(--switch-checked-color);
      }
      .note {
        font-weight: bold;
      }
      .version {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        text-align: right;
        margin-top: 0.5rem;
      }
      .list-row {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0 0.75rem;
        align-items: start;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        padding: 0.75rem;
        padding-top: 1.5rem;
        margin-bottom: 0.75rem;
        background: var(--card-background-color, transparent);
      }
      .list-row .full {
        grid-column: 1 / -1;
      }
      /* HA 原生图标选择器：与行内其他字段对齐 */
      .list-row ha-icon-picker.icon-picker {
        display: block;
        width: 100%;
        --mdc-shape-small: 8px;
      }
      .remove-btn {
        position: absolute;
        top: 0.4rem;
        right: 0.4rem;
        border: none;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
      }
      .remove-btn:hover {
        color: var(--error-color);
        background: var(--secondary-background-color);
      }
      .add-btn {
        width: 100%;
        border: 1px dashed var(--divider-color);
        background: none;
        color: var(--primary-color);
        padding: 0.6rem;
        border-radius: 8px;
        cursor: pointer;
        font: inherit;
        font-weight: 500;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .add-btn:hover {
        border-color: var(--primary-color);
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .select-wrap {
        margin-bottom: 1rem;
      }
      .field {
        display: block;
        margin-bottom: 1rem;
      }
      .field.full {
        grid-column: 1 / -1;
      }
      .field-label {
        display: block;
        font-size: 0.85rem;
        color: var(--secondary-text-color);
        margin-bottom: 0.25rem;
      }
      .layout-preview {
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        padding: 0.65rem 0.75rem;
        margin-bottom: 0.75rem;
        background: var(--card-background-color, transparent);
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .layout-preview-row {
        display: flex;
        align-items: baseline;
        gap: 0.4rem;
        min-height: 1.5rem;
      }
      .layout-preview-side {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: baseline;
      }
      .layout-preview-right {
        margin-left: auto;
      }
      .layout-chip {
        font-size: 0.8rem;
        padding: 0.12rem 0.55rem;
        border-radius: 999px;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        white-space: nowrap;
      }
      .layout-config {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-bottom: 0.75rem;
      }
      .layout-config-row {
        display: grid;
        grid-template-columns: minmax(4.5rem, auto) 1fr 1fr 2.1rem 2.1rem;
        gap: 0.5rem;
        align-items: center;
        padding: 0.3rem 0.5rem;
        border-radius: 8px;
        transition: background 0.15s ease;
      }
      .layout-config-row:hover {
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .layout-config-name {
        font-size: 0.9rem;
      }
      .layout-config-row .native-select {
        margin-bottom: 0;
        padding: 0.4rem 0.5rem;
        font-size: 0.85rem;
      }
      .layout-btn {
        border: 1px solid var(--divider-color, #ddd);
        background: transparent;
        border-radius: 6px;
        width: 28px;
        height: 26px;
        padding: 0;
        cursor: pointer;
        line-height: 1;
        font-size: 0.7rem;
        color: var(--primary-text-color);
        transition: border-color 0.15s ease, color 0.15s ease;
      }
      .layout-btn:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .field input,
      .field textarea,
      .style-size {
        width: 100%;
        padding: 0.55rem 0.7rem;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
        box-sizing: border-box;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .field textarea {
        resize: vertical;
      }
      .field input:focus,
      .field textarea:focus,
      .style-size:focus,
      select.native-select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      .select-label {
        display: block;
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        margin-bottom: 0.25rem;
      }
      .sep-styles {
        display: flex;
        gap: 0.4rem;
        margin-bottom: 1rem;
      }
      .sep-style-btn {
        flex: 1;
        height: 34px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, transparent);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .sep-style-btn:hover {
        border-color: var(--primary-color);
      }
      .sep-style-btn.active {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      .sep-style-line {
        display: block;
        width: 70%;
        border-top: 3px solid var(--primary-text-color);
      }
      select.native-select {
        width: 100%;
        padding: 0.55rem 0.7rem;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
        box-sizing: border-box;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .action-block {
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
      }
      .sub-title {
        font-weight: bold;
        margin: 0 0 0.5rem;
      }
      .hint {
        color: var(--secondary-text-color);
        font-size: 0.8rem;
        margin: 0 0 0.75rem;
      }
      .style-row {
        display: grid;
        grid-template-columns: minmax(6.5rem, auto) 3rem 1fr 2rem;
        gap: 0.5rem;
        align-items: center;
        padding: 0.3rem 0.5rem;
        border-radius: 8px;
      }
      .style-row:hover {
        background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      }
      .style-head {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
      }
      .style-head:hover {
        background: none;
      }
      .style-label {
        display: flex;
        flex-direction: column;
        font-size: 0.9rem;
        line-height: 1.3;
      }
      .style-default {
        font-size: 0.7rem;
        color: var(--secondary-text-color);
      }
      .style-color {
        width: 3rem;
        height: 34px;
        padding: 2px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: transparent;
        cursor: pointer;
        box-sizing: border-box;
      }
      .style-clear {
        border: none;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 0.85rem;
        padding: 0.25rem;
        border-radius: 6px;
        line-height: 1;
      }
      .style-clear:hover {
        color: var(--error-color);
        background: var(--secondary-background-color);
      }
      .title-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .title-field {
        flex: 1;
      }
      .title-row ha-formfield {
        margin-block: 0;
        white-space: nowrap;
      }
      .size-ctrl {
        display: grid;
        grid-template-columns: 1fr 4.2rem 4rem;
        gap: 0.4rem;
        align-items: center;
      }
      .size-slider {
        width: 100%;
        margin: 0;
        accent-color: var(--primary-color);
        cursor: pointer;
      }
      .size-num,
      .size-unit {
        width: 100%;
        padding: 0.4rem 0.35rem;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
        font-size: 0.85rem;
        box-sizing: border-box;
        text-align: center;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .size-num:focus,
      .size-unit:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      .size-unit {
        cursor: pointer;
      }
      .units-row {
        margin-bottom: 0.75rem;
      }
      .units-row > .field-label {
        display: block;
        margin-bottom: 0.35rem;
      }
      .units-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem 1rem;
      }
      .unit-check {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.9rem;
      }
    `;
  }
}
