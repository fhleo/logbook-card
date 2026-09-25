import { format } from 'fecha';
import { html, TemplateResult } from 'lit';
import { formatDateTime, formatDate } from 'custom-card-helpers';
import { ExtendedHomeAssistant } from './types';
import { HassEntity } from 'home-assistant-js-websocket/dist/types';

/**
 * 从 fecha 格式串中去掉时间部分，只保留日期。
 * 例如 "DD/MM/YYYY HH:mm" -> "DD/MM/YYYY"
 */
const stripTimeFromFormat = (fmt: string): string => {
  // 先移除 fecha 的 LT/LTS（本地时间）标记
  const withoutRelative = fmt.replace(/\s*LTS/g, '').replace(/\s*LT/g, '');
  // 时间相关 token：H/HH/h/hh、m/mm、s/ss、S/SS/SSS、a/A（月份为 MMM/M 大写，不受影响；星期 d 为小写 d，不在集合内）
  const match = /[Hh]{1,2}|[ms]{1,2}|S{1,3}|a|A/.exec(withoutRelative);
  if (!match) {
    return withoutRelative;
  }
  const datePart = withoutRelative.slice(0, match.index).replace(/[\s,;:.\-/]+$/, '');
  // 如果整个格式都是时间（如 "HH:mm"），无法剥离则保持原样
  return datePart.length > 0 ? datePart : withoutRelative;
};

export const displayDate = (
  hass: ExtendedHomeAssistant,
  date: Date,
  dateFormat: string | 'relative' | undefined,
  showTime = true,
): string | TemplateResult => {
  if (dateFormat === 'relative') {
    return html`
      <ha-relative-time .hass=${hass} .datetime=${date}></ha-relative-time>
    `;
  }
  if (dateFormat) {
    const finalFormat = showTime ? dateFormat : stripTimeFromFormat(dateFormat);
    return format(date, finalFormat ?? undefined);
  }
  // 未配置 date_format 时使用 HA 本地化格式；关闭显示时间则只显示日期
  if (showTime) {
    return formatDateTime(date, hass.locale!);
  }
  return formatDate(date, hass.locale!);
};

export const formatAttributeValue = (
  hass: ExtendedHomeAssistant,
  value: any,
  type: 'date' | string | undefined,
  dateFormat: string | 'relative' | undefined,
  showTime = true,
): string | TemplateResult => {
  if (type === 'date') {
    return displayDate(hass, new Date(value), dateFormat, showTime);
  }
  return value;
};

export const formatEntityAttributeValue = (
  hass: ExtendedHomeAssistant,
  entity: HassEntity,
  attribute: string,
  value: any,
  type: 'date' | 'url' | undefined,
  dateFormat: string | 'relative' | undefined,
  linkLabel: string | undefined,
  showTime = true,
): string | TemplateResult => {
  if (type === 'date') {
    return displayDate(hass, new Date(value), dateFormat, showTime);
  }
  if (type === 'url') {
    return html`
      <a .href="${value}" target="_blank">${linkLabel ? linkLabel : value}</a>
    `;
  }
  if (hass.formatEntityAttributeValue) {
    return hass.formatEntityAttributeValue(entity, attribute);
  }
  return value;
};
