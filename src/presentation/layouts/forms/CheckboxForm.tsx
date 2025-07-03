type Props = {
  labelName: string;
  labelText: string;
  nameInput: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CheckboxForm = ({ labelName, labelText, nameInput, onChange }:Props) => {
  return (
    <>
      <div className="flex items-center mb-[13px] gap-[6px]">
        <input type="checkbox" name={nameInput} id={labelName} className="checkBoxForm" onChange={onChange} />
        <label htmlFor={labelName}><span className="leading-normal text-[13px] text-[#212529] font-[inherit]">{labelText}</span></label>
      </div>
    </>
  );
};

export default CheckboxForm;
