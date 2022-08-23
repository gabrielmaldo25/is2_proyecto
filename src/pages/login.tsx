import { useState } from "react";
import useUser from "../../lib/useUser";
import { userServiceFactory } from "../../clientServices/userService";
import fetchJson, { FetchError } from "./../../lib/fetchJson";
const userService = userServiceFactory();

export default function login() {
  const { user, mutateUser } = useUser({
    redirectTo: "/",
    redirectIfFound: true,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const body = {
      email: email,
      password: password,
    };
    try {
      mutateUser(
        await fetchJson("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      );
    } catch (error) {
      if (error instanceof FetchError) {
        alert(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  };

  const emailHandler = (e: any) => {
    setEmail(e.target.value);
  };

  const passwordHandler = (e: any) => {
    setPassword(e.target.value);
  };
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className=" p-6 m-auto bg-white border-t border-teal-600 rounded shadow-lg shadow-teal-800/50 max-w-sm md:w-full">
        <h1 className="text-3xl font-semibold text-center text-teal-700">
          SISTEMA AGIL IS2
        </h1>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-800">Correo</label>
            <input
              type="email"
              className="block w-full px-4 py-2 mt-2 text-teal-700 bg-white border rounded-md focus:border-teal-400 focus:ring-teal-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={emailHandler}
            />
          </div>
          <div className="mt-4">
            <div>
              <label className="block text-sm text-gray-800">Contraseña</label>
              <input
                type="password"
                className="block w-full px-4 py-2 mt-2 text-teal-700 bg-white border rounded-md focus:border-teal-400 focus:ring-teal-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={passwordHandler}
              />
            </div>
            <div className="mt-6">
              <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-teal-700 rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600">
                Ingresar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
