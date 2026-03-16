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
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* LMS Access Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-accent-blue/90 backdrop-blur-sm text-white text-center py-2 text-sm">
        <span className="mr-2">Worldline medewerker?</span>
        <Link href="/login" className="font-semibold underline underline-offset-2 hover:text-white/80">
          Log in op de Academy →
        </Link>
      </div>
      <div className="h-10" /> {/* Spacer for fixed bar */}
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
