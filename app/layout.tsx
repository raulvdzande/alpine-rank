import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "PeakFlow — De rankings die skiërs vertrouwen",
  description:
    "Vergelijk 2.000+ skigebieden op sneeuwkwaliteit, pistekm, niveau en prijs. Vind het perfecte resort met AI — in 10 seconden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body suppressHydrationWarning>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
