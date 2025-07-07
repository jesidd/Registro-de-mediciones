const CardInfo1 = ({total, label, icon }:{total: number| string, label:string, icon: React.JSX.Element} ) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-600">
            {label}
          </p>
          <p className="text-lg md:text-2xl font-bold text-gray-900">
            {total}
          </p>
        </div>
        <div className="p-2 md:p-3 bg-blue-50 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CardInfo1;
