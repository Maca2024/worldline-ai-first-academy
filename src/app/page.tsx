import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Instructors } from "@/components/instructors";
import { Curriculum } from "@/components/curriculum";
import { Labs } from "@/components/labs";
import { ToolStack } from "@/components/tool-stack";
import { Models } from "@/components/models";
import { RalfLoop } from "@/components/ralf-loop";
import { Maturity } from "@/components/maturity";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Stats />
      <Instructors />
      <Curriculum />
      <Labs />
      <ToolStack />
      <Models />
      <RalfLoop />
      <Maturity />
      <Footer />
    </main>
  );
}
