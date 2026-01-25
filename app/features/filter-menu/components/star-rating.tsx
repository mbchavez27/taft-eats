import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function StarRating() {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  const handleClick = (index: number) => {
    setRating(index + 1);
  };

  return (
    <section className="flex flex-col gap-2 px-8 py-2">
      <div>
        <h1 className="font-bold text-2xl">Star Rating</h1>
      </div>
      <div className="px-5 py-1 text-[#FFD24D] flex gap-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHover(index + 1)}
            onMouseLeave={() => setHover(0)}
          >
            {index < (hover || rating) ? (
              <FaStar size={32} color="#FFD24D" />
            ) : (
              <FaRegStar size={32} color="#FFD24D" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
