import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import SkillsRadar from "@/components/SkillsRadar";
import { SkillsSection } from "@/components/SkillsSection";
import ProjectCarousel from "@/components/ProjectCarousel";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col font-[family-name:var(--font-inter)]">
      <Hero />
      <About />
      <ExperienceTimeline />
      <SkillsRadar />
      <SkillsSection />
      <ProjectCarousel />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
