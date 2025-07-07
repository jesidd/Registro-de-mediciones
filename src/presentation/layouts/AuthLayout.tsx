import HeaderAuth from "../components/HeaderAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen relative lg:pt-12 bg-[#12273e] box-border overflow-auto">
      <div className="w-full h-full md:w-120 md:h-150 lg:w-140 lg:h-160 relative mx-auto bg-white">
        <HeaderAuth />
        <div className="slice-start"></div>
        <main className="mx-auto min-h-[70%]">{children}</main>
        <div className="hidden md:block slice-end mr-[2px]"></div>
      </div>
    </div>
  );
}
