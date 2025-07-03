import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/UseAuth";
import AuthLayout from "../layouts/AuthLayout";
import ButtonLayout from "../layouts/ButtonLayout";
import CampoForm from "../layouts/forms/CampoForm";
import CheckboxForm from "../layouts/forms/CheckboxForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from 'axios';
import LoadingCircleSpinner from "../components/LoadingCircleSpinner";


export default function Login() {
  const { login, keepSession } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null >(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },shouldFocusError: true
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true); 
    try {
      await keepSession(rememberMe);
      await login(data.email, data.password);
      navigate("/dashboard"); // Redirigir al dashboard después del login exitoso
    } catch (error) {
      console.error("Error during login:", error);
      const axiosErr = error as AxiosError<{ message?: string }>;
      const status = axiosErr.response?.status;
      const message = axiosErr.response?.data?.message;

      if (status === 401) {
        setError("Correo electronico o contraseña son incorrectos"); // Indica que las credenciales son incorrectas
      } else if (status === 500) {
        setError("Error del servidor. Intenta más tarde.");
      } else if (message) {
        setError(message);
      } else if (axiosErr.code === 'ECONNABORTED') {
        setError("Tiempo de espera agotado. Por favor, inténtalo de nuevo.");
      } else {
        setError("Error desconocido al iniciar sesión.");
      }
    }finally {
      setIsLoading(false); 
    } 
  };

  return (
    <>
      {isLoading && <LoadingCircleSpinner/>}
      <AuthLayout>
        <div className="w-full h-full relative px-[2rem] py-[1.5rem]">
          <h1 className="text-[3rem] leading-none tracking-tight font-thin text-[#212529] mb-[1.5rem]">
            Iniciar sesión
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`${error ? "block" : "hidden"} p-[13px] mb-[1.5rem] bg-[#f8d7da] border-[#f5c2c7] border w-full rounded-[4.875px]`}>
              <span className="text-[#842029] text-[0.8em] md:text-[1em] w-fit">
                {error}
              </span>
            </div>
            <div>
              <CampoForm
                labelName="email"
                labelText="Dirección de correo electrónico"
                nameInput="email"
                register={register}
                className={
                  errors.email
                    ? "border-[#F87171] shadow-[0_0_0_0.2rem_rgba(248,113,113,0.5)] focus:shadow-[0_0_0_0.2rem_rgba(248,113,113,0.5)]"
                    : "focus:border-[#80bdff]"
                }
                autoComplete="email"
              />
              <CampoForm
                labelName="password"
                labelText="Contraseña"
                nameInput="password"
                typeInput="password"
                register={register}
                className={
                  errors.password
                    ? "border-[#F87171] shadow-[0_0_0_0.2rem_rgba(248,113,113,0.5)] focus:shadow-[0_0_0_0.2rem_rgba(248,113,113,0.5)]"
                    : "focus:border-[#80bdff]"
                }
                autoComplete="current-password"
              />
              <CheckboxForm
                onChange={() => {
                  setRememberMe(!rememberMe);
                }}
                labelName="rememberme"
                labelText="Recordar sesión"
                nameInput="rememberme"
              />
              <ButtonLayout typeButton="submit" text="Iniciar sesión" isLoading={isLoading}/>
              <a href="#" className="text-[.7em] md:text-[13px] text-[#0d6efd]">
                <span>¿Olvidó su contraseña?</span>
              </a>
            </div>
          </form>
        </div>
      </AuthLayout>
    </>
  );
}
