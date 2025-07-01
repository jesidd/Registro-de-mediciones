import AuthLayout from "../layouts/AuthLayout";
import ButtonLayout from "../layouts/ButtonLayout";
import CampoForm from "../layouts/forms/CampoForm";
import CheckboxForm from "../layouts/forms/CheckboxForm";

export default function Login() {
  return (
    <>
      <AuthLayout>
        <div className="w-full h-full relative px-[2rem] py-[1.5rem]">
          <h1 className="text-[3rem] leading-none tracking-tight font-thin text-[#212529] mb-[1.5rem]">Iniciar sesión</h1>
          
          <form action="">
            <div className="hidden"><p>Tu dirección de correo electronico o contraseña es incorrecto</p></div>
            <div>
              <CampoForm labelName="Email" labelText="Dirección de correo electrónico" nameInput="Email Addres"/>
              <CampoForm labelName="Password" labelText="Contraseña" nameInput="Password" typeInput="Password"/>
              <CheckboxForm labelName="rememberme" labelText="Recordar sesión" nameInput="rememberme"/>
              <ButtonLayout typeButton="submit" text="Iniciar sesión" />
              <a href="#" className="text-[.7em] text-[#0d6efd]"><span>¿Olvidó su contraseña?</span></a>
            </div>
          </form>
        </div>
      </AuthLayout>
    </>
  );
}
