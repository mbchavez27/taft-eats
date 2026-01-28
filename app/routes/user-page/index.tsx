import UserDetails from "~/features/users/containers/user-details";
import type { Route } from "../+types/user-page/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Taft Eats - User" },
    { name: "description", content: "Taft Eats" },
  ];
}

export default function UserPage() {
  return (
    <>
      <main className="flex flex-col lg:flex-row py-12 px-10 lg:gap-8 gap-16">
        {/* Sidebar */}
        <div className="flex lg:w-1/4">
          <UserDetails />
        </div>

        {/* Main content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8"></div>
      </main>
    </>
  );
}
