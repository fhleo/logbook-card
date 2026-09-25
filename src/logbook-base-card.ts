import { CSSResultGroup, LitElement, TemplateResult, css, html } from 'lit';
import {
  CustomLogEvent,
  ExtendedHomeAssistant,
  LogbookCardConfig,
  LogbookCardConfigBase,
  History,
  HistoryOrCustomLogEvent,
  LayoutElementKey,
  ShowConfiguration,
} from './types';
import { layoutRows } from './layout';
import { property } from 'lit/decorators.js';
import { handleAction, ActionHandlerEvent, hasAction } from 'custom-card-helpers';
import { actionHandler } from './action-handler-directive';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';
import { isSameDay } from './date-helpers';
import { HassEntity } from 'home-assistant-js-websocket/dist/types';

export abstract class LogbookBaseCard extends LitElement {
  @property({ attribute: false }) public hass!: ExtendedHomeAssistant;

  private updateHistoryIntervalId: NodeJS.Timeout | null = null;
  private UPDATE_INTERVAL = 5000;

  /** 多实体（entities 多于 1 个实体）且开启显示实体名时，在每条记录前显示实体名 */
  protected showEntityName(config: LogbookCardConfigBase): boolean {
    return config.show?.entity_name === true && (config.entities?.length ?? 0) > 1;
  }

