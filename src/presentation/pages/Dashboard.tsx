import { DollarSign, FileText, Package, Users } from "lucide-react";
import MetricCard from "../components/MetricCard";
import { useEffect, useState } from "react";
import type { Measurement } from "../../domain/entities/Measurement";
import UseMeasurement from "../hooks/UseMeasurement";
import MySwal from "../../infrastructure/di/Sweetalert2";
import useClient from "../hooks/useClient";
import type { Client } from "../../domain/entities/Client";

function Dashboard() {
  const { getCostoMeasurement, getMeasurements } = UseMeasurement();
  const {getClients}=useClient();
  const [recentOrders, setRecentOrdes] = useState<Measurement[]>();
  const [recentOrdersCosto, setRecentOrdesCosto] = useState<Record<number,number>>();
  const [Clients, setClients] = useState<Client[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {

        const clients = await getClients() ?? undefined;
        setClients(clients);

        const orders = await getMeasurements();
        setRecentOrdes(orders.slice(-4));

        const costos: Record<number, number> = {};
        
        await Promise.all(
            orders.slice(-4)?.map(async (order) => {
            costos[order.id] = await getCostoMeasurement(order.id);
          })
        )
        setRecentOrdesCosto(costos);

      } catch (e) {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salio mal!",
          footer: '<a href="#">Si este error persiste reportalo</a>',
        });
        console.log("Se presento un error al iniciar la vista", e);
      }
    };

    fetchData();
  }, []);


  const statusColors = {
    Completado: "bg-green-100 text-green-800",
    "En Proceso": "bg-yellow-100 text-yellow-800",
    Pendiente: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 pt-16 lg:pt-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Dashboard
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Resumen de actividades y métricas clave
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <MetricCard
          title="Ventas del Mes"
          value="$28,450"
          change="+12.5%"
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          title="Órdenes Activas"
          value="24"
          change="+8.2%"
          trend="up"
          icon={Package}
        />
        <MetricCard
          title="Clientes Activos"
          value="156"
          change="+5.1%"
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="Cotizaciones"
          value="18"
          change="-2.3%"
          trend="down"
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            Órdenes Recientes
          </h3>
          <div className="space-y-2 md:space-y-3">
            {recentOrders?.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xs md:text-sm">
                      V0{order.id}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">
                      {Clients ? Clients?.find((c) => c.id == order.clienteId)?.nombre : ""}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      ${recentOrdersCosto ? recentOrdersCosto[order.id].toLocaleString() : 0}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[order.estadoVenta as keyof typeof statusColors]
                  }`}
                >
                  {order.estadoVenta}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            Tipos de Vidrio Más Vendidos
          </h3>
          <div className="space-y-3 md:space-y-4">
            {[
              { name: "Vidrio Templado", percentage: 45, color: "bg-blue-500" },
              {
                name: "Vidrio Laminado",
                percentage: 30,
                color: "bg-green-500",
              },
              {
                name: "Vidrio Flotado",
                percentage: 20,
                color: "bg-yellow-500",
              },
              {
                name: "Vidrio Reflectivo",
                percentage: 5,
                color: "bg-purple-500",
              },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
