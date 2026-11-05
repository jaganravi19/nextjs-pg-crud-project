import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeopleDesk | Employee Management",
  description: "Manage employees and departments securely.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
