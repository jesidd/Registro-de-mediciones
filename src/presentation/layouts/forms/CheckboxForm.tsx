const CheckboxForm = ({ labelName, labelText, nameInput }:{labelName: string; labelText: string; nameInput: string}) => {
  return (
    <>
      <div className="flex items-center mb-[13px] gap-[6px]">
        <input type="checkbox" name={nameInput} id={labelName} className="checkBoxForm" />
        <label htmlFor={labelName}><span className="leading-normal text-[13px] text-[#212529] font-sans">{labelText}</span></label>
      </div>
    </>
  );
};

export default CheckboxForm;
