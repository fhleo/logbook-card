import { HassEntity } from 'home-assistant-js-websocket/dist/types';
import { ActionConfig, LovelaceCardConfig, HomeAssistant } from 'custom-card-helpers';
import { UnitName } from 'humanize-duration-ts';
import { TemplateResult } from 'lit';

export interface ExtendedHomeAssistant extends HomeAssistant {
  formatEntityState(stateObj: HassEntity, state?: string): string;
  formatEntityAttributeValue(stateObj: HassEntity, attribute: string, value?: string): string;
  formatEntityAttributeName(stateObj: HassEntity, attribute: string): string;
}

/** 可排序的条目元素（attributes:N 为第 N 个属性的独立布局键，v0.5.3+） */
// 注：不使用 `attributes:${number}` 模板字面量类型，旧版 eslint 解析器不支持
export type LayoutElementKey = 'state' | 'duration' | 'attributes' | 'time' | (string & Record<never, never>);

/** 单个元素的行位置（v0.1.5/0.1.6 旧格式） */
export interface LayoutItemPosition {
  row?: number;
  order?: number;
}

/**
 * 条目内元素布局：
 * - 新格式（v0.1.7+）：order 为全局显示顺序，line_breaks 中的元素之后另起一行，
 *   align（v0.4.0+）声明靠右的元素（未声明的靠左）
 * - 旧格式：按元素的 row/order 数字（仍兼容读取）
 * - attributes:N（v0.5.3+）：第 N 个属性独立布局；使用任一 attributes:N 时
 *   未列出的属性跟在最后一个属性之后
 */
export interface LayoutConfiguration {
  order?: LayoutElementKey[];
  line_breaks?: LayoutElementKey[];
  align?: Partial<Record<LayoutElementKey, 'left' | 'right'>>;
  state?: LayoutItemPosition | number;
  duration?: LayoutItemPosition | number;
  attributes?: LayoutItemPosition | number;
  time?: LayoutItemPosition | number;
}

/** 单个元素的样式覆盖 */
export interface ElementStyleConfig {
  color?: string;
  font_size?: string;
}

/** 各元素的样式设置（状态/持续时间/属性/时间） */
export interface ElementStylesConfiguration {
  state?: ElementStyleConfig;
  duration?: ElementStyleConfig;
  attributes?: ElementStyleConfig;
  time?: ElementStyleConfig;
}

export interface LogbookCardConfigBase extends LovelaceCardConfig {
  title?: string;
  show_title?: boolean;
  /** 实体列表：渲染层据此判断是否显示实体名（多于 1 个实体时显示） */
  entities?: EntityCardConfig[];
  history?: number;
  hours_to_show?: number;
  collapse?: number;
  date_format?: string | 'relative';
  desc?: boolean;
  duration?: DurationConfig;
  group_by_day?: boolean;
  max_items?: number;
  minimal_duration?: number;
  no_event?: string;
  show?: ShowConfiguration;
  scroll?: boolean;
  separator_style?: SeparatorStyleConfig;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  allow_copy?: boolean;
  attribute_hide_label?: boolean;
  layout?: LayoutConfiguration;
  element_styles?: ElementStylesConfiguration;
}

export interface EntityCardConfig {
  attributes?: Array<AttributeConfig>;
  entity?: string;
  label?: string;
  state_map?: Array<StateMap>;
  hidden_state?: Array<string | HiddenConfig>;
  custom_logs?: boolean;
  custom_log_map?: Array<CustomLogMapConfig>;
  show_history?: boolean;
  /** 实体级外观覆盖（未配置的字段回退到卡片全局配置） */
  show?: ShowConfiguration;
  layout?: LayoutConfiguration;
  element_styles?: ElementStylesConfiguration;
}

export interface LogbookCardConfig extends LogbookCardConfigBase, EntityCardConfig {}

export interface HiddenConfig {
  state?: string;
  attribute?: AttributeHiddenConfig;
}

interface AttributeHiddenConfig {
  name: string;
  value: string;
  hideIfMissing?: boolean;
}

export interface HiddenRegExp {
  state?: RegExp;
  attribute?: AttributeHiddenRegExp;
}

interface AttributeHiddenRegExp {
  name: string;
  value: RegExp;
  hideIfMissing: boolean;
}

export interface DurationConfig {
  largest?: number | 'full';
  labels?: DurationLabel | undefined;
  delimiter?: string;
  units?: Array<UnitName>;
}

export interface DurationLabel {
  month: string;
  week: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
}

export interface StateMap {
  value?: string;
  attributes?: Array<AttributeStateConfig>;
  label?: string;
  icon?: string;
  icon_color?: string;
}

export interface AttributeStateConfig {
  name: string;
  value: string;
}

export interface AttributeStateConfigRegexp {
  name: string;
  value?: RegExp;
}

export interface StateMapRegexp {
  value?: RegExp;
  attributes?: Array<AttributeStateConfigRegexp>;
  label?: string;
  icon?: string;
  icon_color?: string;
}

export interface CustomLogMapConfig {
  name?: string;
  message?: string;
  icon?: string;
  icon_color?: string;
  hidden?: boolean;
}

export interface IconState {
  icon: string;
  color?: string;
}

export interface ShowConfiguration {
  state: boolean;
  duration: boolean;
  start_date: boolean;
  end_date: boolean;
  icon: boolean;
  separator: boolean;
  /** @deprecated v0.5.3 起废弃：时间显示由日期格式决定 */
  time?: boolean;
  entity_name: boolean;
}

/** 属性值映射：原始值（支持通配符）匹配时显示替换值 */
export interface AttributeStateMap {
  value?: string;
  replacement?: string;
}

export interface AttributeConfig {
  value: string;
  label?: string;
  type?: 'date' | 'url';
  link_label?: string;
  /** 属性值映射（v0.5.4+）：仅对普通值属性生效（date/url 类型不参与映射） */
  state_map?: Array<AttributeStateMap>;
}

export interface History {
  type: 'history';
  stateObj: HassEntity;
  entity_name: string;
  state: string;
  label: string;
  start: Date;
  end: Date;
  attributes: Array<Attribute>;
  duration: number;
  icon: IconState;
}

export interface CustomLogEvent {
  type: 'customLog';
  entity_name: string;
  entity: string;
  start: Date;
  name: string;
  message: string;
  icon?: string; // ?
  icon_color?: string;
}

export type HistoryOrCustomLogEvent = History | CustomLogEvent;
export interface Attribute {
  value: string | TemplateResult;
  name: string;
}

export interface SeparatorStyleConfig {
  width?: number;
  style?: string;
  color?: string;
}
