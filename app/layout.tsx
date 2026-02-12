import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import PageTransition from "@/components/PageTransition";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Francis | Art Director & Graphic Designer",
  description: "Francis Xavier is an Art Director and Graphic Designer based in Toronto, specializing in branding, typography, and UI/UX.",
  keywords: ["Art Director", "Graphic Designer", "Branding", "Typography", "UI/UX", "Toronto", "Portfolio"],
  authors: [{ name: "Francis Xavier" }],
  creator: "AliveOrdinary",
  icons: {
    icon: [
      {
        url: "/White-favicon.ico",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/Black-favicon.ico",
        media: "(prefers-color-scheme: light)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} font-sans antialiased bg-background text-foreground`}>
        <Header />
        <main 
          className="px-4 md:px-6 pb-2 min-h-screen"
        >
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <BottomNav />
        
        <Script 
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="afterInteractive"
        />
        <Script id="netlify-identity-redirect" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && window.netlifyIdentity) {
              window.netlifyIdentity.on("init", user => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
