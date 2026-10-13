import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import GlobalSnackbar from "@/components/common/globalSnackbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SHOP CO",
  description: "Multibrand Fashion E-commerce",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
        <Navbar/>
          <GlobalSnackbar/>
        <main className="flex-1 flex flex-col pt-27 pb-11 dark:bg-zinc-950/10 min-h-screen">
        {children}
        </main>
        <Footer/>
        </Providers>
        </body>
    </html>
  );
}
