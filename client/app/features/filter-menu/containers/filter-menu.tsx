import PriceRange from "../components/organisms/price-range";
import SelectCuisines from "../components/organisms/select-cusines";
import SelectTags from "../components/organisms/select-tags";
import StarRating from "../components/organisms/star-rating";

export default function FilterMenu() {
  return (
    <>
      <main className="bg-[#FFFF] border-t-36 rounded-xl border-[#FFBF00] w-xs font-lexend text-[#326F33] py-2 flex flex-col gap-3">
        <SelectCuisines />
        <hr className="border border-gray" />
        <StarRating />
        <hr className="border border-gray" />
        <PriceRange />
        <hr className="border border-gray" />
        <SelectTags />
      </main>
    </>
  );
}
