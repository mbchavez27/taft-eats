import { FaUser } from 'react-icons/fa'
import { MdOutlineRestaurantMenu } from 'react-icons/md'
import { FaStar } from 'react-icons/fa6'
import { useAuthStore } from '~/features/auth/context/auth.store'
import UserData from '../molecules/user-data'

export default function UserStatistics() {
  const { user, userReviewCount } = useAuthStore()
  return (
    <main className="bg-white rounded-3xl px-8 py-10 flex flex-row flex-wrap gap-10 w-full h-full">
      <div className="flex-1 flex flex-col gap-4 justify-center items-center">
        <UserData
          label="Account Created"
          value={
            user?.created_at ? new Date(user.created_at).getFullYear() : 2026
          }
          icon={FaUser}
        />
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
        <UserData
          label="Created Reviews"
          value={userReviewCount}
          icon={FaStar}
        />
      </div>
    </main>
  )
}
