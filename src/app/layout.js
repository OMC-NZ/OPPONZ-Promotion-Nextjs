import Script from 'next/script';
import Navigation from '@/app/components/navigation/index';
import Footer from "@/app/components/footer/index";
import style from "./globals.css";

export default function RootLayout({ children }) {

  return (
    <html lang="en-NZ">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./favicon.ico" />
        <Script type='text/javascript' id='ze-snippet' src={`https://static.zdassets.com/ekr/snippet.js?key=${process.env.NEXT_PUBLIC_ZENDESK_WEB_WIDGET}`} strategy="beforeInteractive" />
      </head>
      <body suppressHydrationWarning={true}>
        <main className={style.oc_wrapper}>
          <Navigation />

          {children}

          <Footer />
        </main>
      </body>
    </html>
  );
}
