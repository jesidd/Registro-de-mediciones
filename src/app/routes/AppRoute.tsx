import { Route, Routes } from "react-router-dom";
import Login from "../../presentation/pages/Login";
import HomeLayaout from "../../presentation/layouts/HomeLayaout";
import Customers from "../../presentation/pages/Customers";
import Sales from "../../presentation/pages/Sales";
import Dashboard from "../../presentation/pages/Dashboard";


const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<HomeLayaout/>} >
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/quotes" element={<div>Proximamente</div>} />
        <Route path="/sales" element={<Sales/>} />
        <Route path="/customers" element={<Customers/>} />
        <Route path="/inventory" element={<div>Proximamente</div>} />
        <Route path="/reports" element={<div>Proximamente</div>} />
        <Route path="/settings" element={<div>Proximamente</div>} />
      </Route>

      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default AppRoute;
