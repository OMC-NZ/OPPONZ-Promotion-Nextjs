import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en-NZ">
      <body className="">
        {children}
      </body>
    </html>
  );
}
