import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function SavedEstablishments() {
  const establishments = [
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
  ];

  const visible = 3;
  const extraCount = establishments.length - visible;

  return (
    <main className="bg-white rounded-3xl px-10 py-8 flex flex-col w-full h-full">
      <h1 className="font-bold text-xl mb-6">Saved Establishments</h1>

      <div className="flex flex-row gap-5 flex-1 justify-start">
        {establishments.slice(0, visible).map((src, index) => (
          <Avatar key={index} className="w-20 h-20">
            <AvatarImage src={src} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}

        {extraCount > 0 && (
          <Avatar className="w-20 h-20 bg-gray-300 text-black flex items-center justify-center">
            <AvatarFallback>+{extraCount}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </main>
  );
}
