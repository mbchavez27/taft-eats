import RestaurantView from "~/features/restaurant-view/containers/restaurant-view";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Taft Eats" },
    { name: "description", content: "Taft Eats" },
  ];
}

export default function Home() {
  return (
    <>
      <RestaurantView />
    </>
  );
}
