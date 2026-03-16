import { Outlet, Navigate } from 'react-router'
import AdminNavBar from '~/features/admin/components/organisms/admin-navbar'
import AdminSidebar from '~/features/admin/components/organisms/admin-sidebar'
import { useAuthStore } from '~/features/auth/context/auth.store'

export default function AdminLayout() {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-200">
        <span className="font-lexend text-gray-500 animate-pulse">
          Verifying access...
        </span>
      </main>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace /> // Send them back to the homepage
  }

  return (
    <main className="flex min-h-screen bg-gray-200">
      <AdminSidebar />

      <section className="flex flex-col flex-1">
        <AdminNavBar />

        <section className="p-6">
          <Outlet />
        </section>
      </section>
    </main>
  )
}
