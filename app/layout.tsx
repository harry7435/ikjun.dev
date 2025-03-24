import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "./components/header";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "ikjun.dev",
  description: "개발자 조익준에 대한 포트폴리오 사이트입니다.",
  openGraph: {
    title: "ikjun.dev",
    description: "개발자 조익준에 대한 포트폴리오 사이트입니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://ikjun-dev.vercel.app/",
    siteName: "ikjun.dev",
    images: [
      {
        url: "https://ikjun-dev.vercel.app/ikjun-dev.png",
        width: 800,
        height: 800,
        alt: "ikjun.dev 프로필",
      },
    ],
  },
  twitter: {
    title: "ikjun.dev",
    description: "개발자 조익준에 대한 포트폴리오 사이트입니다.",
    images: ["https://ikjun-dev.vercel.app/ikjun-dev.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-800">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />

          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
