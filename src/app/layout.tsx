import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
export const metadata: Metadata = { title: "Campus Compass", description: "College discovery and decision-making platform" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Header />{children}<footer className="mt-14 border-t border-line bg-white py-7 text-center text-sm muted">Campus Compass · Demo education dataset — not official admission information.</footer></body></html>; }