  protected _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && ev.detail.action && !!ev.target && ev.target['entity']) {
      handleAction(this, this.hass, { entity: ev.target['entity'] }, ev.detail.action);
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.updateHistoryIntervalId = setInterval(() => this.updateHistory(), this.UPDATE_INTERVAL);
    setTimeout(() => this.updateHistory(), 1);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.updateHistoryIntervalId !== null) {
      clearInterval(this.updateHistoryIntervalId);
    }
  }

  abstract updateHistory(): void;

  renderHistory(items: HistoryOrCustomLogEvent[] | undefined, config: LogbookCardConfigBase): TemplateResult {
    if (!items || items?.length === 0) {
      return html`
        <p>
          ${config.no_event}
        </p>
      `;
    }

    if (config.collapse && items.length > config.collapse) {
      const elemId = `expander${Math.random()
        .toString(10)
        .substring(2)}`;
      return html`
        ${this.renderHistoryItems(items.slice(0, config.collapse), undefined, config)}
        <input type="checkbox" class="expand" id="${elemId}" />
        <label for="${elemId}"><div>&lsaquo;</div></label>
        <div>
          ${this.renderHistoryItems(items.slice(config.collapse), items[config.collapse], config)}
        </div>
      `;
    } else {
      return this.renderHistoryItems(items, undefined, config);
    }
  }

  protected renderHistoryItems(
    items: HistoryOrCustomLogEvent[],
    previousItem: HistoryOrCustomLogEvent | undefined,
    config: LogbookCardConfigBase,
  ): TemplateResult {
    return html`
      ${items?.map((item, index, array) => {
        const isLast = index + 1 === array.length;
        const shouldRenderDaySeparator = this.shouldRenderDaySeparator(items, previousItem, index);
        if (item.type === 'history') {
          return html`
            ${shouldRenderDaySeparator ? this.renderDaySeparator(item, config) : ``}
            ${this.renderHistoryItem(item, isLast, config)}
          `;
        }
        return html`
          ${shouldRenderDaySeparator ? this.renderDaySeparator(item, config) : ``}
          ${this.renderCustomLogEvent(item, isLast, config)}
        `;
      })}
    `;
  }

  protected shouldRenderDaySeparator(
    items: HistoryOrCustomLogEvent[],
    previousItem: HistoryOrCustomLogEvent | undefined,
    index: number,
  ): boolean {
    const item = items[index];
    return (
      (previousItem === undefined && index === 0) ||
      (previousItem !== undefined && index === 0 && !isSameDay(item.start, previousItem.start)) ||
      (index > 0 && !isSameDay(item.start, items[index - 1].start))
    );
  }

  /** 读取某元素的用户样式覆盖（字体颜色/大小） */
  protected elementStyleInfo(config: LogbookCardConfigBase, key: LayoutElementKey): StyleInfo {
    const style = config?.element_styles?.[key];
    const info: StyleInfo = {};
    if (style?.color) {
      info.color = style.color;
    }
    if (style?.font_size) {
      info['font-size'] = style.font_size;
    }
    return info;
  }

  /** 条目所属实体的配置：实体级外观（show/layout/element_styles）覆盖卡片全局配置 */
  protected itemConfig(item: History | CustomLogEvent, config: LogbookCardConfigBase): LogbookCardConfigBase {
    const cfg = config as LogbookCardConfig;
    const entityId =
      item instanceof Object && 'stateObj' in item ? item.stateObj?.entity_id : (item as CustomLogEvent).entity;
    const entityCfg = cfg.entities?.find(e => e.entity && e.entity === entityId);
    if (!entityCfg) {
      return config;
    }
    const hasShow = entityCfg.show && Object.keys(entityCfg.show).length > 0;
    const hasStyles = entityCfg.element_styles && Object.keys(entityCfg.element_styles).length > 0;
    if (!hasShow && !entityCfg.layout && !hasStyles) {
      return config;
    }
    return {
      ...config,
      show: hasShow ? ({ ...(config.show ?? {}), ...entityCfg.show } as ShowConfiguration) : config.show,
      layout: entityCfg.layout ?? config.layout,
      element_styles: hasStyles
        ? { ...(config.element_styles ?? {}), ...entityCfg.element_styles }
        : config.element_styles,
    };
  }

  protected renderHistoryItem(item: History, isLast: boolean, config: LogbookCardConfigBase): TemplateResult {
    // 条目所属实体覆盖外观配置（show/layout/element_styles）
    const itemConf = this.itemConfig(item, config);
    // 各元素的显示模板（未开启/无内容的元素不会加入）
    const tpls = new Map<LayoutElementKey, TemplateResult>();
    if (itemConf?.show?.state) {
      tpls.set(
        'state',
        html`
          <span class="state" style=${styleMap(this.elementStyleInfo(itemConf, 'state'))}>${item.label}</span>
        `,
      );
    }
    if (itemConf?.show?.duration) {
      tpls.set(
        'duration',
        html`
          <span class="duration" style=${styleMap(this.elementStyleInfo(itemConf, 'duration'))}>
            <logbook-duration .hass="${this.hass}" .config="${itemConf}" .duration="${item.duration}">
            </logbook-duration>
          </span>
        `,
      );
    }
    // 每个属性作为独立布局元素（attributes:N），未配置布局时属性们同行依次排列
    (item.attributes ?? []).forEach((attr, i) => {
      tpls.set(
        `attributes:${i}`,
        html`
          <div class="attribute" style=${styleMap(this.elementStyleInfo(itemConf, 'attributes'))}>
            ${itemConf?.attribute_hide_label
              ? ''
              : html`
                  <div class="key">${attr.name}</div>
                `}
            <div class="value">${attr.value}</div>
          </div>
        `,
      );
    });
    if (itemConf?.show?.start_date || itemConf?.show?.end_date) {
      tpls.set('time', this.renderHistoryDate(item, itemConf));
    }
    const entityTpl = this.showEntityName(itemConf)
      ? this.renderEntity(item.stateObj.entity_id, item.entity_name, config)
      : undefined;
    // 按行分组渲染：每行分左组与右组（右组靠行尾对齐）
    const layoutPlan = layoutRows(itemConf?.layout, item.attributes?.length ?? 0);
    const rows = layoutPlan
      .map(row => {
        const renderKey = (key: LayoutElementKey): TemplateResult[] => {
          // 实体名跟随状态，显示在状态之前
          if (key === 'state' && entityTpl) {
            return [entityTpl, tpls.get(key)].filter(Boolean) as TemplateResult[];
          }
          const tpl = tpls.get(key);
          return tpl ? [tpl] : [];
        };
        const leftParts = row.left.flatMap(renderKey);
        const rightParts = row.right.flatMap(renderKey);
        if (leftParts.length === 0 && rightParts.length === 0) {
          return null;
        }
        return html`
          <div class="row">
            ${leftParts}
            ${rightParts.length
              ? html`
                  <div class="row-right">${rightParts}</div>
                `
              : ''}
          </div>
        `;
      })
      .filter(Boolean);
    return html`
      <div class="item history">
        ${this.renderHistoryIcon(item, itemConf)}
        <div class="item-content">
          ${rows}
        </div>
      </div>
      ${!isLast ? this.renderSeparator(itemConf) : ``}
    `;
  }

  protected renderCustomLogEvent(
    customLogEvent: CustomLogEvent,
    isLast: boolean,
    config: LogbookCardConfigBase,
  ): TemplateResult {
    const itemConf = this.itemConfig(customLogEvent, config);
    return html`
      <div class="item custom-log">
        ${this.renderCustomLogIcon(customLogEvent, itemConf)}
        <div class="item-content">
          ${this.showEntityName(itemConf)
            ? this.renderEntity(customLogEvent.entity, customLogEvent.entity_name, config)
            : ''}
          <span class="custom-log__name">${customLogEvent.name}</span>
          <span class="custom-log__separator">-</span>
          <span class="custom-log__message">${customLogEvent.message}</span>
          <div class="date">
            <logbook-date .hass=${this.hass} .date=${customLogEvent.start} .config=${itemConf}></logbook-date>
          </div>
        </div>
      </div>
      ${!isLast ? this.renderSeparator(itemConf) : ``}
    `;
  }

  protected renderCustomLogIcon(customLog: CustomLogEvent, config: LogbookCardConfigBase): TemplateResult | void {
    if (config?.show?.icon) {
      const state = this.hass.states[customLog.entity] as HassEntity;
      return this.renderIcon(state, customLog.icon, customLog.icon_color);
    }
  }

  protected renderHistoryIcon(item: History, config: LogbookCardConfigBase): TemplateResult | void {
    if (config?.show?.icon) {
      return this.renderIcon(item.stateObj, item.icon?.icon, item.icon?.color);
    }
  }

  private renderIcon(state: HassEntity, icon: string | undefined, color: string | undefined): TemplateResult {
    return html`
      <div class="item-icon">
        <state-badge .hass=${this.hass} .stateObj=${state} .overrideIcon=${icon} .color=${color} .stateColor=${true}>
        </state-badge>
      </div>
    `;
  }

  protected renderDaySeparator(item: CustomLogEvent | History, config: LogbookCardConfigBase): TemplateResult {
    if (!config.group_by_day) {
      return html``;
    }
    return html`
      <div class="date-separator">
        ${new Intl.DateTimeFormat(this.hass.locale?.language ?? 'en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(item.start)}
      </div>
    `;
  }

  protected renderSeparator(config: LogbookCardConfigBase): TemplateResult | void {
    const width = config?.separator_style?.width ?? 1;
    const style = config?.separator_style?.style ?? 'solid';
    // double 线型在 CSS 中需要至少 3px 才能渲染出双线效果
    const effectiveWidth = style === 'double' && width < 3 ? 3 : width;
    const styleInfo: StyleInfo = {
      border: '0',
      'border-top': `${effectiveWidth}px ${style} ${config?.separator_style?.color}`,
    };
    if (config?.show?.separator) {
      return html`
        <hr class="separator" style=${styleMap(styleInfo)} aria-hidden="true" />
      `;
    }
  }

  protected renderEntity(entity: string, name: string, config: LogbookCardConfigBase): TemplateResult {
    return html`
      <span
        class="entity"
        .entity=${entity}
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(config.hold_action),
          hasDoubleClick: hasAction(config.double_tap_action),
        })}
        >${name}</span
      >
    `;
  }

  renderHistoryDate(item: History, config: LogbookCardConfigBase): TemplateResult {
    const dateStyle = styleMap(this.elementStyleInfo(config, 'time'));
    if (config?.show?.start_date && config?.show?.end_date) {
      return html`
        <div class="date" style=${dateStyle}>
          <logbook-date .hass=${this.hass} .date=${item.start} .config=${config}></logbook-date> -
          <logbook-date .hass=${this.hass} .date=${item.end} .config=${config}></logbook-date>
        </div>
      `;
    }
    if (config?.show?.end_date) {
      return html`
        <div class="date" style=${dateStyle}>
          <logbook-date .hass=${this.hass} .date=${item.end} .config=${config}></logbook-date>
        </div>
      `;
    }
    if (config?.show?.start_date) {
      return html`
        <div class="date" style=${dateStyle}>
          <logbook-date .hass=${this.hass} .date=${item.start} .config=${config}></logbook-date>
        </div>
      `;
    }
    // 开始/结束日期都关闭时不显示时间（时间仅影响日期的显示格式）
    return html``;
  }

  static get styles(): CSSResultGroup {
    return css`
      .copy {
        user-select: text;
      }
      ha-card {
        overflow: clip;
      }
      .card-content-scroll {
        max-height: 345px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-gutter: stable;
      }
      .item {
        clear: both;
        padding: 5px 0;
        display: flex;
        line-height: var(--paper-font-body1_-_line-height);
      }
      .item-content {
        flex: 1;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        column-gap: 0.5rem;
      }
      .row > * {
        min-width: 0;
      }
      /* 行内右组：靠行尾对齐 */
      .row-right {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        column-gap: 0.5rem;
        margin-left: auto;
      }
      .row > .attribute {
        flex: 1 1 auto;
      }
      .item-icon {
        flex: 0 0 4rem;
        color: var(--paper-item-icon-color, #44739e);
        display: flex;
        justify-content: center;
      }
      .entity {
        color: var(--paper-item-icon-color);
        cursor: pointer;
      }
      state-badge {
        line-height: 1.5rem;
      }
      state-badge[icon] {
        height: fit-content;
      }
      .state,
      .attribute {
        white-space: pre-wrap;
      }
      .duration {
        font-size: 0.85rem;
        font-style: italic;
        float: right;
      }
      .date {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }
      .attribute {
        display: flex;
        justify-content: space-between;
      }
      .expand {
        display: none;
      }
      .expand + label {
        display: block;
        text-align: right;
        cursor: pointer;
      }
      .expand + label > div {
        display: inline-block;
        transform: rotate(-90deg);
        font-size: 26px;
        height: 29px;
        width: 29px;
        text-align: center;
      }
      .expand + label > div,
      .expand + label + div {
        transition: 0.5s ease-in-out;
      }
      .expand:checked + label > div {
        transform: rotate(-90deg) scaleX(-1);
      }
      .expand + label + div {
        display: none;
        overflow: hidden;
      }
      .expand:checked + label + div {
        display: block;
      }
      .date-separator {
        display: block;
        border-block-end: 1px solid var(--divider-color);
        padding: 0.5rem 1rem;
        font-weight: bold;
        margin-block-end: 1rem;
      }
    `;
  }
}
