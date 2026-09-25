import { LogbookCardEditor } from './editor';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { html, TemplateResult, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LovelaceCardEditor, hasAction } from 'custom-card-helpers';

import './editor';
import './logbook-date';
import './logbook-duration';
import { LogbookCardConfig, ExtendedHomeAssistant, HistoryOrCustomLogEvent } from './types';
import { DEFAULT_SHOW, DEFAULT_SEPARATOR_STYLE, DEFAULT_DURATION } from './const';
import { localize, setHass } from './localize/localize';
import { actionHandler } from './action-handler-directive';
import { EntityCustomLogConfig, getCustomLogsPromise } from './custom-logs';
import { EntityHistoryConfig, getHistory } from './history';
import { toCustomLogMapRegex, toHiddenRegex, toStateMapRegex } from './config-helpers';
import { LogbookBaseCard } from './logbook-base-card';
import { checkBaseConfig } from './config-validator';
import { addCustomCard } from './ha/custom-card';
import { calculateStartDate, dayToHours } from './date-helpers';
import { classMap } from 'lit/directives/class-map.js';

addCustomCard('logbook-card', 'Logbook Card', 'A custom card to display entity history');

/**
 * 模块级历史缓存：编辑器中每次 config-changed 都可能重建预览卡片实例，
 * 新实例立即用缓存数据渲染（避免空白），后台再异步刷新。
 * key = 数据相关配置签名，value = 排序截断后的最终历史数据与生成时间
 */
const historyCache = new Map<string, { items: HistoryOrCustomLogEvent[]; changed: Date }>();
const HISTORY_CACHE_LIMIT = 10;

@customElement('logbook-card')
export class LogbookCard extends LogbookBaseCard {
  protected willUpdate(changedProps: PropertyValues): void {
    // hass 注入或变化时缓存，让 localize() 能读取 HA 的语言设置
    if (changedProps.has('hass') && this.hass) {
      setHass(this.hass);
    }
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('logbook-card-editor') as LogbookCardEditor;
  }

  public static getStubConfig(_hass: ExtendedHomeAssistant, entities: Array<any>): Record<string, unknown> {
    return {
      entity: entities[0],
    };
  }

  @state() private config!: LogbookCardConfig;
  @state() private history: Array<HistoryOrCustomLogEvent> = [];

  private lastHistoryChanged?: Date;

  /** 影响历史数据的配置字段：仅这些字段变化时才重新拉取历史（样式/布局等纯展示配置变化时跳过） */
  private static readonly DATA_KEYS: (keyof LogbookCardConfig)[] = [
    'entity',
    'hours_to_show',
    'history',
    'state_map',
    'hidden_state',
    'attributes',
    'date_format',
    'minimal_duration',
    'show_history',
    'custom_logs',
    'custom_log_map',
    'desc',
    'max_items',
    'group_by_day',
    'show',
  ];

  private dataSignature(config: LogbookCardConfig): string {
    return JSON.stringify(LogbookCard.DATA_KEYS.map(key => config[key]));
  }

  public setConfig(config: LogbookCardConfig): void {
    checkBaseConfig(config);
    if (!config.entity) {
      throw new Error(localize('logbook_card.missing_entity'));
    }
    if (config.hidden_state && !Array.isArray(config.hidden_state)) {
      throw new Error(localize('logbook_card.invalid_hidden_state'));
    }
    if (config.state_map && !Array.isArray(config.state_map)) {
      throw new Error(localize('logbook_card.invalid_state_map'));
    }
    if (config.custom_log_map && !Array.isArray(config.custom_log_map)) {
      throw new Error(localize('logbook_card.invalid_custom_log_map'));
    }
    if (config.attributes && !Array.isArray(config.attributes)) {
      throw new Error(localize('logbook_card.invalid_attributes'));
    }

    const prevData = this.config ? this.dataSignature(this.config) : undefined;
    this.config = {
      history: 5,
      hidden_state: [],
      desc: true,
      max_items: -1,
      no_event: localize('common.default_no_event'),
      attributes: [],
      scroll: true,
      custom_logs: false,
      show_history: true,
      custom_log_map: [],
      allow_copy: false,
      ...config,
      hours_to_show: config.hours_to_show
        ? config.hours_to_show
        : config.history
        ? dayToHours(config.history)
        : undefined,
      state_map: config.state_map,
      hidden_state_regexp: toHiddenRegex(config.hidden_state),
      show: { ...DEFAULT_SHOW, ...config.show },
      duration: { ...DEFAULT_DURATION, ...config.duration },
      duration_labels: { ...config.duration_labels },
      separator_style: { ...DEFAULT_SEPARATOR_STYLE, ...config.separator_style },
    };

    const sig = this.dataSignature(this.config);
    // 命中缓存时立即恢复历史数据（预览卡片重建时避免空白），后台再异步刷新
    const cached = historyCache.get(sig);
    if (cached) {
      this.history = cached.items;
      this.lastHistoryChanged = cached.changed;
    }

    // 数据相关配置未变化时跳过重新拉取历史（避免滑块等高频配置变更引发请求风暴）
    if (!prevData || prevData !== sig) {
      this.updateHistory();
    }
  }

