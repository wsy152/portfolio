/**
 * 技能分组 —— 每个分组里 2–4 项，每项只写"名称 + 用在什么地方"一句
 *
 * 分组固定为：语言 / 框架 / 工具 / 领域
 * 不使用百分比或星级，避免让访客误以为是"精通/熟悉"的自我评估
 *
 * 字段说明：
 *   name  技能名，如 "TypeScript" / "Figma" / "PostgreSQL"
 *   usage 一句话说明这项技能具体用在什么地方，不要只写"熟练使用"
 *         好例子："本站与多个中后台项目的主力框架"
 *         好例子："产物体积预算、按需加载与缓存策略"
 *         坏例子："熟练掌握 React"  ← 没用
 */
export interface SkillItem {
  name: string;
  usage: string;
}

export interface SkillGroup {
  group: string;
  items: SkillItem[];
}

export const skills: SkillGroup[] = [
  {
    group: '语言',
    items: [
      { name: 'TypeScript', usage: '全站与工具链的主要开发语言' },
      // 删掉/加上你实际用到的：
      // { name: 'JavaScript', usage: '浏览器端脚本与遗留模块维护' },
      // { name: 'CSS', usage: '设计系统与响应式布局落地' },
      // { name: 'Python', usage: '内部工具与数据处理脚本' },
    ],
  },
  {
    group: '框架',
    items: [
      { name: 'React', usage: '本站与多个中后台项目的主力框架' },
      // { name: 'Vue', usage: '早期项目与团队协作产物' },
      // { name: 'Node.js', usage: '构建工具与 SSR 入口' },
    ],
  },
  {
    group: '工具',
    items: [
      { name: 'Vite', usage: '开发与构建工具链，自定义预渲染流程' },
      // { name: 'Git', usage: '日常协作与内容版本管理' },
      // { name: 'Figma', usage: '设计评审与原型对接' },
    ],
  },
  {
    group: '领域',
    items: [
      { name: '构建性能', usage: '产物体积预算、按需加载与缓存策略' },
      // { name: 'Web 无障碍', usage: '键盘可达、读屏兼容与对比度基线' },
      // { name: '可视化', usage: '数据大屏与指标下钻方案' },
    ],
  },
];
