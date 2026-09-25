import { DEFAULT_SHOW, DEFAULT_DURATION } from './const';
import { LitElement, html, TemplateResult, CSSResult, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent, LovelaceCardEditor, ActionConfig } from 'custom-card-helpers';

import {
  LogbookCardConfig,
  EntityCardConfig,
  StateMap,
  AttributeConfig,
  LayoutElementKey,
  LayoutConfiguration,
  ElementStyleConfig,
  ElementStylesConfiguration,
  ShowConfiguration,
} from './types';
import { normalizeLayout, layoutRows } from './layout';
import { localize, setHass } from './localize/localize';
import { CARD_VERSION } from './const';

/**
 * 动态构建选项对象 — 在 render 时调用，确保 localize() 能拿到正确的 hass 语言
 * show 状态保存在独立的 _showState 中，与 label 翻译解耦
 */
type OptionKey = 'required' | 'general' | 'appearance' | 'dataConfig' | 'actions';

const ALL_OPTION_KEYS: OptionKey[] = ['required', 'general', 'appearance', 'dataConfig', 'actions'];

/** 日期格式预设（下拉可选项） */
const DATE_PRESETS = ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD', 'MM-DD HH:mm', 'HH:mm'];

/** 日期格式「自定义」选项的哨兵值：选中后显示格式输入框 */
const DATE_FORMAT_CUSTOM = '__custom__';

