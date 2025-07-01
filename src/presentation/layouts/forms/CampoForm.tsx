export default function CampoForm({
  labelName,
  labelText,
  nameInput,
  typeInput,
}: {
  labelName: string;
  nameInput: string;
  labelText: string;
  typeInput?: string;
}) {
  return (
    <>
      <div className="mb-[13px]">
        <label
          htmlFor={labelName}
          className="mb-[4.875px] italic leading-normal text-[13px] text-[#212529]"
        >
          <span>{labelText}</span>
        </label>
        <input
          type={typeInput || "text"}
          id={labelName}
          name={nameInput}
          className="inputCampoForm"
        />
      </div>
    </>
  );
}
