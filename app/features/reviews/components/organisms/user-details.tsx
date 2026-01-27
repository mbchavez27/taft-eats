import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

export default function UserDetails() {
  return (
    <main className="flex font-lexend items-center gap-3">
      <Avatar className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div>
        <h1 className="text-base sm:text-lg lg:text-xl">User 122</h1>
        <p className="text-sm sm:text-base lg:text-lg opacity-50">01/20/26</p>
      </div>
    </main>
  )
}
