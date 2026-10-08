import Hero from "@/components/Hero";
import PriceIncreased from "@/components/PriceIncreased";

export default function Home() {
  return (
    <main className="min-h-screen pb-12">
      <Hero />
      <PriceIncreased />
      
      {/* Target anchor for products list */}
      <div id="products-section" className="max-w-7xl mx-auto py-4">
      </div>
    </main>
  );
}