const optionShowState: Record<OptionKey, boolean> = {
  required: true,
  general: false,
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
    general: {
      icon: 'cog',
      nameKey: 'editor.general_option_name',
      secondaryKey: 'editor.general_option_description',
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

/** 外观配置束：show / layout / element_styles 三件套（全局与实体级共用） */
interface AppearanceBundle {
  show?: ShowConfiguration;
  layout?: LayoutConfiguration;
  element_styles?: ElementStylesConfiguration;
}

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
  /** 多实体模式下正在编辑的实体索引（entities 数组下标） */
  @state() private _activeEntityIndex = 0;
  /** 外观配置的作用目标实体（entities 下标）；外观始终按实体编辑，未配置的字段回退全局配置 */
  @state() private _appearanceTarget = 0;
  /** 日期格式是否处于自定义输入模式（选中「自定义」或 YAML 已配置非预设格式） */
  @state() private _dateFormatCustom = false;

  /** 外观配置读取：实体级 show/element_styles 键级合并在全局之上，layout 整体取实体（未配置回退全局） */
  private _appearanceBundle(): AppearanceBundle {
    const cfg = this._config;
    const e = (cfg?.entities ?? [])[this._appearanceTarget];
    return {
      show: e?.show ? { ...cfg?.show, ...e.show } : cfg?.show,
      layout: e?.layout ?? cfg?.layout,
      element_styles: e?.element_styles ? { ...cfg?.element_styles, ...e.element_styles } : cfg?.element_styles,
    };
  }

  /** 当前外观目标实体自身的配置（不含全局回退），写回时使用 */
  private _appearanceOwnEntity(): EntityCardConfig {
    const entities = this._config?.entities ?? [];
    const idx = Math.min(Math.max(this._appearanceTarget, 0), Math.max(entities.length - 1, 0));
    return entities[idx] ?? {};
  }

  /** 写回外观配置到目标实体（patch 中提供的字段整体替换；空对象删除键） */
  private _writeAppearance(patch: Partial<AppearanceBundle>): void {
    if (!this._config || !this.hass) {
      return;
    }
    const cfg: any = { ...this._config };
    const entities: EntityCardConfig[] = [...(cfg.entities ?? [])];
    const idx = Math.min(Math.max(this._appearanceTarget, 0), Math.max(entities.length - 1, 0));
    const cur = { ...entities[idx] };
    if (patch.show !== undefined) {
      cur.show = Object.keys(patch.show).length > 0 ? patch.show : undefined;
    }
    if (patch.layout !== undefined) {
      cur.layout = patch.layout;
    }
    if (patch.element_styles !== undefined) {
      cur.element_styles = Object.keys(patch.element_styles).length > 0 ? patch.element_styles : undefined;
    }
    entities[idx] = cur;
    cfg.entities = entities;
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  /** 当前外观目标实体的属性数量（决定布局中的属性条目数） */
  private _appearanceAttrCount(): number {
    const e = this._appearanceOwnEntity();
    return Array.isArray(e.attributes) ? e.attributes.length : 0;
  }

  /** 属性布局条目的显示名：显示名 > 属性名 > 属性 N */
  private _attrKeyLabel(key: LayoutElementKey): string {
    const m = /^attributes:(\d+)$/.exec(String(key));
    if (!m) {
      return localize(`editor.layout_elem_${key}`);
    }
    const index = Number.parseInt(m[1]);
    const attr = this._appearanceAttrs()[index];
    const name = attr?.label || attr?.value;
    return name
      ? `${localize('editor.layout_elem_attributes')} · ${name}`
      : `${localize('editor.layout_elem_attributes')} ${index + 1}`;
  }

  /** 当前外观目标实体的属性配置列表 */
  private _appearanceAttrs(): AttributeConfig[] {
    const attrs = this._appearanceOwnEntity().attributes;
    return Array.isArray(attrs) ? (attrs as AttributeConfig[]) : [];
  }

  // ---------- 多实体模式（entities 数组存在即为多实体卡片） ----------
  /** 编辑器统一按多实体结构工作：单实体旧配置规范化为单条 entities（保存时写回 entities 格式） */
  private _normalizeConfig(config: LogbookCardConfig): LogbookCardConfig {
    if (Array.isArray(config.entities)) {
      return config;
    }
    const entityConfig: EntityCardConfig = {
      entity: config.entity,
      label: undefined,
      attributes: config.attributes,
      state_map: config.state_map,
      hidden_state: config.hidden_state,
      custom_logs: config.custom_logs,
      custom_log_map: config.custom_log_map,
    };
    const cfg: any = { ...config };
    delete cfg.entity;
    delete cfg.attributes;
    delete cfg.state_map;
    delete cfg.hidden_state;
    delete cfg.custom_logs;
    delete cfg.custom_log_map;
    cfg.entities = [entityConfig];
    return cfg;
  }

  /** 正在编辑的实体配置 */
  private get _activeEntity(): EntityCardConfig | undefined {
    const entities = this._config?.entities;
    if (!Array.isArray(entities) || entities.length === 0) {
      return undefined;
    }
    return entities[Math.min(this._activeEntityIndex, entities.length - 1)];
  }

  /** 读取当前编辑实体的字段（编辑器统一按多实体结构工作） */
  private readEntityField<K extends keyof EntityCardConfig>(key: K): EntityCardConfig[K] | undefined {
    return this._activeEntity?.[key];
  }

  /** 写入当前编辑实体的字段：value 为 undefined 时删除该键；完成后触发 config-changed */
  private writeEntityField<K extends keyof EntityCardConfig>(key: K, value: EntityCardConfig[K] | undefined): void {
    if (!this._config || !this.hass) {
      return;
    }
    const cfg: any = { ...this._config };
    const entities: EntityCardConfig[] = [...(cfg.entities ?? [])];
    if (entities.length === 0) {
      entities.push({});
    }
    const idx = Math.min(Math.max(this._activeEntityIndex, 0), entities.length - 1);
    const cur = { ...entities[idx] };
    if (value === undefined) {
      delete cur[key];
    } else {
      cur[key] = value;
    }
    entities[idx] = cur;
    cfg.entities = entities;
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  /** 多实体模式下实体在列表中的显示名：显示名 > 实体友好名 > entity_id */
  private _entityDisplayName(entity: EntityCardConfig, index: number): string {
    if (entity.label) {
      return entity.label;
    }
    const id = entity.entity;
    const friendly =
      id && this.hass?.states && id in this.hass.states
        ? (this.hass.states[id] as any).attributes?.friendly_name
        : undefined;
    return friendly || id || `${localize('editor.entity_label')} ${index + 1}`;
  }

  // ---------- 多实体：实体列表管理 ----------
  private _addEntity(): void {
    if (!this._config || !this.hass) {
      return;
    }
    const cfg: any = { ...this._config };
    cfg.entities = [...(cfg.entities ?? []), { entity: '' }];
    this._config = cfg;
    this._activeEntityIndex = cfg.entities.length - 1;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _removeEntity(index: number): void {
    if (!this._config || !this.hass) {
      return;
    }
    const cfg: any = { ...this._config };
    const entities: EntityCardConfig[] = [...(cfg.entities ?? [])];
    entities.splice(index, 1);
    cfg.entities = entities;
    if (this._activeEntityIndex >= entities.length) {
      this._activeEntityIndex = Math.max(0, entities.length - 1);
    }
    if (this._appearanceTarget > entities.length - 1) {
      this._appearanceTarget = Math.max(0, entities.length - 1);
    }
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _updateEntityField(index: number, key: 'entity' | 'label', value: string): void {
    if (!this._config || !this.hass) {
      return;
    }
    const cfg: any = { ...this._config };
    const entities: EntityCardConfig[] = [...(cfg.entities ?? [])];
    const cur = { ...entities[index] };
    if (value === '') {
      delete cur[key];
    } else {
      cur[key] = value;
    }
    entities[index] = cur;
    cfg.entities = entities;
    this._config = cfg;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _renderEntitiesList(): TemplateResult {
    const entities = Array.isArray(this._config?.entities) ? this._config!.entities : [];
    return html`
      <p class="hint">${localize('editor.entity_list_hint')}</p>
      ${entities.map(
        (e, i) => html`
          <div class="list-row entity-row ${this._activeEntityIndex === i ? 'active' : ''}">
            <button
              class="remove-btn"
              title=${localize('editor.remove_item_label')}
              @click=${() => this._removeEntity(i)}
            >
              ✕
            </button>
            <div class="entity-row-index">${i + 1}</div>
            <ha-entity-picker
              class="full"
              .hass=${this.hass}
              .label=${localize('editor.entity_label')}
              .value=${e.entity ?? ''}
              .allowCustomEntity=${false}
              @value-changed=${(ev: CustomEvent) =>
                this._updateEntityField(i, 'entity', (ev.detail?.value as string) ?? '')}
            ></ha-entity-picker>
            <label class="field full">
              <span class="field-label">${localize('editor.entity_label_label')}</span>
              <input
                type="text"
                .value=${e.label ?? ''}
                .placeholder=${this._entityDisplayName(e, i)}
                @input=${(ev: Event) => this._updateEntityField(i, 'label', (ev.target as HTMLInputElement).value)}
              />
            </label>
          </div>
        `,
      )}
      <button class="add-btn" @click=${this._addEntity}>${localize('editor.add_item_label')}</button>
    `;
  }

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
      <ha-formfield .label=${localize('editor.show_entity_name_label')}>
        <ha-switch
          aria-label=${`Toggle display of entity name ${this._show_entity_name ? 'off' : 'on'}`}
          .checked=${this._show_entity_name}
          .configValue=${'entity_name'}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
      <p class="sub-hint">${localize('editor.card_wide_label')}</p>
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
  /** 当前外观目标的布局元素键列表（基础元素 + 每个属性一个键） */
  private _layoutKeys(): LayoutElementKey[] {
    const count = this._appearanceAttrCount();
    const keys: LayoutElementKey[] = ['state', 'duration'];
    for (let i = 0; i < count; i++) {
      keys.push(`attributes:${i}`);
    }
    keys.push('time');
    return keys;
  }

  /** 每个元素当前所在的行与对齐（从布局配置反解析） */
  private _layoutAssign(): Record<string, { row: number; align: 'left' | 'right' }> {
    const layout = this._appearanceBundle().layout;
    const plan = normalizeLayout(layout, this._appearanceAttrCount());
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
    const rows = layoutRows(this._appearanceBundle().layout, this._appearanceAttrCount());
    const chip = (key: LayoutElementKey) =>
      html`
        <span class="layout-chip">${this._attrKeyLabel(key)}</span>
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
    const layoutKeys = this._layoutKeys();
    return html`
      <p class="hint">${localize('editor.layout_hint')}</p>
      ${this._renderLayoutPreview()}
      <div class="layout-config">
        ${layoutKeys.map(key => {
          const a = assign[key] ?? { row: 1, align: 'left' };
          return html`
            <div class="layout-config-row">
              <span class="layout-config-name">${this._attrKeyLabel(key)}</span>
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

  /** 把元素行/对齐配置写回布局配置（组内顺序沿用 baseOrder 或当前显示顺序） */
  private _writeLayoutAssign(
    assign: Record<string, { row: number; align: 'left' | 'right' }>,
    baseOrder?: LayoutElementKey[],
  ): void {
    if (!this._config || !this.hass) {
      return;
    }
    const layoutKeys = this._layoutKeys();
    const currentOrder =
      baseOrder ?? normalizeLayout(this._appearanceBundle().layout, this._appearanceAttrCount()).map(item => item.key);
    const idxOf = (k: LayoutElementKey) => {
      const i = currentOrder.indexOf(k);
      return i < 0 ? 99 : i;
    };
    const rowNums = Array.from(new Set(layoutKeys.map(k => assign[k]?.row ?? 1))).sort((a, b) => a - b);
    const order: LayoutElementKey[] = [];
    const lineBreaks: LayoutElementKey[] = [];
    rowNums.forEach((r, i) => {
      const inRow = layoutKeys.filter(k => (assign[k]?.row ?? 1) === r);
      const left = inRow.filter(k => (assign[k]?.align ?? 'left') === 'left').sort((a, b) => idxOf(a) - idxOf(b));
      const right = inRow.filter(k => (assign[k]?.align ?? 'left') === 'right').sort((a, b) => idxOf(a) - idxOf(b));
      order.push(...left, ...right);
      if (i < rowNums.length - 1) {
        lineBreaks.push(order[order.length - 1]);
      }
    });
    const layout: LayoutConfiguration = { order, line_breaks: lineBreaks };
    const align: Partial<Record<LayoutElementKey, 'right'>> = {};
    layoutKeys.forEach(k => {
      if ((assign[k]?.align ?? 'left') === 'right') {
        align[k] = 'right';
      }
    });
    if (Object.keys(align).length > 0) {
      layout.align = align;
    }
    this._writeAppearance({ layout });
  }

  private _layoutRowChanged(key: LayoutElementKey, row: number): void {
    if (Number.isNaN(row)) {
      return;
    }
    const assign = this._layoutAssign();
    assign[key] = { ...(assign[key] ?? { row: 1, align: 'left' }), row };
    this._writeLayoutAssign(assign);
  }

  private _layoutAlignChanged(key: LayoutElementKey, align: 'left' | 'right'): void {
    const assign = this._layoutAssign();
    assign[key] = { ...(assign[key] ?? { row: 1, align: 'left' }), align };
    this._writeLayoutAssign(assign);
  }

  /** 同行同侧内调整顺序：交换两个元素在显示序列中的位置 */
  private _layoutOrderMove(key: LayoutElementKey, dir: -1 | 1): void {
    const order = normalizeLayout(this._appearanceBundle().layout, this._appearanceAttrCount()).map(item => item.key);
    const assign = this._layoutAssign();
    const layoutKeys = this._layoutKeys();
    const group = layoutKeys.filter(
      k =>
        (assign[k]?.row ?? 1) === (assign[key]?.row ?? 1) &&
        (assign[k]?.align ?? 'left') === (assign[key]?.align ?? 'left'),
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
      <ha-formfield .label=${localize('editor.display_separator_label')}>
        <ha-switch
          aria-label=${`Toggle display of event separator ${this._show_separator ? 'off' : 'on'}`}
          .checked=${this._show_separator}
          .configValue=${'separator'}
          @change=${this._showOptionChanged}
        ></ha-switch>
      </ha-formfield>
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

  /** 通用实体目标选择器：外观与数据配置共用（选择配置作用于哪个实体） */
  private _renderEntityTargetSelector(
    label: string,
    activeIndex: number,
    onSelect: (idx: number) => void,
  ): TemplateResult {
    const entities = Array.isArray(this._config?.entities) ? this._config!.entities : [];
    if (entities.length === 0) {
      return html``;
    }
    return html`
      <div class="select-wrap">
        <label class="select-label">${label}</label>
        <select
          class="native-select"
          @change=${(ev: Event) => {
            const idx = Number.parseInt((ev.target as HTMLSelectElement).value);
            if (!Number.isNaN(idx)) {
              onSelect(idx);
            }
          }}
        >
          ${entities.map(
            (e, i) => html`
              <option value=${i} ?selected=${activeIndex === i}>${this._entityDisplayName(e, i)}</option>
            `,
          )}
        </select>
      </div>
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
              <span class="field-label">${localize('editor.state_map_replacement_label')}</span>
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
          <div class="attr-map-block">
            ${(item.state_map ?? []).map(
              (m, mi) => html`
                <div class="list-row attr-map-row">
                  <button
                    class="remove-btn"
                    title=${localize('editor.remove_item_label')}
                    @click=${() => this._removeAttributeStateMapItem(i, mi)}
                  >
                    ✕
                  </button>
                  <label class="field">
                    <span class="field-label">${localize('editor.attribute_map_value_label')}</span>
                    <input
                      type="text"
                      .value=${m.value || ''}
                      @input=${(ev: Event) =>
                        this._updateAttributeStateMapItem(i, mi, 'value', (ev.target as HTMLInputElement).value)}
                    />
                  </label>
                  <label class="field">
                    <span class="field-label">${localize('editor.state_map_replacement_label')}</span>
                    <input
                      type="text"
                      .value=${m.replacement || ''}
                      @input=${(ev: Event) =>
                        this._updateAttributeStateMapItem(i, mi, 'replacement', (ev.target as HTMLInputElement).value)}
                    />
                  </label>
                </div>
              `,
            )}
            <button class="add-btn" @click=${() => this._addAttributeStateMapItem(i)}>
              ${localize('editor.attribute_map_add_label')}
            </button>
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

  /** 日期格式下拉变化：选「自定义」只切换输入框显示，选其他项收起输入框并写值 */
  private _dateFormatSelectChanged(value: string): void {
    if (!this._config || !this.hass) {
      return;
    }
    if (value === DATE_FORMAT_CUSTOM) {
      this._dateFormatCustom = true;
      return;
    }
    this._dateFormatCustom = false;
    this._writeDateFormat(value);
  }

  /**
   * 自定义格式输入框输入：只写值，不改动 _dateFormatCustom。
   * 若在此重置显示状态，重渲染会移除输入框，导致每输入一个字符就失去焦点
   */
  private _dateFormatInputChanged(value: string): void {
    this._writeDateFormat(value);
  }

  private _writeDateFormat(value: string): void {
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
    this._config = this._normalizeConfig(config);
    // 外观目标实体下标越界保护
    const count = Array.isArray(this._config?.entities) ? this._config!.entities!.length : 0;
    this._appearanceTarget = Math.min(Math.max(this._appearanceTarget, 0), Math.max(count - 1, 0));
    // YAML 已配置非预设格式时，日期格式下拉定位到「自定义」并显示输入框
    this._dateFormatCustom = this._isCustomDateFormat;
  }

  get _title(): string {
    // 只显示用户显式配置的标题；留空 = 不显示标题（卡片侧隐藏）
    return this._config?.title ?? '';
  }

  /** 标题输入框的占位提示（展示卡片默认会用的标题；多实体取第一个实体） */
  get _titlePlaceholder(): string {
    const entity = (this._config?.entities ?? [])[0]?.entity;
    const friendly =
      entity && this.hass?.states && entity in this.hass.states
        ? (this.hass.states[entity] as any).attributes?.friendly_name
        : undefined;
    return friendly
      ? localize('logbook_card.default_title', '{entity}', friendly)
      : localize('editor.title_placeholder');
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

  /** 当前日期格式是否为自定义（非空、非 relative、非预设） */
  get _isCustomDateFormat(): boolean {
    const f = this._date_format;
    return !!f && f !== 'relative' && !DATE_PRESETS.includes(f);
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

  // ---------- 显示开关（读外观目标载体的 show 配置） ----------
  private _showValue(key: keyof ShowConfiguration): boolean | undefined {
    const show = this._appearanceBundle().show;
    return show && show[key] !== undefined ? show[key] : DEFAULT_SHOW[key];
  }

  get _show_state(): boolean {
    return this._showValue('state') !== false;
  }

  get _show_duration(): boolean {
    return this._showValue('duration') !== false;
  }

  get _show_start_date(): boolean {
    return this._showValue('start_date') !== false;
  }

  get _show_end_date(): boolean {
    return this._showValue('end_date') !== false;
  }

  get _show_icon(): boolean {
    return this._showValue('icon') === true;
  }

  get _show_separator(): boolean {
    return this._showValue('separator') !== false;
  }

  get _show_entity_name(): boolean {
    return this._showValue('entity_name') !== false;
  }

  get _custom_logs(): boolean {
    return this.readEntityField('custom_logs') === true;
  }

  get _attribute_hide_label(): boolean {
    return this._config?.attribute_hide_label === true;
  }

  /** 读取当前实体的属性名列表，供属性下拉选择（多实体模式取正在编辑的实体） */
  private _entityAttributeNames(): string[] {
    const entity = this._activeEntity?.entity;
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
    const sm = this.readEntityField('state_map');
    return Array.isArray(sm) ? (sm as Array<StateMap>) : [];
  }

  get _attributes(): Array<AttributeConfig> {
    const attrs = this.readEntityField('attributes');
    return Array.isArray(attrs) ? (attrs as Array<AttributeConfig>) : [];
  }

  get _hidden_state_text(): string {
    const hs = this.readEntityField('hidden_state');
    if (Array.isArray(hs) && hs.every(s => typeof s === 'string')) {
      return (hs as string[]).join('\n');
    }
    return '';
  }

  get _hidden_state_has_objects(): boolean {
    const hs = this.readEntityField('hidden_state');
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
    const general = buildOption('general');
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
                ${this._renderEntitiesList()}
              </div>
            `
          : ''}
        <div class="option" @click=${this._toggleOption} .option=${'general'}>
          <ha-icon class="option-icon" .icon=${`mdi:${general.icon}`}></ha-icon>
          <div class="option-title">${general.name}</div>
          <div class="option-secondary">${general.secondary}</div>
        </div>
        ${general.show
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
                    @change=${(ev: Event) => this._dateFormatSelectChanged((ev.target as HTMLSelectElement).value)}
                  >
                    <option value="" ?selected=${this._date_format === ''}>
                      ${localize('editor.date_format_default')}
                    </option>
                    <option value="relative" ?selected=${this._date_format === 'relative'}>
                      ${localize('editor.date_format_relative')}
                    </option>
                    ${DATE_PRESETS.map(
                      f => html`
                        <option value=${f} ?selected=${!this._dateFormatCustom && this._date_format === f}>${f}</option>
                      `,
                    )}
                    <option value=${DATE_FORMAT_CUSTOM} ?selected=${this._dateFormatCustom}>
                      ${localize('editor.date_format_custom')}
                    </option>
                  </select>
                  ${this._dateFormatCustom
                    ? html`
                        <label class="field">
                          <span class="field-label">${localize('editor.date_format_custom_input')}</span>
                          <input
                            type="text"
                            .value=${this._date_format}
                            placeholder="YYYY-MM-DD HH:mm:ss"
                            @input=${(ev: Event) => this._dateFormatInputChanged((ev.target as HTMLInputElement).value)}
                          />
                        </label>
                      `
                    : ''}
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
                ${this._renderEntityTargetSelector(
                  localize('editor.appearance_target_label'),
                  this._appearanceTarget,
                  idx => (this._appearanceTarget = idx),
                )}
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
                ${this._renderEntityTargetSelector(
                  localize('editor.data_target_entity_label'),
                  this._activeEntityIndex,
                  idx => (this._activeEntityIndex = idx),
                )}
                <ha-formfield .label=${localize('editor.display_custom_logs_label')}>
                  <ha-switch
                    aria-label=${`Toggle display of custom logs ${this._custom_logs ? 'off' : 'on'}`}
                    .checked=${this._custom_logs}
                    @change=${(ev: Event) =>
                      this.writeEntityField(
                        'custom_logs',
                        (ev.target as HTMLInputElement).checked === true ? true : undefined,
                      )}
                  ></ha-switch>
                </ha-formfield>
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
    const target = ev.target as any;
    if (!target.configValue) {
      return;
    }
    // 开关类（ha-switch/checkbox）取 checked；原生输入的 checked 恒有值（非复选框为 false），不可用于判断
    if (target.tagName === 'HA-SWITCH' || target.type === 'checkbox') {
      if ((this._config as any)[target.configValue] === target.checked) {
        return;
      }
      this._config = { ...this._config, [target.configValue]: target.checked };
      fireEvent(this, 'config-changed', { config: this._config });
      return;
    }
    // 文本/数字输入：与当前值相同则跳过，空值删除键，数字输入转整数
    if (target.value === this[`_${target.configValue}`]) {
      return;
    }
    if (target.value === '') {
      const tmpConfig = { ...this._config };
      delete tmpConfig[target.configValue];
      this._config = tmpConfig;
    } else if (target.type === 'number') {
      const n = Number.parseInt(target.value, 10);
      if (Number.isNaN(n)) {
        return;
      }
      this._config = { ...this._config, [target.configValue]: n };
    } else {
      this._config = { ...this._config, [target.configValue]: target.value };
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _showOptionChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (target.configValue) {
      // 只在目标实体自身 show 上改动（保留已有覆盖键），避免把全局值固化进实体
      const current = { ...(this._appearanceOwnEntity().show ?? {}) };
      current[target.configValue] = target.checked;
      this._writeAppearance({ show: current as ShowConfiguration });
    }
  }

  // ---------- 元素样式（颜色/字号） ----------
  /** 布局键 → 样式存储键（属性们共用一条 attributes 样式） */
  private _styleBaseKey(key: LayoutElementKey): 'state' | 'duration' | 'attributes' | 'time' {
    return (key === 'attributes' || String(key).startsWith('attributes:') ? 'attributes' : key) as
      | 'state'
      | 'duration'
      | 'attributes'
      | 'time';
  }

  private _elementStyle(key: LayoutElementKey): ElementStyleConfig {
    return this._appearanceBundle().element_styles?.[this._styleBaseKey(key)] || {};
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
    const baseKey = this._styleBaseKey(key);
    // 只在目标实体自身 element_styles 上改动（保留已有覆盖键），避免把全局值固化进实体
    const styles = { ...(this._appearanceOwnEntity().element_styles || {}) };
    if (style && Object.keys(style).length > 0) {
      styles[baseKey] = style;
    } else {
      delete styles[baseKey];
    }
    this._writeAppearance({ element_styles: styles });
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

  // ---------- hidden_state（单实体写顶层，多实体写当前实体） ----------
  private _hiddenStateChanged(ev): void {
    if (!this._config || !this.hass) return;
    const lines = String(ev.target.value)
      .split('\n')
      .map(s => s.trim())
      .filter(s => s !== '');
    this.writeEntityField('hidden_state', lines.length > 0 ? lines : undefined);
  }

  // ---------- state_map（单实体写顶层，多实体写当前实体） ----------
  private _addStateMapItem(): void {
    if (!this._config || !this.hass) return;
    const list = [...this._state_map, { value: '', label: '' }];
    this.writeEntityField('state_map', list);
  }

  private _removeStateMapItem(index: number): void {
    if (!this._config || !this.hass) return;
    const list = [...this._state_map];
    list.splice(index, 1);
    this.writeEntityField('state_map', list.length > 0 ? list : undefined);
  }

  private _updateStateMapItem(index: number, field: string, value: string): void {
    if (!this._config || !this.hass) return;
    const list = this._state_map.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    this.writeEntityField('state_map', list);
  }

  // ---------- attributes ----------
  private _addAttributeItem(): void {
    if (!this._config || !this.hass) return;
    const list = [...this._attributes, { value: '' }];
    this.writeEntityField('attributes', list);
  }

  private _removeAttributeItem(index: number): void {
    if (!this._config || !this.hass) return;
    const list = [...this._attributes];
    list.splice(index, 1);
    this.writeEntityField('attributes', list.length > 0 ? list : undefined);
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
    this.writeEntityField('attributes', list);
  }

  // ---------- attributes 的值映射（属性值替换） ----------
  private _addAttributeStateMapItem(attrIndex: number): void {
    if (!this._config || !this.hass) return;
    const list = this._attributes.map((item, i) => {
      if (i !== attrIndex) return item;
      return { ...item, state_map: [...(item.state_map ?? []), { value: '', replacement: '' }] };
    });
    this.writeEntityField('attributes', list);
  }

  private _removeAttributeStateMapItem(attrIndex: number, mapIndex: number): void {
    if (!this._config || !this.hass) return;
    const list = this._attributes.map((item, i) => {
      if (i !== attrIndex) return item;
      const maps = (item.state_map ?? []).filter((_, mi) => mi !== mapIndex);
      const updated: any = { ...item };
      if (maps.length > 0) {
        updated.state_map = maps;
      } else {
        delete updated.state_map;
      }
      return updated as AttributeConfig;
    });
    this.writeEntityField('attributes', list);
  }

  private _updateAttributeStateMapItem(attrIndex: number, mapIndex: number, field: string, value: string): void {
    if (!this._config || !this.hass) return;
    const list = this._attributes.map((item, i) => {
      if (i !== attrIndex) return item;
      const maps = (item.state_map ?? []).map((m, mi) => (mi === mapIndex ? { ...m, [field]: value } : m));
      return { ...item, state_map: maps } as AttributeConfig;
    });
    this.writeEntityField('attributes', list);
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
      ha-formfield {
        display: block;
        margin-inline: 0.5rem;
        margin-block: 1rem;
      }
      ha-switch {
        --mdc-theme-secondary: var(--switch-checked-color);
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
      /* 属性值映射区块：在属性行下方缩进展示 */
      .attr-map-block {
        margin: -0.25rem 0 0.75rem 1.25rem;
      }
      /* 多实体：实体列表行 */
      .entity-row.active {
        border-color: var(--primary-color);
      }
      .entity-row-index {
        position: absolute;
        top: -10px;
        left: 12px;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border-radius: 999px;
        min-width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 0.75rem;
        padding: 0 4px;
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
      .field textarea {
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
      .sub-hint {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        margin: 0.75rem 0.5rem 0;
        padding-top: 0.5rem;
        border-top: 1px dashed var(--divider-color);
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
