import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Skills from "@/components/home/Skills";
import Work from "@/components/home/Work";
import Hobbies from "@/components/home/Hobbies";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <About />
      <Skills />
      <Work />
      <Hobbies />
      <Contact />
    </div>
  );
}
