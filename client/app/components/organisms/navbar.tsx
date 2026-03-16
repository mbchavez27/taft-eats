import { IoLocationOutline, IoHomeOutline } from 'react-icons/io5'
import { CiBookmark } from 'react-icons/ci'
import SearchField from '~/components/molecules/searchfield'
import SideBar from './sidebar'
import { Link } from 'react-router'
import UserPopover from './user-popover'
import OwnerSettings from '~/features/users/containers/owner-settings'
import { useAuthStore } from '~/features/auth/context/auth.store'
import { useLogout } from '~/features/auth/hooks/useLogout'

export default function NavBar() {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const isOwner = user?.role === 'owner'
  const { handleLogout } = useLogout()

  return (
    <>
      <nav className="bg-[#FFFFFF] flex items-center justify-between px-8 lg:px-16 md:py-2">
        <section>
          <Link to={'/'} className="flex items-center gap-1">
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
          </Link>
        </section>
        <SideBar />

        {isOwner ? (
          <>
            <div className="hidden lg:flex items-center flex-1 justify-center max-w-xl mx-4">
              <SearchField placeholder="Search for restaurants, cuisines, and dishes" />
            </div>
          </>
        ) : null}

        <section className="hidden lg:flex font-inter text-lg items-center gap-12">
          <div className="flex gap-12 items-center">
            {isOwner ? null : (
              <>
                <div className="hidden lg:flex items-center w-md">
                  <SearchField placeholder="Search for restaurants, cuisines, and dishes" />
                </div>
              </>
            )}
            {isOwner ? (
              <>
                <div className="flex gap-3">
                  <OwnerSettings />
                  <UserPopover />
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <Link
                    to="/"
                    className="bg-[#326F33] text-white p-2 rounded-full"
                  >
                    <IoHomeOutline size={24} />
                  </Link>
                  <Link
                    to="/maps/"
                    className="bg-[#326F33] text-white p-2 rounded-full"
                  >
                    <IoLocationOutline size={24} />
                  </Link>
                </div>
                <div className="flex gap-3">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-24 rounded-lg"></div>
                  ) : isAuthenticated ? (
                    <>
                      <Link
                        to={'/bookmarks/'}
                        className="bg-[#326F33] text-white p-2 rounded-full"
                      >
                        <CiBookmark size={24} />
                      </Link>
                      <UserPopover />
                    </>
                  ) : (
                    <>
                      <div className="font-medium flex ml-4 gap-5">
                        <Link
                          to={'/auth/login'}
                          className="bg-white text-black border border-black px-4 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Log In
                        </Link>
                        <Link
                          to={'/auth/sign-up'}
                          className="bg-[#326F33] text-white px-3 py-1 rounded-lg hover:bg-[#285a29] transition-colors"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </nav>
    </>
  )
}
