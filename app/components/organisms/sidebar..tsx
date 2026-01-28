import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiBookmark } from "react-icons/ci";
import { IoLocationOutline, IoHomeOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export default function SideBar() {
  const [isAuthendicated, setAuthentication] = useState(true);
  return (
    <>
      <section className="flex lg:hidden">
        <Sheet>
          <SheetTrigger className="text-[#326F33]">
            <GiHamburgerMenu size={24} />
          </SheetTrigger>
          <SheetContent className="bg-[#326F33] border-none outline-none shadow-none">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-1">
                  <img
                    src="/logos/tafteats_logo.png"
                    alt="logo"
                    width={75}
                    height={75}
                  />
                  <div className="font-climate text-white text-xl">
                    <h1>TAFT</h1>
                    <h1>EATS</h1>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col justify-center gap-6 px-4">
              {isAuthendicated ? (
                <>
                  <div className="flex justify-center gap-3 p-2 text-white ">
                    <div className="flex gap-2 items-center border border-white px-3 py-2 rounded-lg">
                      <AiOutlineUser size={24} />
                      User
                    </div>
                    <div className="flex gap-2 items-center border border-white px-3 py-2 rounded-lg">
                      <CiBookmark size={24} />
                      Bookmark
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium flex ml-4 gap-5">
                    <button className="bg-white text-black border border-black px-4 py-1 rounded-lg">
                      Log In
                    </button>
                    <button className="bg-[#326F33] border-white border text-white px-3 py-1 rounded-lg">
                      Sign Up
                    </button>
                  </div>
                </>
              )}

              <div className="bg-[#326F33] border-white border text-white px-4 py-2 rounded-full flex gap-2">
                <IoHomeOutline size={24} />
                Home View
              </div>
              <div className="bg-[#326F33] border-white border text-white px-4 py-2 rounded-full flex gap-2">
                <IoLocationOutline size={24} />
                Map View
              </div>
              <div className="bg-[#326F33] border-white border text-white px-4 py-2 rounded-full flex gap-2">
                <CiLogout size={24} />
                Log Out
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </section>
    </>
  );
}
