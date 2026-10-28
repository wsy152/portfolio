import { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';

interface ResumeButtonProps {
  className?: string;
}

/**
 * 简历下载按钮：点击开始下载并给出「正在下载」反馈。
 * 简历地址为空时按 FR-02/09 回退为邮件联系入口（禁用态在配置层处理）。
 */
export function ResumeButton({ className }: ResumeButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!site.resumeUrl) {
    return (
      <a href={`mailto:${site.email}`} className={`btn btnSecondary ${className ?? ''}`}>
        简历暂不可用，可邮件联系
      </a>
    );
  }

  return (
    <a
      href={site.resumeUrl}
      download
      className={`btn btnSecondary ${className ?? ''}`}
      onClick={() => {
        setDownloading(true);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => setDownloading(false), 1500);
      }}
    >
      {downloading ? '正在下载…' : '下载简历'}
    </a>
  );
}
