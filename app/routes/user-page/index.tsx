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
      <main></main>
    </>
  );
}
