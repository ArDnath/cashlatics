import HeroSection from "@/components/hero";
import FeaturesSection from "@/components/landing/feature-section";
import SocialProof from "@/components/landing/social-proof";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* GLOBAL BACKGROUND LAYER - Stays fixed while scrolling */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Horizontal Notebook Lines */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, #000 39px, #000 40px)`,
          }}
        />

        {/* Vertical Margin Lines */}
        <div className="absolute top-0 bottom-0 left-12 w-px bg-black/5" />
        <div className="absolute top-0 bottom-0 right-12 w-px bg-black/5" />
      </div>

      {/* CONTENT LAYER - Transparent backgrounds allow lines to show through */}
      <div className="relative z-10">
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        {/* You can add more sections here (e.g., <Features />, <Pricing />)
            and the lines will naturally continue behind them. */}
        <div className="h-screen" /> {/* Spacer to test scrolling effect */}
      </div>
    </main>
  );
}
