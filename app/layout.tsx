import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import PageTransition from "@/components/PageTransition";
import { getGlobalData } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Francis | Art Director & Graphic Designer",
  description: "Francis Xavier is an Art Director and Graphic Designer based in Toronto, specializing in branding, typography, and UI/UX.",
  keywords: ["Art Director", "Graphic Designer", "Branding", "Typography", "UI/UX", "Toronto", "Portfolio"],
  authors: [{ name: "Francis Xavier" }],
  creator: "Francis Xavier",
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
  const global = getGlobalData();
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <Header location={global.location} links={global.headerLinks} />
        {/* Bottom padding clears the floating nav pill plus breathing room,
            and the phone's home-indicator area if any */}
        <main 
          className="px-4 md:px-6 pb-[calc(6rem+env(safe-area-inset-bottom))] min-h-screen"
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
