import { Navigate, Outlet } from 'react-router'
import NavBar from '~/components/organisms/navbar'
import { useAuthStore } from '~/features/auth/context/auth.store'

export default function RootLayout() {
  const { isLoading, isAuthenticated, user } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[url('/background/background2.png')] bg-cover bg-center">
        <span className="font-lexend text-xl text-white animate-pulse bg-black/50 px-4 py-2 rounded-md">
          Loading Taft Eats...
        </span>
      </div>
    )
  }

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return (
    <>
      <div className="min-h-screen w-full bg-[url('/background/background2.png')] bg-cover bg-center">
        <NavBar />
        <Outlet />
      </div>
    </>
  )
}
