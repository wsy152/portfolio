/**
 * Markdown 构建期渲染管线（仅在构建期/Node 运行，绝不进入客户端包）：
 * remark → rehype-slug → Shiki 高亮（github-light，浅色约束）→ rehype-sanitize → HTML。
 * 产物是已消毒的 HTML 字符串，客户端组件直接接收，不打包 Shiki 与 unified。
 */
import { fromHtml } from 'hast-util-from-html';
import { toString as hastToString } from 'hast-util-to-string';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Highlighter } from 'shiki';
import { createHighlighter } from 'shiki';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { Element, ElementContent, Root } from 'hast';
import type { Heading } from './schema';

/** 消毒白名单：在默认基础上允许 Shiki 产物的 class 与内联 style（高亮依赖内联颜色） */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'style'],
    code: [...(defaultSchema.attributes?.['code'] ?? []), 'className', 'style'],
    pre: [...(defaultSchema.attributes?.['pre'] ?? []), 'className', 'style'],
    span: [...(defaultSchema.attributes?.['span'] ?? []), 'className', 'style'],
    div: [...(defaultSchema.attributes?.['div'] ?? []), 'className', 'style'],
    button: ['className', 'type', 'ariaLabel'],
  },
  tagNames: [...(defaultSchema.tagNames ?? []), 'button'],
};

export interface RenderedMarkdown {
  html: string;
  headings: Heading[];
}

let highlighterPromise: Promise<Highlighter> | null = null;

/** 单例 highlighter，仅注册常见语言，控制构建耗时 */
export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light'],
      langs: [
        'ts', 'tsx', 'js', 'jsx', 'json', 'css', 'html', 'bash', 'shell',
        'md', 'yaml', 'python', 'go', 'rust', 'java', 'sql', 'diff',
      ],
    });
  }
  return highlighterPromise;
}

function languageOf(node: Element): string {
  const classNames = (node.properties?.className as string[] | undefined) ?? [];
  for (const cls of classNames) {
    if (cls.startsWith('language-')) {
      return cls.slice('language-'.length);
    }
  }
  return 'text';
}

/** rehype 插件：把 pre>code 替换为 Shiki 高亮结果，并外包一层带复制按钮的容器 */
function rehypeShiki(highlighter: Highlighter) {
  return () => (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) {
        return;
      }
      const code = node.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      );
      if (!code) {
        return;
      }
      const lang = languageOf(code);
      const source = hastToString(code).replace(/\n$/, '');
      let html: string;
      try {
        html = highlighter.codeToHtml(source, { lang, theme: 'github-light' });
      } catch {
        // 未注册语言回退为纯文本
        html = highlighter.codeToHtml(source, { lang: 'text', theme: 'github-light' });
      }
      const highlighted = fromHtml(html, { fragment: true });
      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['codeBlock'] },
        children: [
          {
            type: 'element',
            tagName: 'button',
            properties: {
              className: ['codeCopy'],
              type: 'button',
              ariaLabel: '复制代码',
            },
            children: [{ type: 'text', value: '复制' }],
          },
          ...(highlighted.children as ElementContent[]),
        ],
      };
      parent.children[index] = wrapper;
    });
  };
}

/** rehype 插件：收集 h2/h3 标题（依赖 rehype-slug 已生成 id） */
function rehypeExtractHeadings(headings: Heading[]) {
  return () => (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if ((node.tagName === 'h2' || node.tagName === 'h3') && node.properties?.id) {
        headings.push({
          depth: node.tagName === 'h2' ? 2 : 3,
          text: hastToString(node),
          id: String(node.properties.id),
        });
      }
    });
  };
}

export async function renderMarkdown(body: string): Promise<RenderedMarkdown> {
  const highlighter = await getHighlighter();
  const headings: Heading[] = [];
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeShiki(highlighter))
    .use(rehypeExtractHeadings(headings))
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify);
  const html = String(await processor.process(body));
  return { html, headings };
}
