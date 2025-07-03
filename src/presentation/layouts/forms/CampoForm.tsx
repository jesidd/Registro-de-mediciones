import type { UseFormRegister } from "react-hook-form";

type Props = {
  labelName: string;
  nameInput: "email" | "password";
  labelText: string;
  typeInput?: string;
  register: UseFormRegister<LoginForm>;
  className?: string;
  autoComplete?: "current-password" | "email";
};

type LoginForm = {
  email: string;
  password: string;
};

export default function CampoForm({
  labelName,
  labelText,
  nameInput,
  typeInput,
  register,
  className,
  autoComplete,
}: Props) {
  return (
    <>
      <div className="mb-[13px]">
        <label
          htmlFor={labelName}
          className="mb-[4.875px] italic leading-normal text-[16px] text-[#212529]"
        >
          <span>{labelText}</span>
        </label>
        <input
          type={typeInput || "text"}
          id={labelName}
          className={`w-full px-[9.75px] py-[4.875px] text-[15px] font-normal leading-[1.5] text-[#212529] bg-white border-[#80bdff] rounded-md border outline-none transition duration-150 focus:shadow-[0_0_0_0.2rem_rgba(0,123,255,0.25)] ${className}`}
          {...register(nameInput, { required: `${nameInput} es requerido` })}
          autoComplete={autoComplete} 
        />
      </div>
    </>
  );
}
