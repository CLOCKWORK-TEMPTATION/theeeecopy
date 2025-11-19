import type { Metadata } from "next";
import "../styles/globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "النسخة - منصة الإبداع السينمائي",
  description:
    "منصة متكاملة للكتابة الإبداعية والتحليل الدرامي مدعومة بالذكاء الاصطناعي",
};

// Enable ISR with 24-hour revalidation (86400 seconds)
export const revalidate = 86400;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
