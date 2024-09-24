import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "700"], // Specify the weights you need
});

export const metadata: Metadata = {
    title: "Interactive JSON Viewer | Collapsible JSON with Copy-to-Clipboard",
    description:
        "An interactive and aesthetically pleasing JSON viewer built with Next.js, TypeScript, and TailwindCSS. Parse, collapse, and copy JSON object paths easily with smooth animations.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={roboto.className}>{children}</body>
        </html>
    );
}