  updateHistory(): void {
    const hass = this.hass;
    if (hass && this.config && this.config.entity) {
      const stateObj = this.config.entity in hass.states ? hass.states[this.config.entity] : null;

      if (stateObj) {
        const startDate = calculateStartDate(this.config.hours_to_show);
        const entityConfig: EntityHistoryConfig = {
          attributes: this.config.attributes,
          entity: this.config.entity,
          state_map: toStateMapRegex(this.config.state_map),
          hidden_state_regexp: this.config.hidden_state_regexp,
          date_format: this.config.date_format,
          minimal_duration: this.config.minimal_duration,
          show_history: this.config.show_history || false,
          show_time: this.config.show?.time !== false,
        };
        const historyPromise = getHistory(this.hass, entityConfig, startDate);

        const customLogConfig: EntityCustomLogConfig = {
          entity: this.config.entity!,
          custom_logs: this.config.custom_logs === true || false,
          log_map: toCustomLogMapRegex(this.config.custom_log_map || []),
        };
        const customLogsPromise = getCustomLogsPromise(this.hass, customLogConfig, startDate);

        Promise.all([historyPromise, customLogsPromise]).then(([history, customLogs]) => {
          let historyAndCustomLogs = [...history, ...customLogs].sort((a, b) => a.start.valueOf() - b.start.valueOf());

          if (this.config?.desc) {
            historyAndCustomLogs = historyAndCustomLogs.reverse();
          }

          if (this.config && this.config.max_items && this.config.max_items > 0) {
            historyAndCustomLogs = historyAndCustomLogs.splice(0, this.config?.max_items);
          }

          this.history = historyAndCustomLogs;
          this.lastHistoryChanged = new Date();
          // 写入模块级缓存（超出上限时淘汰最早条目），供预览卡片重建时立即渲染
          const sig = this.dataSignature(this.config);
          historyCache.set(sig, { items: historyAndCustomLogs, changed: this.lastHistoryChanged });
          if (historyCache.size > HISTORY_CACHE_LIMIT) {
            const oldest = historyCache.keys().next().value;
            if (oldest !== undefined) {
              historyCache.delete(oldest);
            }
          }
        });
      }
    }
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    // history 或 config（样式/布局等）变化都重渲染，让样式调整即时生效
    if (changedProps.has('history') || changedProps.has('config')) {
      return true;
    }
    changedProps.delete('history');
    changedProps.delete('config');
    return false;
  }

  protected render(): TemplateResult | void {
    if (!this.config || !this.hass || !this.lastHistoryChanged) {
      return html``;
    }

    const contentCardClass = this.config.scroll ? 'card-content-scroll' : '';
    const cardClass = { copy: this.config.allow_copy || false };

    return html`
      <ha-card class=${classMap(cardClass)} tabindex="0">
        ${this.config.show_title === false || !this.config.title
          ? ''
          : html`
              <h1
                aria-label=${`${this.config.title}`}
                class="card-header"
                .entity=${`${this.config.entity}`}
                @action=${this._handleAction}
                .actionHandler=${actionHandler({
                  hasHold: hasAction(this.config.hold_action),
                  hasDoubleClick: hasAction(this.config.double_tap_action),
                })}
              >
                ${this.config.title}
              </h1>
            `}
        <div class="card-content ${contentCardClass} grid" style="[[contentStyle]]">
          ${this.renderHistory(this.history, this.config)}
        </div>
      </ha-card>
    `;
  }
}
