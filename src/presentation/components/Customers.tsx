import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  X,
  Save,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import CardInfo1 from "./CardsInfo";
import {
  BuildingIcon,
  GroupPeopleIcon,
  VidreriaIcon,
  IconDolar,
} from "../../assets/icons/icons";
import type { Client } from "../../domain/entities/Client";
import UseClient from "../hooks/UseClient";
import { useForm, type SubmitHandler } from "react-hook-form";
import MySwal from "../../infrastructure/di/Sweetalert2";
import { typeColors } from "../../domain/entities/User";

interface CantCustomerType {
  [tipo: string]: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Client[]>([]);

  const {
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getTotalClientsByType,
  } = UseClient();

  const [cantCustomersType, setCantCustomersType] = useState<CantCustomerType>({
    constructora: 0,
    vidreria: 0,
  });

  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [refreshClientes, setRefreshClientes] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Client | null>(null);
  const [buttonActive, setButtonActive] = useState(false);

  const { register, handleSubmit, reset } = useForm<Client>({
    defaultValues: { gasto: 0 },
    shouldFocusError: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await getClients();
        const totalConstructora = await getTotalClientsByType("CONSTRUCTORA");
        const totalVidreria = await getTotalClientsByType("EMPRESA");
        const totalAcomulado = clients.reduce(
          (suma, client) => suma + client.gasto,
          0
        );

        if (clients) {
          setCustomers(clients);
          setCantCustomersType({
            constructora: totalConstructora,
            vidreria: totalVidreria,
            totalAcomulado: totalAcomulado,
          });

          setButtonActive(false);

          console.log("Cantidad de clientes por tipo:", {
            constructora: totalConstructora,
            vidreria: totalVidreria,
          });
        } else {
          console.error("No se encontraron clientes");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchData();
  }, [refreshClientes]);

  const customerTypes: Client["tipoCliente"][] = [
    "CONSTRUCTORA",
    "EMPRESA",
    "CLIENTE_PARTICULAR",
  ];

  const handleSaveCustomer: SubmitHandler<Client> = async (data) => {
    setShowNewCustomer(false);
    try {
      const newClient = await createClient(data);
      console.log("nuevo cliente", newClient);
      setRefreshClientes(!refreshClientes);
      reset();

      if (newClient) {
        MySwal.fire({
          title: "Cliente creado con éxito",
          icon: "success",
          draggable: false,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateCustomer: SubmitHandler<Client> = async (data) => {
    setShowNewCustomer(false);

    if (!selectedCustomer) {
      console.error("No hay cliente seleccionado para actualizar.");
      return;
    }
    try {
      const modifiedClient = await updateClient({
        ...data,
        id: selectedCustomer.id,
      });

      setRefreshClientes(!refreshClientes);
      setSelectedCustomer(null);
      reset();

      if (modifiedClient) {
        MySwal.fire({
          title: "Cliente modificado con exito",
          icon: "success",
          draggable: false,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await deleteClient(customerId);
      setRefreshClientes(!refreshClientes);
      setSelectedCustomer(null);
      console.log("Cliente eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const deleteCustomer = (customer: Client) => {
    setButtonActive(true);
    MySwal.fire({
      title: `Estas seguro de eliminar al cliente ${customer.nombre}?`,
      text: "No podras revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleDeleteCustomer(customer.id);
        MySwal.fire({
          title: "Eliminado!",
          text: "El cliente ha sido eliminado.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleCancel = () => {
    setSelectedCustomer(null);
    setShowNewCustomer(false);
    reset();
  };

  const editCustomer = (customer: Client) => {
    setSelectedCustomer(customer);
    setShowNewCustomer(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 pt-16 lg:pt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Gestión de Clientes
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Administra la información de tus clientes
          </p>
        </div>
        <button
          onClick={() => setShowNewCustomer(true)}
          className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <CardInfo1
          total={customers.length}
          label="Total clientes"
          icon={GroupPeopleIcon()}
        />

        <CardInfo1
          total={cantCustomersType.constructora}
          label="Constructoras"
          icon={BuildingIcon()}
        />

        <CardInfo1
          total={cantCustomersType.vidreria}
          label="Empresas"
          icon={VidreriaIcon()}
        />

        <CardInfo1
          total={cantCustomersType.totalAcomulado?.toLocaleString()}
          label="Valor Total"
          icon={IconDolar()}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-3 md:p-4 border-b border-[#e5e7eb]">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Lista de Clientes
          </h3>
        </div>

        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          <div className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <div key={customer.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-xs">
                          {customer.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        CL{customer.id}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      typeColors[
                        customer.tipoCliente as keyof typeof typeColors
                      ]
                    }`}
                  >
                    {customer.tipoCliente}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span>{customer.telefono}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-medium">
                      {customer.compras ? customer.compras.length : "0"}
                    </span>{" "}
                    órdenes
                  </div>
                  <div className="font-medium text-gray-900">
                    ${customer.gasto ? customer.gasto.toLocaleString() : "0"}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#e5e7eb]">
                  <div className="text-xs text-gray-500">
                    Última orden:{" "}
                    {customer.compras.length
                      ? customer.compras.at(-1)?.fechaRegistro
                      : "N/A"}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewingCustomer(customer)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => editCustomer(customer)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      disabled={buttonActive}
                      onClick={() => {
                        deleteCustomer(customer);
                      }}
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
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Órdenes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Compras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {customer.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          CL{customer.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate max-w-xs">
                          {customer.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{customer.telefono}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        typeColors[
                          customer.tipoCliente as keyof typeof typeColors
                        ]
                      }`}
                    >
                      {customer.tipoCliente}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.compras ? customer.compras.length : "0"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${customer.gasto ? customer.gasto.toLocaleString() : "0"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.compras.length
                        ? customer.compras.at(-1)?.fechaRegistro
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewingCustomer(customer)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => editCustomer(customer)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        disabled={buttonActive}
                        onClick={() => deleteCustomer(customer)}
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
      </div>

      {/* New/Edit Customer Modal */}
      {showNewCustomer && (
        <form
          onSubmit={handleSubmit(
            selectedCustomer ? handleUpdateCustomer : handleSaveCustomer
          )}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50"
        >
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold">
                  {selectedCustomer ? "Editar Cliente" : "Nuevo Cliente"}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedCustomer?.nombre || ""}
                    {...register("nombre", {
                      required: "El nombre es requerido",
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Cliente *
                  </label>
                  <select
                    defaultValue={selectedCustomer?.tipoCliente || ""}
                    {...register("tipoCliente", {
                      required: "Tipo de cliente es requerido",
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    {customerTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedCustomer?.email || ""}
                    {...register("email", {
                      required: "El correo electronico es requerido",
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="email@cliente.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    defaultValue={selectedCustomer?.telefono || ""}
                    {...register("telefono", {
                      required: "Numero de telefono requerido",
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="+57 999 123 456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <textarea
                  defaultValue={selectedCustomer?.direccion || ""}
                  {...register("direccion", {
                    required: "La direción es requerida",
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  rows={3}
                  placeholder="Dirección completa del cliente"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    handleCancel();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {selectedCustomer ? "Actualizar" : "Guardar"} Cliente
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Customer Detail Viwer Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold">
                  Detalle del Cliente - CL{viewingCustomer.id}
                </h3>
                <button
                  onClick={() => setViewingCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium text-sm">
                        {viewingCustomer.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    Información Personal
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Nombre:</span>
                      <div className="text-gray-900">
                        {viewingCustomer.nombre}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        ID Cliente:
                      </span>
                      <div className="text-gray-900">
                        CL{viewingCustomer.id}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Tipo:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          typeColors[
                            viewingCustomer.tipoCliente as keyof typeof typeColors
                          ]
                        }`}
                      >
                        {viewingCustomer.tipoCliente}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Información de Contacto
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-600">
                          Email:
                        </span>
                        <div className="text-gray-900">
                          {viewingCustomer.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-600">
                          Teléfono:
                        </span>
                        <div className="text-gray-900">
                          {viewingCustomer.telefono}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-600">
                          Dirección:
                        </span>
                        <div className="text-gray-900">
                          {viewingCustomer.direccion}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase History */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Historial de Compras
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {viewingCustomer.compras.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total de Órdenes
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${viewingCustomer.gasto.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Valor Total Comprado
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      $
                      {viewingCustomer.compras.length > 0
                        ? Math.round(
                            viewingCustomer.gasto /
                              viewingCustomer.compras.length
                          ).toLocaleString()
                        : "0"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Promedio por Orden
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600">
                      Última orden:
                    </span>
                    <span className="text-gray-900">
                      {viewingCustomer.compras.at(-1)?.fechaRegistro}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4">
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => {
                      setViewingCustomer(null);
                      editCustomer(viewingCustomer);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar Cliente</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base flex items-center justify-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Nueva Venta</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
