import PortfolioExperience from "@/components/portfolio/PortfolioExperience";
import Hero from "@/components/portfolio/Hero";

export default function Home() {
  return (
    <main className="w-full max-w-screen-xl mx-auto">
      <PortfolioExperience>
        <Hero />
      </PortfolioExperience>
    </main>
  );
}
