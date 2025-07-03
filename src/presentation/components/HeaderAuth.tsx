import logo from "../../assets/logo.png"; // Adjust the path as necessary

export default function HeaderAuth() {
  return (
    <header className="relative w-full h-auto mb-[-1px] bg-[#12273e]">
      <div className="w-55 flex lg:w-70 relative items-center h-30 pt-12 pb-7 ">
        <img
          src={logo}
          alt="logo San Luis Distribuidora"
          className="size-55 bg-transparent lg:size-70 object-cover relative md:left-[-19px]"
        />
      </div>
    </header>
  );
}
