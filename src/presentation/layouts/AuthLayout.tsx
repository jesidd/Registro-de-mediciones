import HeaderAuth from "../components/HeaderAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen bg-[#12273e] overflow-hidden">
      <div className="w-full h-full md:w-120 md:h-140 relative mx-auto bg-white">
        <HeaderAuth />
        <div className="slice-start"></div>
        <main className="mx-auto min-h-full">{children}</main>
        <div className="hidden md:block slice-end"></div>
      </div>
    </div>
  );
}
