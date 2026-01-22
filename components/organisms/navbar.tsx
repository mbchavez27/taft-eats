export default function NavBar() {
  return (
    <>
      <nav className="bg-[#FFFFFF] flex justify-between px-10 py-2">
        <div className="flex items-center gap-1">
          <img
            src="/logos/tafteats_logo.png"
            alt="logo"
            width={73}
            height={73}
          />
          <div className="font-bold text-[#326F33] text-lg">
            <h1>TAFT</h1>
            <h1>EATS</h1>
          </div>
        </div>
      </nav>
    </>
  );
}
