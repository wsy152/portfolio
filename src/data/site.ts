/**
 * 站点配置 —— 已替换为用户提供的信息，剩余占位值待后续补齐
 */
import { siteConfigSchema, type SiteConfig } from '../lib/schema';

export const site: SiteConfig = siteConfigSchema.parse({
  name: 'wsy',
  role: '111',
  tagline: '222',
  location: '城市',
  availability: '在职，考虑机会',
  email: 'you@example.com',
  social: [{ label: 'GitHub', href: 'https://github.com/your-handle' }],
});

export interface Experience {
  company: string;
  title: string;
  period: string;
  current: boolean;
  outcome: string;
}

export const experiences: Experience[] = [
  {
    company: '公司 A',
    title: '111',
    period: '2023.06 – 至今',
    current: true,
    outcome: '444',
  },
  {
    company: '公司 B',
    title: '222',
    period: '2020.07 – 2023.05',
    current: false,
    outcome: '333',
  },
];

export interface Education {
  school: string;
  major: string;
  period: string;
}

export const education: Education[] = [
  {
    school: '你的学校',
    major: '专业 · 学历',
    period: '2024 – 2028',
  },
];

export const currentFocus: string[] = [
  '在维护本站点，并把工作中的工程实践整理成文章。',
  '关注构建性能与 Web 无障碍方向。',
];
