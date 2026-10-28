import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '../data/site';
import styles from './CopyEmailButton.module.css';

interface CopyEmailButtonProps {
  className?: string;
}

const TOAST_DURATION = 2000;

/**
 * 点击复制邮箱：clipboard API → execCommand 回退 → 选中文本提示手动复制。
 * 提示 role=status + aria-live，2 秒后消失，Esc 可关闭。
 */
export function CopyEmailButton({ className }: CopyEmailButtonProps) {
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const showToast = useCallback((message: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(message);
    timerRef.current = setTimeout(() => setToast(null), TOAST_DURATION);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setToast(null);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [toast]);

  const copy = useCallback(async () => {
    const email = site.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast('邮箱已复制');
      return;
    } catch {
      // 剪贴板不可用：回退 execCommand
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      textarea.remove();
      showToast(ok ? '邮箱已复制' : '请手动复制');
      if (!ok) {
        selectEmailText();
      }
    } catch {
      showToast('请手动复制');
      selectEmailText();
    }
  }, [showToast]);

  const selectEmailText = () => {
    const node = textRef.current;
    if (!node) {
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  return (
    <span className={styles.wrapper}>
      <button type="button" className={`${styles.button} ${className ?? ''}`} onClick={copy} aria-label={`复制邮箱 ${site.email}`}>
        <span ref={textRef}>{site.email}</span>
      </button>
      {toast && (
        <span className={styles.toast} role="status" aria-live="polite">
          {toast}
        </span>
      )}
    </span>
  );
}
