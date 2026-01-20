import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { EducationSection } from "@/components/EducationSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { getExperiences, getSkills, getProjects } from "@/lib/api";

// Revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  const experiencesData = getExperiences();
  const skillsData = getSkills();
  const projectsData = getProjects();

  const [experiences, skills, projects] = await Promise.all([
    experiencesData.catch(() => []),
    skillsData.catch(() => []),
    projectsData.catch(() => []),
  ]);

  // Sort projects on server side
  const sortedProjects = projects.sort((a, b) => {
    if (!a.endDate && b.endDate) return -1;
    if (a.endDate && !b.endDate) return 1;

    if (a.endDate && b.endDate && a.endDate !== b.endDate) {
      return b.endDate.localeCompare(a.endDate);
    }

    if (a.startDate && b.startDate) {
      return b.startDate.localeCompare(a.startDate);
    }
    return 0;
  });

  return (
    <main className="flex min-h-screen flex-col font-[family-name:var(--font-inter)]">
      <Hero />
      <About />
      <EducationSection />
      <ExperienceTimeline initialData={experiences} />
      <SkillsSection initialData={skills} />
      <ProjectsSection initialData={sortedProjects} />
      <ContactSection />
    </main>
  );
}
