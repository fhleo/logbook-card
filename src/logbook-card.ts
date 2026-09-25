import { LogbookCardEditor } from './editor';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { html, TemplateResult, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LovelaceCardEditor, hasAction } from 'custom-card-helpers';

import './editor';
import './logbook-date';
import './logbook-duration';
import { LogbookCardConfig, EntityCardConfig, ExtendedHomeAssistant, HistoryOrCustomLogEvent } from './types';
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
      // hass 首次注入时立即拉取历史（生成默认标题并避免等待轮询间隔）
      if (!this.lastHistoryChanged) {
        this.updateHistory();
      }
    }
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('logbook-card-editor') as LogbookCardEditor;
  }

  public static getStubConfig(_hass: ExtendedHomeAssistant, entities: Array<any>): Record<string, unknown> {
    // 编辑器统一按多实体结构工作，列表中一个实体即为单实体
    return {
      entities: [{ entity: entities[0] }],
    };
  }

  @state() private config!: LogbookCardConfig;
  @state() private history: Array<HistoryOrCustomLogEvent> = [];

  private lastHistoryChanged?: Date;

  /**
   * 历史数据签名：仅序列化影响历史数据内容的字段（单实体顶层与 entities 每项统一处理）。
   * 注意不能整体序列化 entities/show —— show/layout/element_styles 等纯展示字段一旦进入签名，
   * 编辑器里每次样式调整（如拖动字号）都会导致历史缓存未命中，预览卡片重建后
   * 无数据可立即渲染（白屏），直到异步拉取完成。
   */
  private static readonly ENTITY_DATA_KEYS: (keyof EntityCardConfig)[] = [
    'entity',
    'label',
    'attributes',
    'state_map',
    'hidden_state',
    'custom_logs',
    'custom_log_map',
    'show_history',
  ];

  private dataSignature(config: LogbookCardConfig): string {
    const entityData = (config.entities ?? []).map(e => LogbookCard.ENTITY_DATA_KEYS.map(key => e[key]));
    return JSON.stringify([
      config.entity,
      config.attributes,
      config.state_map,
      config.hidden_state,
      config.custom_logs,
      config.custom_log_map,
      config.hours_to_show,
      config.minimal_duration,
      config.show_history,
      config.desc,
      config.max_items,
      entityData,
    ]);
  }

  public setConfig(config: LogbookCardConfig): void {
    checkBaseConfig(config);
    const isMultiple = Array.isArray(config.entities);
    if (!isMultiple && !config.entity) {
      throw new Error(localize('logbook_card.missing_entity'));
    }
    if (isMultiple && config.entities!.length === 0) {
      throw new Error(localize('logbook_card.missing_entity'));
    }
    if (!isMultiple) {
      // per-entity 数组字段仅在单实体模式下出现在配置顶层，多实体时它们在 entities 每项中
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
      hidden_state_regexp: toHiddenRegex(config.hidden_state),
      show: { ...DEFAULT_SHOW, ...config.show },
      duration: { ...DEFAULT_DURATION, ...config.duration },
      duration_labels: { ...config.duration_labels },
      separator_style: { ...DEFAULT_SEPARATOR_STYLE, ...config.separator_style },
      entities: isMultiple
        ? config.entities!.map(e => ({
            attributes: e.attributes ?? [],
            entity: e.entity,
            label: e.label,
            state_map: e.state_map,
            hidden_state: e.hidden_state,
            custom_logs: e.custom_logs,
            custom_log_map: e.custom_log_map,
            show_history: e.show_history,
            show: e.show,
            layout: e.layout,
            element_styles: e.element_styles,
          }))
        : undefined,
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

  /** 当前配置需要请求历史的实体列表：多实体取 entities，单实体取顶层字段组合 */
  private resolveEntityConfigs(): EntityCardConfig[] {
    if (this.config.entities && this.config.entities.length > 0) {
      return this.config.entities;
    }
    if (this.config.entity) {
      return [
        {
          entity: this.config.entity,
          label: undefined,
          attributes: this.config.attributes,
          state_map: this.config.state_map,
          hidden_state: this.config.hidden_state,
          custom_logs: this.config.custom_logs,
          custom_log_map: this.config.custom_log_map,
        },
      ];
    }
    return [];
  }

  updateHistory(): void {
    const hass = this.hass;
    if (!hass || !this.config) {
      return;
    }

    const existingEntities = this.resolveEntityConfigs().filter(
      entityConfig => !!entityConfig.entity && !!hass.states[entityConfig.entity],
    );
    if (existingEntities.length === 0) {
      return;
    }

    // 默认标题：未显式配置且开启标题时，用第一个有效实体的设备名生成
    if (this.config.show_title !== false && !this.config.title) {
      const firstEntity = existingEntities[0].entity!;
      const friendlyName = hass.states[firstEntity]?.attributes?.friendly_name;
      if (friendlyName) {
        this.config.title = localize('logbook_card.default_title', '{entity}', friendlyName);
      }
    }

    const startDate = calculateStartDate(this.config.hours_to_show);

    const historyPromises = existingEntities.map(entityConfig => {
      const entityHistoryConfig: EntityHistoryConfig = {
        attributes: entityConfig.attributes,
        entity: entityConfig.entity!,
        entity_name: entityConfig.label,
        hidden_state_regexp: toHiddenRegex(entityConfig.hidden_state),
        state_map: toStateMapRegex(entityConfig.state_map),
        date_format: this.config.date_format,
        minimal_duration: this.config.minimal_duration,
        show_history: this.config.show_history || false,
      };
      return getHistory(hass, entityHistoryConfig, startDate);
    });

    const customLogsPromises = existingEntities.map(entityConfig => {
      const customLogConfig: EntityCustomLogConfig = {
        entity: entityConfig.entity!,
        entity_name:
          entityConfig.label ?? hass.states[entityConfig.entity!].attributes?.friendly_name ?? entityConfig.entity!,
        custom_logs: entityConfig.custom_logs === true,
        log_map: toCustomLogMapRegex(entityConfig.custom_log_map || []),
      };
      return getCustomLogsPromise(hass, customLogConfig, startDate);
    });

    Promise.all([...historyPromises, ...customLogsPromises]).then(results => {
      let historyAndCustomLogs = results.flat().sort((a, b) => a.start.valueOf() - b.start.valueOf());

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
                .entity=${this.config.entity ?? this.config.entities?.[0]?.entity}
                @action=${this._handleAction}
                .actionHandler=${actionHandler({
                  hasHold: hasAction(this.config.hold_action),
                  hasDoubleClick: hasAction(this.config.double_tap_action),
                })}
              >
                ${this.config.title}
              </h1>
            `}
        <div class="card-content ${contentCardClass} grid">
          ${this.renderHistory(this.history, this.config)}
        </div>
      </ha-card>
    `;
  }
}
