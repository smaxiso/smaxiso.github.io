import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col font-[family-name:var(--font-inter)]">
      <Hero />
      <About />
      <ExperienceTimeline />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
