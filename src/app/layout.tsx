import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { Header, Footer, MessengerButtons, CallbackButton } from "@/components/layout";
import { Toaster } from "@/components/ui";
import { PLACEHOLDER } from "@/lib/constants";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  weight: ["700", "900"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: PLACEHOLDER.companyName,
    template: `%s | ${PLACEHOLDER.companyName}`,
  },
  description: PLACEHOLDER.siteDescription,
  keywords: [
    "приправи оптом",
    "макарони оптом",
    "консерви оптом",
    "олія оптом",
    "оптова торгівля",
    "продукти харчування",
    "прямий постачальник",
    "бакалія оптом",
    "Україна",
  ],
  authors: [{ name: PLACEHOLDER.companyName }],
  creator: PLACEHOLDER.companyName,
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: PLACEHOLDER.companyName,
    title: PLACEHOLDER.companyName,
    description: PLACEHOLDER.siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${playfairDisplay.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <MessengerButtons />
        <CallbackButton />
        <Toaster />
      </body>
    </html>
  );
}
