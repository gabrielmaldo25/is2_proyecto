export default function login() {
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className=" p-6 m-auto bg-white border-t border-green-600 rounded shadow-lg shadow-green-800/50 max-w-sm md:w-full">
        <h1 className="text-3xl font-semibold text-center text-green-700">
          SISTEMA AGIL IS2
        </h1>

        <form className="mt-6">
          <div>
            <label className="block text-sm text-gray-800">Correo</label>
            <input
              type="email"
              className="block w-full px-4 py-2 mt-2 text-green-700 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-4">
            <div>
              <label className="block text-sm text-gray-800">Contraseña</label>
              <input
                type="password"
                className="block w-full px-4 py-2 mt-2 text-green-700 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-6">
              <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-700 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">
                Ingresar
              </button>
            </div>
          </div>
        </form>
        <p className="mt-8 text-xs font-light text-center text-gray-700">
          No tienes cuenta?{" "}
          <a href="#" className="font-medium text-green-600 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
