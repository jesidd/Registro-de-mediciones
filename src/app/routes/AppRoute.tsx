import { Route, Routes } from "react-router-dom";
import Login from "../../presentation/pages/Login";


const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default AppRoute;
