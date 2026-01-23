import { useState } from "react";
import { IoLocationOutline, IoHomeOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import SearchField from "~/components/molecules/searchfield";
import SideBar from "./sidebar.";

export default function NavBar() {
  const [isAuthendicated, setAuthentication] = useState(true);
  return (
    <>
      <nav className="bg-[#FFFFFF] flex items-center justify-between px-8 lg:px-16 md:py-2">
        <section>
          <div className="flex items-center gap-1">
            <img
              src="/logos/tafteats_logo.png"
              alt="logo"
              width={75}
              height={75}
            />
            <div className="hidden md:inline font-climate text-[#326F33] text-xl">
              <h1>TAFT</h1>
              <h1>EATS</h1>
            </div>
          </div>
        </section>
        <SideBar />
        <section className="hidden lg:flex font-inter text-lg items-center gap-12">
          <div className="flex items-center">
            <SearchField />
          </div>
          <div className="flex gap-12">
            <div className="flex gap-3">
              <div className="bg-[#326F33] text-white p-2 rounded-full">
                <IoHomeOutline size={24} />
              </div>
              <div className="bg-[#326F33] text-white p-2 rounded-full">
                <IoLocationOutline size={24} />
              </div>
            </div>
            <div className="flex gap-3">
              {isAuthendicated ? (
                <>
                  <div className="bg-[#326F33] text-white p-2 rounded-full">
                    <CiBookmark size={24} />
                  </div>
                  <div className="bg-[#326F33] text-white p-2 rounded-full">
                    <AiOutlineUser size={24} />
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium flex ml-4 gap-5">
                    <button className="bg-white text-black border border-black px-4 py-1 rounded-lg">
                      Log In
                    </button>
                    <button className="bg-[#326F33] text-white px-3 py-1 rounded-lg">
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </nav>
    </>
  );
}
