"use client"

import { useEffect } from 'react';
import "./globals.css";

export default function RootLayout({ children }) {
  // const callUsButton = document.querySelector('#call-us-button')


  useEffect(() => {
    // 创建一个新的 <script> 元素
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = "ze-snippet";
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=94340760-310d-4e66-b572-6afde91553dc';
    script.async = true; // 设置为异步加载

    // 设置 window.zESettings
    const textNode = document.createTextNode(`
      window.zESettings = {
        webWidget: {
          offset: { horizontal: '1000px', vertical: '1500px' }
        }
      };`);
    script.appendChild(textNode);


    // 将 <script> 元素添加到文档的 <body> 中
    document.body.appendChild(script);

    // 清理函数：在组件卸载时移除脚本
    return () => {
      document.body.removeChild(script);
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
