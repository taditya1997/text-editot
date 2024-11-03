import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Provider } from "./Provider";
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  title: "Text Editor",
  description: "A simple text editor built with Next.js and Tailwind CSS",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#3371FF", fontSize: "16px" },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen font-sans  antialiased",
            inter.variable
          )}
        >
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
