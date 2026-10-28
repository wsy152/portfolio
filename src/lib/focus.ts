/**
 * 焦点管理：SPA 路由切换后浏览器不会自动移动焦点，
 * 这里把焦点移到页面 h1 并让读屏软件能感知页面变化。
 */
export function focusPageHeading(): void {
  if (typeof document === 'undefined') {
    return;
  }
  const heading = document.querySelector('main h1');
  if (heading instanceof HTMLElement) {
    if (!heading.hasAttribute('tabindex')) {
      heading.setAttribute('tabindex', '-1');
    }
    heading.focus({ preventScroll: true });
  }
}
