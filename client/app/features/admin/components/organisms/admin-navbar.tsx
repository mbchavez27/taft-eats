import { AiOutlineUser } from 'react-icons/ai'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

export default function AdminNavBar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <nav className="bg-[#FFFFFF] flex items-center justify-end px-8 lg:px-16 md:py-2">
        <section className="relative flex gap-3 items-center" ref={menuRef}>
          <button
            type="button"
            className="bg-[#326F33] text-white p-2 rounded-full cursor-pointer hover:bg-[#285a29] transition-colors"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <AiOutlineUser size={24} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-40 rounded-lg border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/')
                }}
              >
                Logout
              </button>
            </div>
          )}
        </section>
      </nav>
    </>
  )
}
