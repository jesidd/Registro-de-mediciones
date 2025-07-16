import { Plus, Eye, Edit, Trash2, Search, Filter, X, Save } from "lucide-react";
import { useEffect, useState } from "react";
import type { Measurement } from "../../domain/entities/Measurement";
import UseMeasurement from "../hooks/UseMeasurement";
import useClient from "../hooks/useClient";
import type { Client } from "../../domain/entities/Client";
import UseArtefact from "../hooks/UseArtefact";
import type { Artefact } from "../../domain/entities/Artefact";
import MySwal from "../../infrastructure/di/Sweetalert2";
import { useFieldArray, useForm } from "react-hook-form";
import type { Glass } from "../../domain/entities/Glass";
import AddClient from "../components/AddClient";

type formValues = {
  Measurement: Measurement;
  Artefacts: Artefact[];
  glass: Glass[];
};

export default function Sales() {
  const { getMeasurements, getCostoMeasurement, deleteMeasurement } =
    UseMeasurement();
  const { getClients } = useClient();
  const { getArtefactByMeasurementID } = UseArtefact();
  const [sales, setSales] = useState<Measurement[]>();
  const [clients, setClients] = useState<Client[]>();
  const [clientUsed, setClientUsed] = useState<Client>();
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [ArtefactViewing, setArtefactViewing] = useState<Artefact[]>();
  const [costos, setCostos] = useState<{ [key: number]: number }>({});
  const [totalCostos, setTotalCostos] = useState(0);
  const [showNewSale, setShowNewSale] = useState(false);
  //const [selectedSale, setSelectedSale] = useState<Measurement | null>(null);
  const [viewingSale, setViewingSale] = useState<Measurement | null>(null);
  const [clientViewing, setClientViewing] = useState<Client>();
  const [refreshPage, setRefreshPage] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  const glassTypes = [
    "Templado",
    "Laminado",
    "Flotado",
    "Reflectivo",
    "Doble Vidriado",
  ];
  const glassColors = ["Transparente", "Bronce", "Gris", "Verde", "Azul"];
  const glassThicknesses = [4, 6, 8, 10, 12, 15, 19];

  const statusColors = {
    Completado: "bg-green-100 text-green-800",
    "En Proceso": "bg-yellow-100 text-yellow-800",
    Cancelado: "bg-red-100 text-red-800",
  };

  const { register, control, handleSubmit, reset } = useForm<formValues>({
    defaultValues: {},
    shouldFocusError: true,
  });

  const {
    fields: artefactFields,
    append: appendArtefact,
    remove: removeArtefact,
  } = useFieldArray({
    control,
    name: "Artefacts",
  });

  const {
    fields: glassFields,
    append: appendGlass,
    remove: removeGlass,
  } = useFieldArray({
    control,
    name: "glass",
  });

  const onSubmit = (data: formValues) => {
    console.log(data);
  };

  const fetchData = async () => {
    try {
      const allSales = await getMeasurements();
      const Costos: Record<number, number> = {};
      const Clientes = await getClients();
      let total = 0;

      setSales(allSales);
      for (const sale of allSales) {
        const costo = (await getCostoMeasurement(sale.id)) || 0;
        Costos[sale.id] = costo;
        total += costo;
      }
      setClients(Clientes);
      setTotalCostos(total);
      setCostos(Costos);
    } catch (e) {
      console.log("error sales", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshPage]);

  const handleShowSale = async (Measurement: Measurement) => {
    const client = clients && clients[Measurement.clienteId];
    const Artefact = await getArtefactByMeasurementID(Measurement.id);
    setClientViewing(client);
    setArtefactViewing(Artefact);
    setViewingSale(Measurement);
  };

  // const addArtifact = () => {};

  // const updateArtifact = (
  //   artifactIndex: number,
  //   field: keyof Artifact,
  //   value: string
  // ) => {};

  const handleDeleteMeasurement = async (Measurement: Measurement) => {
    setButtonActive(true);
    MySwal.fire({
      title: `Estas seguro de eliminar la venta V0${Measurement.id}?`,
      text: "No podras revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await removeMeasaurement(Measurement.id);
        if (res) {
          MySwal.fire({
            title: "Eliminado!",
            text: "La venta ha sido eliminado.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        } else {
          MySwal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salio mal!",
          });
        }
      }
    });
  };

  const removeMeasaurement = async (Measurement_id: number) => {
    try {
      const res = await deleteMeasurement(Measurement_id);
      setRefreshPage((prev) => !prev);
      setButtonActive(false);
      console.log("Venta eliminado con éxito");
      return res;
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
    }
  };

  // const addGlass = (artifactIndex: number) => {};

  // const updateGlass = (
  //   artifactIndex: number,
  //   glassIndex: number,
  //   field: keyof GlassItem,
  //   value: string | number
  // ) => {};

  // const removeGlass = (artifactIndex: number, glassIndex: number) => {};

  // const calculateTotal = () => {
  //   return newSaleForm.artifacts.reduce((total, artifact) => {
  //     return (
  //       total +
  //       artifact.glasses.reduce((artifactTotal, glass) => {
  //         const area = (glass.width * glass.height) / 10000; // Convert cm² to m²
  //         return artifactTotal + area * glass.price * glass.quantity;
  //       }, 0)
  //     );
  //   }, 0);
  // };

  // const handleSaveSale = () => {
  //   setShowNewSale(false);
  // };

  // const deleteSale = (saleId: string) => {};

  // const updateSaleStatus = (saleId: string, newStatus: string) => {};

  const HandledSelectClient = (customer_id: string | number) => {
    if (customer_id === 'new') {
      setShowNewCustomer(true);
    }

    const selectClient= clients?.find((c) => c.id == customer_id);
    setClientUsed(selectClient);
  };

  //agrega el nuevo cliente a la lista de clientes ya precargados sin tener q volver a renderizar
  const HandeldClientAdded = (client:Client)=>{
    setClientUsed(client);
    setClients((prev) => [...(prev ?? []), client]);
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 pt-16 lg:pt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Gestión de Ventas
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Administra mediciones y órdenes de vidrio
          </p>
        </div>
        <button
          onClick={() => setShowNewSale(true)}
          className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          <span>Nueva Venta</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">
                Total Ventas
              </p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {sales ? sales.length : "0"}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-blue-50 rounded-full">
              <svg
                className="h-4 w-4 md:h-6 md:w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">
                En Proceso
              </p>
              <p className="text-lg md:text-2xl font-bold text-yellow-600">
                {sales
                  ? sales.filter((s) => s.estadoVenta === "En Proceso").length
                  : 0}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-yellow-50 rounded-full">
              <svg
                className="h-4 w-4 md:h-6 md:w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">
                Completadas
              </p>
              <p className="text-lg md:text-2xl font-bold text-green-600">
                {sales
                  ? sales.filter((s) => s.estadoVenta === "Completado").length
                  : 0}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-green-50 rounded-full">
              <svg
                className="h-4 w-4 md:h-6 md:w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">
                Valor Total
              </p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                ${totalCostos.toLocaleString()}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-purple-50 rounded-full">
              <svg
                className="h-4 w-4 md:h-6 md:w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-3 md:p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar ventas..."
                className="pl-8 md:pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base w-full sm:w-auto"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {sales?.map((sale) => (
              <div key={sale.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">V0{sale.id}</div>
                    <div className="text-sm text-gray-500">{}</div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[
                        sale.estadoVenta as keyof typeof statusColors
                      ]
                    }`}
                  >
                    {sale.estadoVenta}
                  </span>
                </div>
                <div className="text-sm text-gray-900">{sale.descripcion}</div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {sale.hayMasDeUnPiso} pisos • {"1"} artefactos
                  </div>
                  <div className="font-medium text-gray-900">
                    ${costos[sale.id]?.toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-gray-500">
                    {sale.fechaRegistro}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleShowSale(sale)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      disabled={buttonActive}
                      onClick={() => handleDeleteMeasurement(sale)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pisos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artefactos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales &&
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          V0{sale.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {clients && clients[sale.clienteId]?.nombre}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {sale.descripcion}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sale.fechaRegistro}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${costos[sale.id]?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={sale.estadoVenta}
                        // onChange={(e) =>
                        //   updateSaleStatus(sale.id, e.target.value)
                        // }
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${
                          statusColors[
                            sale.estadoVenta as keyof typeof statusColors
                          ]
                        }`}
                      >
                        <option value="Cancelado">Cancelado</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Completado">Completado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleShowSale(sale)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          disabled={buttonActive}
                          onClick={() => handleDeleteMeasurement(sale)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Sale Detail View Modal */}
        {viewingSale && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-y-auto">
              <div className="p-4 md:p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg md:text-xl font-semibold">
                    Detalle de Venta - V0{viewingSale.id}
                  </h3>
                  <button
                    onClick={() => setViewingSale(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5 md:h-6 md:w-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Sale Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Información del Cliente
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">
                          Cliente:
                        </span>{" "}
                        {clientViewing?.nombre}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Email:
                        </span>{" "}
                        {clientViewing?.email}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Teléfono:
                        </span>{" "}
                        {clientViewing?.telefono}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Detalles del Proyecto
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">
                          Descripción:
                        </span>{" "}
                        {viewingSale.descripcion}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Pisos:
                        </span>{" "}
                        {viewingSale.cantidadPisos
                          ? viewingSale.cantidadPisos
                          : "0"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Fecha:
                        </span>{" "}
                        {viewingSale.fechaRegistro}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Entrega:
                        </span>{" "}
                        {viewingSale?.fechaEntrega}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Estado:
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[
                              viewingSale.estadoVenta as keyof typeof statusColors
                            ]
                          }`}
                        >
                          {viewingSale.estadoVenta}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Artifacts and Glass Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Artefactos y Mediciones
                  </h4>
                  <div className="space-y-4">
                    {ArtefactViewing &&
                      ArtefactViewing.map((artifact) => (
                        <div
                          key={artifact.id}
                          className="border rounded-lg p-4 bg-white"
                        >
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 text-lg">
                              {artifact.nombre}
                            </h5>
                            <p className="text-gray-600 text-sm">{}</p>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Vidrio
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Dimensiones
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Especificaciones
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Cantidad
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Área
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Precio/m²
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {artifact.vidrios.map((glass, glassIndex) => {
                                  const area =
                                    (glass.ancho_cm * glass.alto_cm) / 10000;
                                  return (
                                    <tr
                                      key={glass.id}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-3 py-3">
                                        <div className="font-medium text-gray-900">
                                          Vidrio {glassIndex + 1}
                                        </div>
                                      </td>
                                      <td className="px-3 py-3">
                                        <div className="text-gray-900">
                                          {glass.ancho_cm} × {glass.alto_cm} cm
                                        </div>
                                      </td>
                                      <td className="px-3 py-3">
                                        <div className="text-gray-900">
                                          {glass.tipo} {glass.espesor}mm
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                          {glass.color}
                                        </div>
                                      </td>
                                      <td className="px-3 py-3">
                                        <div className="text-gray-900">{}</div>
                                      </td>
                                      <td className="px-3 py-3">
                                        <div className="text-gray-900">
                                          {area.toFixed(2)} m²
                                        </div>
                                      </td>
                                      <td className="px-3 py-3">
                                        <div className="text-gray-900">
                                          $
                                          {glass.precioM2
                                            ? glass.precioM2.toLocaleString()
                                            : "0"}
                                        </div>
                                      </td>
                                      <td className="px-3 py-3">
                                        <div className="font-medium text-gray-900">
                                          $
                                          {glass.precioM2
                                            ? glass.precioM2.toLocaleString()
                                            : "0"}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div className="mt-3 pt-3 border-t">
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-600">
                                Subtotal Artefacto:{" "}
                              </span>
                              <span className="text-lg font-bold text-gray-900">
                                $0
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Total Summary */}
                <div className="border-t pt-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Resumen Total
                        </h4>
                        <p className="text-sm text-gray-600">
                          {ArtefactViewing?.length ?? 0} artefactos •{" "}
                          {ArtefactViewing
                            ? ArtefactViewing.reduce(
                                (acc, artifact) =>
                                  acc + (artifact.vidrios?.length ?? 0),
                                0
                              )
                            : 0}{" "}
                          vidrios
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${costos[viewingSale.id].toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total del proyecto
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Client */}
        {showNewCustomer && (
          <AddClient setShowNewCustomer={setShowNewCustomer} setRefreshClientes={()=>{}} setSelectedCustomer={()=>{}} setClientAdded={HandeldClientAdded}/>
        )}

        {/* New Sale Modal */}
        {showNewSale && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto">
              <div className="p-4 md:p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg md:text-xl font-semibold">
                    Nueva Venta
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowNewSale(false)}>
                    <X className="h-5 w-5 md:h-6 md:w-6" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={() => onSubmit}
                className="p-4 md:p-6 space-y-4 md:space-y-6"
              >
                {/* Customer Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 md:mb-4">
                      Información del Cliente
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cliente *
                        </label>
                        <select
                          value={clientUsed?.id}
                          onChange={(e)=> HandledSelectClient(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                        >
                          <option value="">Seleccionar cliente</option>
                          <option value="new">+ Agregar nuevo cliente</option>
                          {clients &&
                            clients.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.nombre} - {customer.tipoCliente}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                          placeholder="email@cliente.com"
                          defaultValue={clientUsed?.email}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                          placeholder="+51 999 123 456"
                          defaultValue={clientUsed?.telefono}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 md:mb-4">
                      Detalles del Proyecto
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción *
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                          rows={3}
                          placeholder="Descripción del proyecto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Pisos
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Entrega
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Artifacts Section */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 md:mb-4 space-y-2 sm:space-y-0">
                    <h4 className="font-medium text-gray-900">
                      Artefactos y Mediciones
                    </h4>
                    <button
                      onClick={() => {
                        appendArtefact({
                          id: Date.now(), // or use a better unique id generator
                          nombre: "",
                          descripcion: "",
                          medicionId: 0,
                          vidrios: [
                            {
                              id: Date.now(),
                              ancho_cm: 0,
                              alto_cm: 0,
                              espesor: glassThicknesses[0],
                              tipo: glassTypes[0],
                              color: glassColors[0],
                              cantidad: 1,
                              precioM2: 0,
                              artefactoId: 0,
                            },
                          ],
                        });
                      }}
                      type="button"
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar Artefacto</span>
                    </button>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    {artefactFields.map((artifact, artifactIndex) => (
                      <div
                        key={artifact.id}
                        className="border rounded-lg p-3 md:p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                          <h5 className="font-medium text-gray-900">
                            Artefacto {artifactIndex + 1}
                          </h5>
                          <button
                            type="button"
                            //onClick={() => removeArtifact(artifactIndex)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre del Artefacto
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                              placeholder="Ej: Ventana Principal"
                            />
                          </div>
                          {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Descripción
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                              placeholder="Descripción del artefacto"
                            />
                          </div> */}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-2 sm:space-y-0">
                          <h6 className="font-medium text-gray-800">Vidrios</h6>
                          <button
                            type="button"
                            onClick={() =>
                              appendGlass({
                                id: Date.now(),
                                ancho_cm: 0,
                                alto_cm: 0,
                                espesor: glassThicknesses[0],
                                tipo: glassTypes[0],
                                color: glassColors[0],
                                cantidad: 1,
                                precioM2: 0,
                                artefactoId: 0,
                              })
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Agregar Vidrio</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {glassFields.map((glass, glassIndex) => (
                            <div
                              key={glass.id}
                              className="bg-white p-3 rounded border"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-700">
                                  Vidrio {glassIndex + 1}
                                </span>
                                <button
                                  type="button"
                                  // onClick={() =>
                                  //  removeGlass(artifactIndex, glassIndex)
                                  // }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Ancho (cm)
                                  </label>
                                  <input
                                    type="number"
                                    value={glass.ancho_cm}
                                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Alto (cm)
                                  </label>
                                  <input
                                    type="number"
                                    value={glass.alto_cm}
                                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Espesor (mm)
                                  </label>
                                  <select
                                    value={glass.espesor}
                                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    {glassThicknesses.map((thickness) => (
                                      <option key={thickness} value={thickness}>
                                        {thickness}mm
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Tipo
                                  </label>
                                  <select
                                    value={glass.tipo}
                                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    {glassTypes.map((type) => (
                                      <option key={type} value={type}>
                                        {type}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Color
                                  </label>
                                  <select
                                    value={glass.color}
                                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    {glassColors.map((color) => (
                                      <option key={color} value={color}>
                                        {color}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {/* <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Cantidad
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={glass.cantidad}
                                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </div> */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Precio/m²
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={glass.precioM2}
                                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                              </div>

                              <div className="mt-2 text-xs text-gray-600">
                                Área:{" "}
                                {(
                                  (glass.ancho_cm * glass.alto_cm) /
                                  10000
                                ).toFixed(2)}{" "}
                                m² | Subtotal: $
                                {(
                                  ((glass.ancho_cm * glass.alto_cm) / 10000) *
                                  glass.precioM2 *
                                  glass.cantidad
                                ).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total and Actions */}
                <div className="border-t pt-4 md:pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 space-y-2 sm:space-y-0">
                    <div className="text-lg font-semibold text-gray-900">
                      Total Estimado: ${"0"}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={() => { setShowNewSale(false); reset(); }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                      <Save className="h-4 w-4" />
                      <span>Guardar Venta</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
