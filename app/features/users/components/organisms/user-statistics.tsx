import { FaUser } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import UserData from "../molecules/user-data";

export default function UserStatistics() {
  return (
    <main className="bg-white rounded-3xl px-8 py-10 flex flex-row flex-wrap gap-10 w-full h-full">
      <div className="flex-1 flex flex-col gap-4 justify-center items-center">
        <UserData label="Account Created" value={2026} icon={FaUser} />
      </div>

      <div className="w-px bg-gray-300 self-stretch hidden lg:block" />

      <div className="flex-1 flex flex-col gap-4 justify-center items-center">
        <UserData
          label="Saved Establishments"
          value={3}
          icon={MdOutlineRestaurantMenu}
        />
      </div>

      <div className="w-px bg-gray-300 self-stretch hidden lg:block" />

      <div className="flex-1 flex flex-col gap-4 justify-center items-center">
        <UserData label="Created Reviews" value={20} icon={FaStar} />
      </div>
    </main>
  );
}
