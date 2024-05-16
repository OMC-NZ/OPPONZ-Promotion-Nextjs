"use client"

import { useEffect } from 'react';
import "./globals.css";

export default function RootLayout({ children }) {
  useEffect(() => {
    const handleBeforeUnload = () => {
      zE('messenger', 'close');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 创建一个新的 <script> 元素
    const zendeskScript = document.createElement('script');
    zendeskScript.type = 'text/javascript';
    zendeskScript.id = "ze-snippet";
    zendeskScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=' + process.env.NEXT_PUBLIC_ZENDESK_WEB_WIDGET;
    zendeskScript.async = true; // 设置为异步加载    
    document.body.appendChild(zendeskScript);  // 将 <script> 元素添加到文档的 <body> 中

    // 创建一个新的 <script> 元素加载 Google reCAPTCHA 的脚本
    // const recaptchaScript = document.createElement('script');
    // recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?render=' + process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    // recaptchaScript.async = true; // 设置为异步加载
    // document.body.appendChild(recaptchaScript);  // 将 Google reCAPTCHA 的 <script> 元素添加到文档的 <body> 中

    // 清理函数：在组件卸载时移除脚本
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      document.body.removeChild(zendeskScript);
      // document.body.removeChild(recaptchaScript);
    };
  }, []); // 空依赖数组表示只在组件挂载和卸载时执行一次

  return (
    <html lang="en-NZ">
      <head>
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
