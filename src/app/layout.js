import Script from 'next/script';
import "./globals.css";
import Providers from "./providers";
import Navigation from "@app/components/navigation/index";
import Footer from "@app/components/footer/index";

const zendeskKey = process.env.ZENDESK_WEB_WIDGET;


export default function RootLayout({ children }) {
  return (
    <html lang="en-NZ">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./favicon.ico" />
        {zendeskKey && (
          <Script
            type="text/javascript"
            id="ze-snippet"
            src={`https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`}
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body suppressHydrationWarning={true}>
        <Navigation />
        <main className="oc_wrapper">
          <Providers>{children}</Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}
