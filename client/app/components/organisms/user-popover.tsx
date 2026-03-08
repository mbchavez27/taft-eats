import { AiOutlineUser } from 'react-icons/ai'
import { Link } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '~/components/ui/popover'
import { useAuthStore } from '~/features/auth/context/auth.store'
import { useLogout } from '~/features/auth/hooks/useLogout' // <-- Import your new hook

export default function UserPopover() {
  // 1. Get user state directly from the store
  const user = useAuthStore((state) => state.user)
  const isOwner = user?.role === 'owner'

  // 2. Get the logout function from your dedicated hook
  const { handleLogout } = useLogout()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="bg-[#326F33] text-white p-2 rounded-full cursor-pointer hover:bg-[#285a29] transition-colors">
          <AiOutlineUser size={24} />
        </div>
      </PopoverTrigger>

      <PopoverContent className="bg-white text-[#326F33] border-2 border-[#326F33] font-lexend font-bold px-6 py-8 flex flex-col justify-center items-center gap-6">
        <PopoverHeader className="flex flex-col justify-center items-center gap-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.profile_picture_url ?? undefined} />
            <AvatarFallback>
              {user?.username?.substring(0, 2).toUpperCase() || 'US'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl">
              Hi! {user?.name || user?.username || 'Guest'}
            </h1>
            <p className="text-md text-[#9CB16F]">{user?.email}</p>
          </div>
        </PopoverHeader>

        <section className="font-inter font-semibold text-xl flex flex-col gap-4 w-full text-center">
          {!isOwner ? (
            <Link
              to={`/user/`}
              className="bg-white text-black border border-black rounded-full px-3 py-2 hover:bg-black hover:text-white transition duration-100"
            >
              View Profile
            </Link>
          ) : (
            <Link
              to={`/restaurants/owner/${user?.user_id || ''}`}
              className="bg-white text-black border border-black rounded-full px-3 py-2 hover:bg-black hover:text-white transition duration-100"
            >
              View Restaurant
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="bg-[#326F33] text-white border border-[#326F33] rounded-full px-3 py-2 hover:bg-white hover:text-[#326F33] transition duration-100"
          >
            Log Out
          </button>
        </section>
      </PopoverContent>
    </Popover>
  )
}
