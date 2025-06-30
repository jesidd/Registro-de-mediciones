

const ButtonLayout = ({typeButton, text }: {typeButton: "button" | "submit" | "reset"; text: string}) => {
  return (
    <div className="mb-[13px]">
      <button type={typeButton} className="px-[9.75px] py-[4.875px] bg-[#0d6efd] rounded-[3.25px] hover:bg-[#0b5ed7] active:bg-[#0a58ca] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
        <span className="font-[Arial]  text-white text-[13px]">{text}</span>
      </button>
    </div>
  );
}

export default ButtonLayout;