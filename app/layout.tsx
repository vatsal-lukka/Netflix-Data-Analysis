import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netflix Analytics Dashboard",
  description: "Interactive Netflix data science dashboard built with Python, Pandas, Plotly, and Next.js.",
  keywords: ["Netflix", "analytics", "data science", "dashboard", "Next.js", "Plotly"],
  openGraph: {
    title: "Netflix Analytics Dashboard",
    description: "Explore Netflix titles through interactive KPIs, filters, charts, and insights.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Netflix Analytics Dashboard",
    description: "A portfolio-ready Netflix analytics dashboard powered by Python and Next.js."
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
