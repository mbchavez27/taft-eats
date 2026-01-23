import { useRef } from "react";
import { IoIosSearch } from "react-icons/io";

export default function SearchField() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-sm font-inter">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for restaurants, cuisines, and dishes"
        className="w-full border-3 border-[#326F33] rounded-xl text-sm px-4 py-2 pr-16 focus:outline-none"
      />
      <button
        onClick={handleSearchClick}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#326F33] text-white px-2 py-2 rounded-xl flex items-center justify-center border-3 border-[#326F33]"
      >
        <IoIosSearch size={20} />
      </button>
    </div>
  );
}
