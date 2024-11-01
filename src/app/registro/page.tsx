"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const validateInputs = () => {
    const newErrors = { email: "", password: "", general: "" };
    if (!inputs.email) newErrors.email = "El correo electrónico es requerido.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputs.email))
      newErrors.email = "Por favor, ingresa un correo electrónico válido.";
    if (!inputs.password) newErrors.password = "La contraseña es requerida.";
    else if (inputs.password.length < 6 || inputs.password.length > 20 ) newErrors.password = "La contraseña debe tener entre 6 y 20 caracteres.";
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await fetch("http://localhost:8001/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors((prev) => ({
          ...prev,
          general: errorData.message || "Error de autenticación.",
        }));
      } else {
        localStorage.setItem("token", (await response.json()).token);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        general: "Ocurrió un error. Inténtalo de nuevo.",
      }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col-reverse lg:flex-row">
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
            <p className="mt-2 text-sm text-gray-600">
              Regístrate para acceder a tu cuenta
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={inputs.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
                placeholder="tu@ejemplo.com"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={inputs.password}
                onChange={handleInputChange}
                placeholder="*******"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            {errors.general && (
              <p className="text-red-500 text-sm">{errors.general}</p>
            )}

            <div>
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Registrarse
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/iniciar-sesion"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        <Image
          src="https://cdn-icons-png.flaticon.com/256/7992/7992539.png"
          alt="Register image"
          width={1080}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
