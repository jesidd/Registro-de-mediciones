import { Route, Routes } from "react-router-dom";
import Login from "../../presentation/pages/Login";
import HomeLayaout from "../../presentation/layouts/HomeLayaout";
import Customers from "../../presentation/components/Customers";


const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<HomeLayaout/>} >
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/quotes" element={<div>Cotizaciones</div>} />
        <Route path="/sales" element={<div>Ventas</div>} />
        <Route path="/customers" element={<Customers/>} />
        <Route path="/inventory" element={<div>Inventario</div>} />
        <Route path="/reports" element={<div>Reportes</div>} />
        <Route path="/settings" element={<div>Configuración</div>} />
      </Route>

      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default AppRoute;
