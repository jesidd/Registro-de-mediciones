import {
  useFieldArray,
  type Control,
  type UseFormRegister,
} from "react-hook-form";
import { glassTypes, type Glass } from "../../../domain/entities/Glass";
import { Plus, X } from "lucide-react";
import type { Artefact } from "../../../domain/entities/Artefact";
import type { Measurement } from "../../../domain/entities/Measurement";

type formValues = {
  Measurement: Measurement;
  Artefacts: Artefact[];
};

type Props = {
  index: number;
  control: Control<formValues>;
  //watch: UseFormWatch<formValues>;
  register: UseFormRegister<formValues>;
};

export default function ArtefactField({
  index,
  control,
  register,
  //watch,
}: Props) {
  const { fields: glassFields, append: appendGlass, remove: removeGlass } =
    useFieldArray({
      control,
      name: `Artefacts.${index}.vidrios` as const,
    });

  const glassThicknesses = [4, 6, 8, 10, 12, 15, 19];

  return (
    <>
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
              tipo: glassTypes[0] as Glass["tipo"],
              color: "Normal",
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
        {glassFields.map((glass, glassIndex) => {

          return (
            <div key={glass.id} className="bg-white p-3 rounded border">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Vidrio {glassIndex + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeGlass(glassIndex)}
                  className="text-red-600 hover:text-red-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3">
                <div>
                  <label htmlFor="ancho" className="block text-xs font-medium text-gray-600 mb-1">
                    Ancho (cm)
                  </label>
                  <input
                    type="number"
                    id="ancho"
                    key={glass.id}
                    {...register(
                      `Artefacts.${index}.vidrios.${glassIndex}.ancho_cm` as const, {required: "El ancho es requerido", valueAsNumber: true}
                    )}
                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="alto" className="block text-xs font-medium text-gray-600 mb-1">
                    Alto (cm)
                  </label>
                  <input
                    type="number"
                    id="alto"
                    {...register(
                      `Artefacts.${index}.vidrios.${glassIndex}.alto_cm`,{required: " El alto es requerido", valueAsNumber: true}
                    )}
                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="espesor" className="block text-xs font-medium text-gray-600 mb-1">
                    Espesor (mm)
                  </label>
                  <select
                    id="espesor"
                    {...register(
                      `Artefacts.${index}.vidrios.${glassIndex}.espesor`, {valueAsNumber: true}
                    )}
                    className="w-full bg-[#EFEFEF] px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {glassThicknesses.map((thickness) => (
                      <option key={thickness} value={thickness}>
                        {thickness}mm
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="tipo" className="block text-xs font-medium text-gray-600 mb-1">
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    {...register(
                      `Artefacts.${index}.vidrios.${glassIndex}.tipo`
                    )}
                    className="w-full bg-[#EFEFEF] px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {glassTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="color" className="block text-xs font-medium text-gray-600 mb-1">
                    Color
                  </label>
                  <input
                    id="color"
                    type="text"
                    {...register(
                      `Artefacts.${index}.vidrios.${glassIndex}.color`
                    )}
                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="precioM" className="block text-xs font-medium text-gray-600 mb-1">
                    Precio/m²
                  </label>
                  <input
                    id="precioM"
                    type="number"
                    {...register(
                      `Artefacts.${index}.vidrios.${glassIndex}.precioM2`,{required: "El precio es requerido", valueAsNumber:true}
                    )}
                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
