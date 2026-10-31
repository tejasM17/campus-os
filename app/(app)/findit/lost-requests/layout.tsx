import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Lost reports | CampusOS FindIt" };

export default function LostRequestsLayout({ children }: { children: ReactNode }) {
  return children;
}
