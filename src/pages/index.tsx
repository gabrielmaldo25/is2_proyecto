export default function index() {
  const projects = [
    {
      name: "Proyecto 1",
      category: "Categoria 1",
      users: [
        {
          avatar:
            "https://lh3.googleusercontent.com/2hDpuTi-0AMKvoZJGd-yKWvK4tKdQr_kLIpB_qSeMau2TNGCNidAosMEvrEXFO9G6tmlFlPQplpwiqirgrIPWnCKMvElaYgI-HiVvXc=w600",
          name: "GG",
        },
        {
          avatar: "https://pbs.twimg.com/media/D6uc2kBX4AAv3xV.jpg",
          name: "HH",
        },
      ],
    },
    { name: "Proyecto 2", category: "Categoria 2" },
  ];
  const thisUserStories = [
    {
      name: "Story 1",
      state: "To do",
      projectName: "Proyecto 1",
    },
    { name: "Story 2", state: "Doing", projectName: "Proyecto 1" },
  ];
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        <section>
          <header className="bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Proyectos</h2>
              <a
                href="/new"
                className="hover:bg-green-400 group flex items-center rounded-md bg-green-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="mr-2"
                  aria-hidden="true"
                >
                  <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                </svg>
                Nuevo
              </a>
            </div>
            <form className="group relative">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-green-500"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                />
              </svg>
              <input
                className="focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                type="text"
                aria-label="Filtrar Proyectos"
                placeholder="Filtrar Proyectos..."
              />
            </form>
          </header>
          <ul className="bg-slate-50 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm leading-6 ">
            <>
              {projects.map((project) => (
                <li>
                  <a
                    /* :href="project.url" */ className="hover:bg-green-500 hover:ring-green-500 hover:shadow-md group rounded-md p-3 bg-slate-200 ring-1 ring-slate-200 shadow-sm flex"
                  >
                    <div className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                      <div>
                        <dt className="sr-only">Title</dt>
                        <dd className="group-hover:text-white font-semibold text-slate-900">
                          {project.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">Category</dt>
                        <dd className="group-hover:text-green-200">
                          {project.category}
                        </dd>
                      </div>

                      <div className="flex col-start-2 row-start-1 row-end-3 sm:mt-4 lg:mt-0 xl:mt-4">
                        <>
                          <dt className="sr-only">Users</dt>
                          {project.users?.map((user) => (
                            <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-1.5">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-6 h-6 rounded-full bg-slate-100 ring-2 ring-white"
                                loading="lazy"
                              />
                            </dd>
                          ))}
                        </>
                      </div>
                    </div>
                  </a>
                </li>
              ))}

              <li className="flex">
                <a
                  href="/new"
                  className="hover:border-green-500 hover:border-solid hover:bg-white hover:text-green-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
                >
                  <svg
                    className="group-hover:text-green-500 mb-1 text-slate-400"
                    width="20"
                    height="20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                  </svg>
                  New project
                </a>
              </li>
            </>
          </ul>
        </section>

        <section>
          <header className="bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">
                Mis Historias de Usuario Asignadas
              </h2>
              
              {/* <a
                href="/new"
                className="hover:bg-green-400 group flex items-center rounded-md bg-green-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="mr-2"
                  aria-hidden="true"
                >
                  <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                </svg>
                Nuevo
              </a> */}
            </div>
          </header>
          <ul className="bg-slate-50 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 gap-4 text-sm leading-6 ">
            <>
              {thisUserStories.map((story) => (
                <li>
                  <a
                    /* :href="project.url" */ className="hover:bg-green-500 hover:ring-green-500 hover:shadow-md group rounded-md p-3 bg-slate-200 ring-1 ring-slate-200 shadow-sm flex"
                  >
                    <div className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                      <div className="flex flex-col"><div>
                        <dt className="sr-only">Title</dt>
                        <dd className="group-hover:text-white font-semibold text-slate-900">
                          {story.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">Category</dt>
                        <dd className="group-hover:text-green-200">
                          {story.projectName}
                        </dd>
                      </div></div>
                      <div>
                        <dt className="sr-only">Category</dt>
                        <dd className="group-hover:text-green-200">
                          {story.state}
                        </dd>
                      </div>
                    </div>
                  </a>
                </li>
              ))}

              <li className="flex">
                <a
                  href="/new"
                  className="hover:border-green-500 hover:border-solid hover:bg-white hover:text-green-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
                >
                  <svg
                    className="group-hover:text-green-500 mb-1 text-slate-400"
                    width="20"
                    height="20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                  </svg>
                  Agregar historia
                </a>
              </li>
            </>
          </ul>
        </section>
      </div>
    </div>
  );
}
