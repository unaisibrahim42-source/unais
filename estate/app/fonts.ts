// Swap these for any Google Font to re-brand typography.
import { Cormorant_Garamond, Inter } from "next/font/google";

export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
