import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { getExperiences } from "@/lib/api";

// Revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  const experiences = await getExperiences().catch(() => []);

  return (
    <main className="flex min-h-screen flex-col font-[family-name:var(--font-inter)]">
      <Hero />
      <About />
      <ExperienceTimeline initialData={experiences} />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
