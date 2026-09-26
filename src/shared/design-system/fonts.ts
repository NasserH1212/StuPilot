import { Noto_Sans, Noto_Sans_Arabic } from "next/font/google";

export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

export const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const fontVariables = `${notoSansArabic.variable} ${notoSans.variable}`;
