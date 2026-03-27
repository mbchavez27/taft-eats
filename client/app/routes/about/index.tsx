import { ScrollArea } from '~/components/ui/scroll-area'
import type { Route } from './+types/index'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Taft Eats: Admin - About Us' },
    { name: 'description', content: 'About us' },
  ]
}

export default function AboutUs() {
  return (
    <main className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-8">
      <header>
        <h1 className="font-climate text-3xl md:text-5xl text-[#326F33] uppercase">
          About Taft Eats
        </h1>
      </header>

      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <div className="flex flex-col gap-10">
          {/* Description Section */}
          <section className="text-gray-800 text-lg md:text-xl leading-relaxed font-lexend space-y-4">
            <p>
              <strong>Taft Eats</strong> is a restaurant review web app designed
              specifically for DLSU students. Both registered and unregistered
              students can browse restaurants and read reviews without creating
              an account.
            </p>
            <p>
              Registered students, however, can post reviews, rate restaurants,
              and interact with other users’ content. Students can also save
              their favorite restaurants to revisit later.
            </p>
            <p>
              Additionally, the app features a location-based discovery tool,
              allowing students to find restaurants near them using nearby
              campus landmarks such as popular condos or campus gates (e.g.,
              Henry Sy, Agno Gate).
            </p>
          </section>

          {/* Tech Stack Section */}
          <section>
            <h2 className="font-climate text-2xl md:text-3xl text-black uppercase mb-6">
              Our Tech Stack
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frontend Libraries */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-xl text-[#326F33] mb-4 font-lexend">
                  Frontend
                </h3>
                <ul className="space-y-3 text-gray-700 font-inter">
                  <li>
                    <strong>React & React Router (v7)</strong> - Core UI
                    framework and routing.
                  </li>
                  <li>
                    <strong>Tailwind CSS</strong> - Utility-first styling.
                  </li>
                  <li>
                    <strong>TanStack React Query</strong> - Data fetching,
                    caching, and state synchronization.
                  </li>
                  <li>
                    <strong>Zustand</strong> - Lightweight global state
                    management.
                  </li>
                  <li>
                    <strong>Leaflet & React-Leaflet</strong> - Interactive maps
                    for location-based discovery.
                  </li>
                  <li>
                    <strong>Radix UI</strong> - Accessible, unstyled component
                    primitives.
                  </li>
                </ul>
              </div>

              {/* Backend Libraries */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-xl text-[#326F33] mb-4 font-lexend">
                  Backend
                </h3>
                <ul className="space-y-3 text-gray-700 font-inter">
                  <li>
                    <strong>Express.js</strong> - Fast, unopinionated Node.js
                    web framework.
                  </li>
                  <li>
                    <strong>MySQL2</strong> - High-performance database driver.
                  </li>
                  <li>
                    <strong>Zod</strong> - TypeScript-first schema declaration
                    and validation.
                  </li>
                  <li>
                    <strong>JWT & Bcrypt</strong> - Secure user authentication
                    and password hashing.
                  </li>
                  <li>
                    <strong>Multer</strong> - Middleware for handling file and
                    image uploads.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact / Issues Section */}
          <section className="pb-12">
            <h2 className="font-climate text-2xl md:text-3xl text-black uppercase mb-6">
              Report an Issue
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-700 font-inter mb-4">
                Encountering bugs or have feedback for Taft Eats? Please reach
                out to our team:
              </p>
              <ul className="space-y-2 font-inter font-medium text-[#326F33]">
                <li>
                  <a
                    href="mailto:alex_gonzales@dlsu.edu.ph"
                    className="hover:underline hover:text-green-800 transition-colors"
                  >
                    alex_gonzales@dlsu.edu.ph
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:max_chavez@dlsu.edu.ph"
                    className="hover:underline hover:text-green-800 transition-colors"
                  >
                    max_chavez@dlsu.edu.ph
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:andronicus_alegre@dlsu.edu.ph"
                    className="hover:underline hover:text-green-800 transition-colors"
                  >
                    andronicus_alegre@dlsu.edu.ph
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </ScrollArea>
    </main>
  )
}
