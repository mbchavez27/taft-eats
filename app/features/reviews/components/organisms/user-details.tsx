import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

export default function UserDetails() {
  return (
    <>
      <main className="flex font-lexend items-center gap-3">
        <div>
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className="text-xl">User 122</h1>
          <p className="text-lg opacity-50">01/20/26</p>
        </div>
      </main>
    </>
  )
}
