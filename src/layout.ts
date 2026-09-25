import { LayoutConfiguration, LayoutElementKey } from './types';

export interface LayoutPlanItem {
  key: LayoutElementKey;
  /** 该元素显示之后是否另起一行 */
  breakAfter: boolean;
}

/** 单行内左右分组的元素（右组渲染在行尾靠右） */
export interface LayoutRow {
  left: LayoutElementKey[];
  right: LayoutElementKey[];
}

const isAttrIndex = (key: LayoutElementKey): boolean => typeof key === 'string' && key.startsWith('attributes:');

/** 布局元素的完整键列表：基础元素 + 每个属性一个键 + 属性容器键 */
const layoutKeys = (attrCount: number): LayoutElementKey[] => {
  const keys: LayoutElementKey[] = ['state', 'duration'];
  for (let i = 0; i < attrCount; i++) {
    keys.push(`attributes:${i}`);
  }
  keys.push('time');
  return keys;
};

/** 默认布局：状态+持续时间同行，属性、时间各占一行 */
const defaultPlan = (attrCount: number): LayoutPlanItem[] => {
  const plan: LayoutPlanItem[] = [
    { key: 'state', breakAfter: false },
    { key: 'duration', breakAfter: true },
  ];
  for (let i = 0; i < attrCount; i++) {
    plan.push({ key: `attributes:${i}`, breakAfter: i === attrCount - 1 });
  }
  plan.push({ key: 'time', breakAfter: false });
  return plan;
};

/**
 * 把任意版本的 layout 配置解析为统一的显示序列（新旧格式兼容）。
 * attrCount：当前条目的属性数量（决定 attributes:N 键集合）。
 * 卡片渲染与编辑器列表 UI 都使用此结果。
 */
export const normalizeLayout = (layout?: LayoutConfiguration, attrCount = 0): LayoutPlanItem[] => {
  if (!layout) {
    return defaultPlan(attrCount);
  }
  const keys = layoutKeys(attrCount);
  // 新格式：order 数组 + line_breaks
  if (Array.isArray(layout.order) && layout.order.length > 0) {
    // 'attributes' 容器键展开为全部属性（旧配置兼容）
    const expanded: LayoutElementKey[] = [];
    let attrSeen = false;
    layout.order.forEach(key => {
      if (key === 'attributes') {
        if (keys.includes('attributes:0')) {
          for (let i = 0; i < attrCount; i++) {
            expanded.push(`attributes:${i}`);
          }
          attrSeen = true;
        }
        return;
      }
      expanded.push(key);
    });
    const order = expanded.filter(key => keys.includes(key));
    // 补全未列出的元素（保持默认相对顺序）
    keys.forEach(key => {
      if (!order.includes(key)) {
        // 使用 per-attribute 布局时，未列出的属性追加到末尾
        if (isAttrIndex(key) && attrSeen) {
          return;
        }
        order.push(key);
      }
    });
    const breaks = Array.isArray(layout.line_breaks) ? layout.line_breaks : [];
    return order.map(key => ({ key, breakAfter: breaks.includes(key) }));
  }
  // 旧格式：按元素上的 row/order（或纯数字行号）排序推导序列与换行
  // 旧格式的 'attributes' 位置作用于全部属性
  const positions = keys.map((key, index) => {
    const baseKey = (isAttrIndex(key) ? 'attributes' : key) as 'state' | 'duration' | 'attributes' | 'time';
    const value = layout[baseKey];
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
 * - 未配置任何布局时使用默认布局（状态+持续时间同行）
 * - 配置了布局后，align 中声明为 right 的元素进入右组
 */
export const layoutRows = (layout?: LayoutConfiguration, attrCount = 0): LayoutRow[] => {
  const plan = normalizeLayout(layout, attrCount);
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
