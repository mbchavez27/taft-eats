import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function UserPopover() {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="bg-[#326F33] text-white p-2 rounded-full">
            <AiOutlineUser size={24} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-white text-[#326F33] border-2 border-[#326F33] font-lexend font-bold px-6 py-8 flex flex-col justify-center items-center gap-6">
          <PopoverHeader className="flex flex-col justify-center items-center gap-2">
            <Avatar className="w-16 h-16">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl">Hi! User 123</h1>
              <p className="text-md text-[#9CB16F]">user123@gmail.com</p>
            </div>
          </PopoverHeader>
          <section className="font-inter font-semibold text-xl flex flex-col gap-4">
            <Link
              to={"/user/"}
              className="bg-white text-black border border-black rounded-full px-3 py-2 hover:bg-black hover:text-white transition duration-100 "
            >
              View Profile
            </Link>
            <button className="bg-[#326F33] text-white border border-[#326F33] rounded-full px-3 py-2 hover:bg-white hover:text-[#326F33] transition duration-100">
              Log Out
            </button>
          </section>
        </PopoverContent>
      </Popover>
    </>
  );
}
