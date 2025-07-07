import { Plus, Eye, Edit, Trash2, Phone, Mail, X, Save } from "lucide-react";
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
  const [selectedCustomer, setSelectedCustomer] = useState<Client>({
    id: 0,
    nombre: "",
    apellido: "",
    tipoCliente: "CONSTRUCTORA",
    email: "",
    telefono: "",
    direccion: "",
    gasto: 0,
    compras: []
  });

  const {
    register,
    handleSubmit,
    formState: { errors }, reset
  } = useForm<Client>({defaultValues: {gasto:0},
    shouldFocusError: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await getClients();
        const totalConstructora = await getTotalClientsByType("CONSTRUCTORA");
        const totalVidreria = await getTotalClientsByType("EMPRESA");

        if (clients) {
          setCustomers(clients);
          setCantCustomersType({
            constructora: totalConstructora,
            vidreria: totalVidreria,
          });

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
  }, [getClients, getTotalClientsByType, refreshClientes]);

  const customerTypes: Client["tipoCliente"][] = [
    "CONSTRUCTORA",
    "EMPRESA",
    "CLIENTE_PARTICULAR",
  ];

  const typeColors = {
    CONSTRUCTORA: "bg-blue-100 text-blue-800",
    EMPRESA: "bg-green-100 text-green-800",
    CLIENTE_PARTICULAR: "bg-purple-100 text-purple-800",
  };

  const handleSaveCustomer: SubmitHandler<Client> = async (data) => {
    try{
      const newClient = await createClient(data);
      console.log("nuevo cliente", newClient);
      reset();
      setShowNewCustomer(false);
      setRefreshClientes(!refreshClientes);
    }catch(error){
      console.log(error);
    }
  };

  const handleUpdateCustomer: SubmitHandler<Client> = async (data) => {
    try{
      const modifiedClient = await updateClient({...data, id: selectedCustomer?.id});
      console.log("cliente modificado", modifiedClient);
      reset();
      setShowNewCustomer(false);
      setRefreshClientes(!refreshClientes);
    }catch(error){
      console.log(error);
    }
  };

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await deleteClient(customerId);
      setRefreshClientes(!refreshClientes);
      console.log("Cliente eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const deleteCustomer = (customerId: number) => {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      handleDeleteCustomer(customerId);
    }
  };

  const editCustomer = (customer: Client) => {
    reset();
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

        <CardInfo1 total={"$85,000"} label="Valor Total" icon={IconDolar()} />
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
                            .join("").toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.nombre}
                      </div>
                      <div className="text-xs text-gray-500">{customer.id}</div>
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
                      {customer.compras? customer.compras.length : "0"}
                    </span>{" "}
                    órdenes
                  </div>
                  <div className="font-medium text-gray-900">
                    ${customer.gasto ? customer.gasto.toLocaleString() : "0"}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#e5e7eb]">
                  <div className="text-xs text-gray-500">
                    Última orden: {customer.compras.length? customer.compras.at(-1)?.fechaRegistro : "N/A"}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => editCustomer(customer)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      // onClick={() => deleteCustomer(customer.id)}
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
                              .join("").toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.id}
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
                      {customer.compras? customer.compras.length : "0"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${customer.gasto ? customer.gasto : "0"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.compras.length? customer.compras.at(-1)?.fechaRegistro : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => editCustomer(customer)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
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
        <form onSubmit={handleSubmit(selectedCustomer ? handleUpdateCustomer: handleSaveCustomer)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold">
                  {selectedCustomer ? "Editar Cliente" : "Nuevo Cliente"}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() =>{setShowNewCustomer(false)}}
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

                    {...register("nombre", { required: "El nombre es requerido" })}
                    
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
                    {...register("tipoCliente", { required: "Tipo de cliente es requerido"})}
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
                    {...register("email", { required: "El correo electronico es requerido"} )}
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
                    {...register ("telefono",{ required: "Numero de telefono requerido"})}
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
                  {...register ("direccion", { required: "La direción es requerida"})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  rows={3}
                  placeholder="Dirección completa del cliente"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {setShowNewCustomer(false)}}
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
    </div>
  );
}
