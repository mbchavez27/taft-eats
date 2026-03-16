import { Link, useLocation } from 'react-router'

export default function AdminSidebar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path
  return (
    <>
      <nav className="bg-white drop-shadow-2xl px-3 py-2 w-78.25">
        <header className="flex gap-1 items-center">
          <img src="/logos/tafteats_logo.png" width={90} height={90} alt="" />
          <div className="font-climate text-2xl text-[#326F33]">
            <h1>TAFT</h1>
            <h1>EATS</h1>
          </div>
        </header>
        <section className="px-20 py-28">
          <div className="font-lexend text-2xl text-[#326F33] flex flex-col gap-10">
            <Link
              to="/admin/"
              className={isActive('/admin/users') ? 'font-bold' : 'font-normal'}
            >
              Users
            </Link>

            <Link
              to="/admin/establishments"
              className={
                isActive('/admin/establishments') ? 'font-bold' : 'font-normal'
              }
            >
              Establishments
            </Link>

            <Link
              to="/admin/reviews"
              className={
                isActive('/admin/reviews') ? 'font-bold' : 'font-normal'
              }
            >
              Reviews
            </Link>
          </div>
        </section>
      </nav>
    </>
  )
}
