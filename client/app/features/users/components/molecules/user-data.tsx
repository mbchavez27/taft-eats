import type { IconType } from "react-icons/lib";

export default function UserData({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: IconType;
}) {
  return (
    <>
      <section className="flex flex-col gap-4 justify-center items-center font-lexend">
        <div className="bg-[#326F33] text-white rounded-full p-2">
          {Icon && <Icon size={22} color="white" />}
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-semibold text-4xl">{value}</h1>
          <p className="text-md opacity-50 text-center">{label}</p>
        </div>
      </section>
    </>
  );
}
