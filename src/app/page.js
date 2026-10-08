import Hero from "@/components/Hero";
import PriceIncreased from "@/components/PriceIncreased";
import PriceDecreased from "@/components/PriceDecreased";
import AllProducts from "@/components/AllProducts";

export default function Home() {
  return (
    <main className="min-h-screen pb-12">
      <Hero />
      <PriceIncreased />
      <PriceDecreased />
      
      <div id="products-section">
        <AllProducts />
      </div>
    </main>
  );
}