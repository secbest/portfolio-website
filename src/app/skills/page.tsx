import type { Metadata } from "next";
import SkillsShowcase from "@/components/SkillsShowcase";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsPage() {
  return <SkillsShowcase heading="h1" />;
}
