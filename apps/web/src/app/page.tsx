import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}
