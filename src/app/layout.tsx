import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Cellacin research facility",
    description: "Welcome to the reasearch facility. We hope you have a pleasant stay.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}