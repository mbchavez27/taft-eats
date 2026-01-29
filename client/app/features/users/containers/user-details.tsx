import ImageContainer from "~/features/shared/container/image-container";
import UserInfo from "../components/organisms/user-info";

export default function UserDetails() {
  return (
    <>
      <main className="w-xs font-lexend text-[#BFD392] px-4 flex flex-col gap-5">
        <ImageContainer />
        <UserInfo />
      </main>
    </>
  );
}
