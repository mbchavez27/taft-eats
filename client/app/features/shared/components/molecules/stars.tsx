import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function Stars({ size = 32 }: { size?: number }) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  const handleClick = (index: number) => {
    setRating(index + 1);
  };
  return (
    <>
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          onMouseEnter={() => setHover(index + 1)}
          onMouseLeave={() => setHover(0)}
        >
          {index < (hover || rating) ? (
            <FaStar size={size} color="#FFD24D" />
          ) : (
            <FaRegStar size={size} color="#FFD24D" />
          )}
        </div>
      ))}
    </>
  );
}
