import Prices from "~/features/shared/components/molecules/prices";

export default function PriceRange() {
  return (
    <section className="flex flex-col gap-2 px-8 py-2">
      <h1 className="font-bold text-2xl">Price Range</h1>

      <div className="py-1 flex gap-2">
        <Prices />
      </div>
    </section>
  );
}
