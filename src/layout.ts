import { LayoutConfiguration, LayoutElementKey } from './types';

export interface LayoutPlanItem {
  key: LayoutElementKey;
  /** 该元素显示之后是否另起一行 */
  breakAfter: boolean;
}

const ALL_KEYS: LayoutElementKey[] = ['state', 'duration', 'attributes', 'time'];

/** 默认布局：状态+持续时间同行，属性、时间各占一行 */
export const DEFAULT_LAYOUT_PLAN: LayoutPlanItem[] = [
  { key: 'state', breakAfter: false },
  { key: 'duration', breakAfter: true },
  { key: 'attributes', breakAfter: true },
  { key: 'time', breakAfter: false },
];

/** 单行内左右分组的元素（右组渲染在行尾靠右） */
export interface LayoutRow {
  left: LayoutElementKey[];
  right: LayoutElementKey[];
}

/**
 * 把任意版本的 layout 配置解析为统一的显示序列（新旧格式兼容）。
 * 卡片渲染与编辑器列表 UI 都使用此结果。
 */
export const normalizeLayout = (layout?: LayoutConfiguration): LayoutPlanItem[] => {
  if (!layout) {
    return DEFAULT_LAYOUT_PLAN.map(item => ({ ...item }));
  }
  // 新格式：order 数组 + line_breaks
  if (Array.isArray(layout.order) && layout.order.length > 0) {
    const order = layout.order.filter(key => ALL_KEYS.includes(key));
    ALL_KEYS.forEach(key => {
      if (!order.includes(key)) {
        order.push(key);
      }
    });
    const breaks = Array.isArray(layout.line_breaks) ? layout.line_breaks : [];
    return order.map(key => ({ key, breakAfter: breaks.includes(key) }));
  }
  // 旧格式：按元素上的 row/order（或纯数字行号）排序推导序列与换行
  const positions = ALL_KEYS.map((key, index) => {
    const value = layout[key];
    if (typeof value === 'number') {
      return { key, index, row: value >= 1 ? value : 99, order: 99 };
    }
    return {
      key,
      index,
      row: typeof value?.row === 'number' && value.row >= 1 ? value.row : 99,
      order: typeof value?.order === 'number' && value.order >= 1 ? value.order : 99,
    };
  });
  const sorted = positions.slice().sort((a, b) => a.row - b.row || a.order - b.order || a.index - b.index);
  return sorted.map((pos, i) => ({
    key: pos.key,
    breakAfter: i < sorted.length - 1 ? sorted[i + 1].row !== pos.row : false,
  }));
};

/**
 * 把布局配置解析为按行分组的结果（卡片渲染与编辑器预览共用）。
 * - 未配置任何布局时使用默认布局（状态+持续时间同行，持续时间靠右）
 * - 配置了布局后，align 中声明为 right 的元素进入右组
 */
export const layoutRows = (layout?: LayoutConfiguration): LayoutRow[] => {
  const plan = normalizeLayout(layout);
  const rows: LayoutRow[] = [];
  let current: LayoutRow = { left: [], right: [] };
  plan.forEach(item => {
    // 未配置布局时保持旧行为：持续时间靠右；配置后按 align 声明
    const isRight = layout ? layout.align?.[item.key] === 'right' : item.key === 'duration';
    (isRight ? current.right : current.left).push(item.key);
    if (item.breakAfter) {
      rows.push(current);
      current = { left: [], right: [] };
    }
  });
  if (current.left.length > 0 || current.right.length > 0) {
    rows.push(current);
  }
  return rows;
};
