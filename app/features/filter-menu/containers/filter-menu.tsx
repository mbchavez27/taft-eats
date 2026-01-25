import SelectCuisines from "../components/select-cusines";
import SelectTags from "../components/select-tags";
import StarRating from "../components/star-rating";

export default function FilterMenu() {
  return (
    <>
      <main className="bg-[#FFFF] border-t-36 rounded-xl border-[#FFBF00] w-xs font-lexend text-[#326F33] py-2">
        <SelectCuisines />
        <hr className="border border-gray" />
        <StarRating />
        <hr className="border border-gray" />
        <SelectTags />
      </main>
    </>
  );
}
