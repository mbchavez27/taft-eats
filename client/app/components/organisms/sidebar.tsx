import { GiHamburgerMenu } from 'react-icons/gi'
import { CiBookmark, CiLogout, CiCircleInfo } from 'react-icons/ci'
import { IoLocationOutline, IoHomeOutline } from 'react-icons/io5'
import { AiOutlineUser } from 'react-icons/ai'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { Link } from 'react-router'

import { useAuthStore } from '~/features/auth/context/auth.store'
import OwnerSettings from '~/features/users/containers/owner-settings'

export default function SideBar() {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const isOwner = user?.role === 'owner'

  return (
    <section className="flex lg:hidden">
      <Sheet>
        <SheetTrigger className="text-[#326F33]">
          <GiHamburgerMenu size={24} />
        </SheetTrigger>
        <SheetContent className="bg-[#326F33] border-none outline-none shadow-none text-white flex flex-col">
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

          <div className="flex flex-col gap-4 px-2 mt-8 overflow-y-auto">
            {isLoading ? (
              // Loading Skeleton
              <div className="animate-pulse flex flex-col gap-4">
                <div className="bg-[#285a29] h-10 w-full rounded-full"></div>
                <div className="bg-[#285a29] h-10 w-full rounded-full"></div>
                <div className="bg-[#285a29] h-10 w-full rounded-full"></div>
              </div>
            ) : isOwner ? (
              // OWNER VIEW
              <div className="flex flex-col gap-4">
                <div className="bg-white/10 p-2 rounded-xl">
                  <OwnerSettings />
                </div>
                <Link
                  to="/user/"
                  className="border border-white px-4 py-2 rounded-full flex gap-3 items-center hover:bg-white/10 transition-colors"
                >
                  <AiOutlineUser size={24} />
                  User Profile
                </Link>
                <button className="border border-red-400 text-red-100 px-4 py-2 rounded-full flex gap-3 items-center hover:bg-red-400/20 transition-colors w-full text-left">
                  <CiLogout size={24} />
                  Log Out
                </button>
              </div>
            ) : (
              // REGULAR USER / GUEST VIEW
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="border border-white px-4 py-2 rounded-full flex gap-3 items-center hover:bg-white/10 transition-colors"
                >
                  <IoHomeOutline size={24} />
                  Home View
                </Link>
                <Link
                  to="/maps/"
                  className="border border-white px-4 py-2 rounded-full flex gap-3 items-center hover:bg-white/10 transition-colors"
                >
                  <IoLocationOutline size={24} />
                  Map View
                </Link>
                <Link
                  to="/about/"
                  className="border border-white px-4 py-2 rounded-full flex gap-3 items-center hover:bg-white/10 transition-colors"
                >
                  <CiCircleInfo size={24} />
                  About Us
                </Link>

                {isAuthenticated ? (
                  // LOGGED IN USER LINKS
                  <>
                    <Link
                      to="/bookmarks/"
                      className="border border-white px-4 py-2 rounded-full flex gap-3 items-center hover:bg-white/10 transition-colors"
                    >
                      <CiBookmark size={24} />
                      Bookmarks
                    </Link>
                    <Link
                      to="/user/"
                      className="border border-white px-4 py-2 rounded-full flex gap-3 items-center hover:bg-white/10 transition-colors"
                    >
                      <AiOutlineUser size={24} />
                      User Profile
                    </Link>
                    <button className="border border-red-400 text-red-100 px-4 py-2 rounded-full flex gap-3 items-center hover:bg-red-400/20 transition-colors w-full text-left">
                      <CiLogout size={24} />
                      Log Out
                    </button>
                  </>
                ) : (
                  // GUEST LINKS
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/20">
                    <Link
                      to="/auth/login"
                      className="bg-white text-[#326F33] text-center font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/auth/sign-up"
                      className="bg-transparent border-white border text-center text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}
