import "./globals.css";
import { Kanit } from "next/font/google";

const kanit = Kanit({ subsets: ["thai", "latin"], weight: ["300", "400", "700"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={kanit.className}>
      <body>{children}</body>
    </html>
  );
}