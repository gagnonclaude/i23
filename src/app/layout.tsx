import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "i23 — Améliorer sa trajectoire de vie",
  description: "i23 aide les gens à améliorer leur trajectoire de vie une expérience à la fois. Méthode i+, Masterclass, Outils interactifs, Groupes i+.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
