import Hero from "@/components/Hero";
import PriceIncreased from "@/components/PriceIncreased";
import PriceDecreased from "@/components/PriceDecreased";

export default function Home() {
  return (
    <main className="min-h-screen pb-12">
      <Hero />
      <PriceIncreased />
      <PriceDecreased />
      
      {/* Target anchor for future full products list */}
      <div id="products-section" className="max-w-7xl mx-auto py-4">
      </div>
    </main>
  );
}