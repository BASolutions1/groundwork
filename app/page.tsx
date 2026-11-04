import { Bento } from "@/components/Bento";
import { FactsStrip } from "@/components/FactsStrip";
import { Footer } from "@/components/Footer";
import { Founder } from "@/components/Founder";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SiteNav } from "@/components/SiteNav";
import { StartForm } from "@/components/StartForm";

export default function Page() {
  return (
    <>
      <div className="relative">
        <SiteNav overlay />
        <Hero />
      </div>
      <main>
        <FactsStrip />
        <Bento />
        <HowItWorks />
        <Founder />
        <StartForm />
      </main>
      <Footer />
    </>
  );
}
