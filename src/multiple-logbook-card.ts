/* eslint-disable @typescript-eslint/no-explicit-any */

import { html, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import './logbook-date';
import './logbook-duration';
import {
  History,
  ExtendedHomeAssistant,
  HistoryOrCustomLogEvent,
  CustomLogEvent,
  MultipleLogbookCardConfig,
} from './types';
import { DEFAULT_SHOW, DEFAULT_SEPARATOR_STYLE, DEFAULT_DURATION } from './const';
import { EntityCustomLogConfig, getCustomLogsPromise } from './custom-logs';
import { EntityHistoryConfig, getHistory } from './history';
import { toStateMapRegex, toHiddenRegex, toCustomLogMapRegex } from './config-helpers';
import { LogbookBaseCard } from './logbook-base-card';
import { checkBaseConfig } from './config-validator';
import { addCustomCard } from './ha/custom-card';
import { localize } from './localize/localize';
import { calculateStartDate, dayToHours } from './date-helpers';

addCustomCard(
  'multiple-logbook-card',
  'Multiple entity Logbook Card',
  'A custom card to display history for multiple entities',
);

/**
 * 模块级历史缓存：编辑器中每次 config-changed 都可能重建预览卡片实例，
 * 新实例立即用缓存数据渲染（避免空白），后台再异步刷新。
 */
const multipleHistoryCache = new Map<string, { items: HistoryOrCustomLogEvent[]; changed: Date }>();

@customElement('multiple-logbook-card')
export class MultipleLogbookCard extends LogbookBaseCard {
  // Add any properties that should cause your element to re-render here
  @property({ type: Object }) public hass!: ExtendedHomeAssistant;
  @state() private config!: MultipleLogbookCardConfig;
  @state() private history: Array<HistoryOrCustomLogEvent> = [];

  constructor() {
    super();
    this.mode = 'multiple';
  }

  private lastHistoryChanged?: Date;

  /** 影响历史数据的配置字段：仅这些字段变化时才重新拉取历史（样式/布局等纯展示配置变化时跳过） */
  private static readonly DATA_KEYS: (keyof MultipleLogbookCardConfig)[] = [
    'entities',
    'hours_to_show',
    'history',
    'date_format',
    'minimal_duration',
    'show_history',
    'desc',
    'max_items',
    'group_by_day',
  ];

  private dataSignature(config: MultipleLogbookCardConfig): string {
    return JSON.stringify(MultipleLogbookCard.DATA_KEYS.map(key => config[key]));
  }

  public setConfig(config: MultipleLogbookCardConfig): void {
    checkBaseConfig(config);
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error(localize('multiple_logbook_card.missing_entities'));
    }

    if (config.entities.length === 0) {
      throw new Error(localize('multiple_logbook_card.missing_entities'));
    }

    //Check for attributes / states / hidden_state

    const prevData = this.config ? this.dataSignature(this.config) : undefined;
    this.config = {
      desc: true,
      max_items: -1,
      no_event: localize('common.default_no_event'),
      attributes: [],
      scroll: true,
      custom_logs: false,
      show_history: true,
      ...config,
      hours_to_show: config.hours_to_show
        ? config.hours_to_show
        : config.history
        ? dayToHours(config.history)
        : undefined,
      entities: config.entities?.map(e => ({
        attributes: e.attributes ?? [],
        entity: e.entity,
        label: e.label,
        state_map: e.state_map,
        hidden_state: e.hidden_state,
        custom_logs: e.custom_logs,
        custom_log_map: e.custom_log_map,
        show_history: e.show_history,
      })),
      show: { ...DEFAULT_SHOW, ...config.show },
      duration: { ...DEFAULT_DURATION, ...config.duration },
      duration_labels: { ...config.duration_labels },
      separator_style: { ...DEFAULT_SEPARATOR_STYLE, ...config.separator_style },
    };

    const sig = this.dataSignature(this.config);
    // 命中缓存时立即恢复历史数据（预览卡片重建时避免空白），后台再异步刷新
    const cached = multipleHistoryCache.get(sig);
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

    if (hass && this.config && this.config.entities) {
      const existingEntities = this.config.entities.filter(
        entity => !!entity.entity && !!this.hass.states[entity.entity],
      );

      if (existingEntities.length > 0) {
        const startDate = calculateStartDate(this.config.hours_to_show);

        const historyPromises = new Array<Promise<History[]>>();
        const customLogsPromises = new Array<Promise<CustomLogEvent[]>>();
        for (const entity of existingEntities) {
          const entityConfig: EntityHistoryConfig = {
            attributes: entity.attributes,
            entity: entity.entity!,
            entity_name: entity.label,
            hidden_state_regexp: toHiddenRegex(entity.hidden_state),
            state_map: toStateMapRegex(entity.state_map),
            date_format: this.config.date_format,
            minimal_duration: this.config.minimal_duration,
            show_history: this.config.show_history,
          };
          const promise = getHistory(this.hass, entityConfig, startDate);
          historyPromises.push(promise);

          const customLogConfig: EntityCustomLogConfig = {
            entity: entity.entity!,
            entity_name: entity.label ?? this.hass.states[entity.entity!].attributes.friendly_name,
            custom_logs: entity.custom_logs === true || false,
            log_map: toCustomLogMapRegex(entity.custom_log_map),
          };
          const customLogsPromise = getCustomLogsPromise(this.hass, customLogConfig, startDate);
          customLogsPromises.push(customLogsPromise);
        }

        Promise.all([...historyPromises, ...customLogsPromises]).then(history => {
          let allHistory = history.flat().sort((a, b) => a.start.valueOf() - b.start.valueOf());

          if (this.config?.desc) {
            allHistory = allHistory.reverse();
          }
          if (this.config && this.config.max_items && this.config.max_items > 0) {
            allHistory = allHistory.splice(0, this.config?.max_items);
          }

          this.history = allHistory;

          this.lastHistoryChanged = new Date();
          // 写入模块级缓存（超出上限时淘汰最早条目），供预览卡片重建时立即渲染
          const sig = this.dataSignature(this.config);
          multipleHistoryCache.set(sig, { items: allHistory, changed: this.lastHistoryChanged });
          if (multipleHistoryCache.size > 10) {
            const oldest = multipleHistoryCache.keys().next().value;
            if (oldest !== undefined) {
              multipleHistoryCache.delete(oldest);
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

    return html`
      <ha-card tabindex="0">
        ${this.config.show_title === false || !this.config.title
          ? ''
          : html`
              <h1 aria-label=${`${this.config.title}`} class="card-header">${this.config.title}</h1>
            `}
        <div class="card-content ${contentCardClass} grid" style="[[contentStyle]]">
          ${this.renderHistory(this.history, this.config)}
        </div>
      </ha-card>
    `;
  }
}
