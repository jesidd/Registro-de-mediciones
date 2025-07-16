import { useForm, type SubmitHandler } from "react-hook-form";
import { ClientTypes, type Client } from "../../domain/entities/Client";
import useClient from "../hooks/useClient";
import MySwal from "../../infrastructure/di/Sweetalert2";
import type React from "react";
import { Save, X } from "lucide-react";

interface props {
  setShowNewCustomer: (show: boolean) => void;
  setRefreshClientes: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCustomer?: Client;
  setSelectedCustomer: (customer: null) => void;
  setClientAdded : (customer: Client) => void;
}

export default function AddClient({
  setShowNewCustomer,
  setRefreshClientes,
  selectedCustomer,
  setSelectedCustomer,
  setClientAdded,
}: props) {

  const { createClient, updateClient } = useClient();

  const { register, handleSubmit, reset } = useForm<Client>({
    defaultValues: { gasto: 0 },
    shouldFocusError: true,
  });

  const handleSaveCustomer: SubmitHandler<Client> = async (data) => {
    setShowNewCustomer(false);
    try {
      const newClient = await createClient(data);
      console.log("nuevo cliente", newClient);
      setRefreshClientes((prev) => !prev);
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
        setClientAdded(newClient);
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

      setRefreshClientes((prev) => !prev);
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

  const handleCancel = () => {
    setSelectedCustomer(null);
    setShowNewCustomer(false);
    reset();
  };

  return (
    <>
      {/* New/Edit Customer Modal */}
      <form
        onSubmit={handleSubmit(
          selectedCustomer ? handleUpdateCustomer : handleSaveCustomer
        )}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-60"
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
                  {ClientTypes.map((type) => (
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
    </>
  );
}
