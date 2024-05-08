import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en-NZ">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
