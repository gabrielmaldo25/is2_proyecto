import { useEffect, useState } from 'react';
import Layout from 'src/components/layout';
import Nuevo from './nuevo';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import InitialIcon from 'src/components/iniciales';

export default function test() {
  const [proyectos, setProyectos] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState<any>(null);
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    fetch('/api/proyectos')
      .then((res) => res.json())
      .then((data) => {
        setProyectos(data);
      });
  }, []);

  return (
    <Layout>
      <div>
        <div>
          <section>
            <header className="bg-gray-900 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Proyectos</h1>
                <a
                  onClick={() => setOpen(true)}
                  className="hover:bg-green-400 group flex items-center rounded-md bg-green-600 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
                >
                  <svg width="20" height="20" fill="currentColor" className="mr-2" aria-hidden="true">
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
                  className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-green-400"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
                <input
                  className="bg-white focus:ring-2 focus:ring-green-600 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                  type="text"
                  aria-label="Filtrar Proyectos"
                  placeholder="Filtrar Proyectos..."
                />
              </form>
            </header>
            <ul className="bg-white p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm leading-6 ">
              <>
                {proyectos.map((project: any) => (
                  <li>
                    <a className="hover:bg-green-400 hover:ring-1 hover:ring-white hover:shadow-md group rounded-md p-3 bg-green-300  shadow-sm flex flex-row justify-between">
                      <div
                        onClick={() => router.push(`/proyectos/${project.id_proyecto}`)}
                        className="flex flex-1  flex-col"
                      >
                        <div>
                          <dt className="sr-only">Nombre</dt>
                          <dd className="group-hover:text-white font-semibold text-slate-900">{project.nombre}</dd>
                          <dt className="sr-only">Descripcion</dt>
                          <dd className="group-hover:text-white text-gray-900">{project.descripcion}</dd>
                          <div className="flex row-start-1 row-end-3 sm:mt-4 lg:mt-0 xl:mt-4">
                            <>
                              <dt className="sr-only">Users</dt>
                              {[
                                {
                                  avatar:
                                    'https://lh3.googleusercontent.com/2hDpuTi-0AMKvoZJGd-yKWvK4tKdQr_kLIpB_qSeMau2TNGCNidAosMEvrEXFO9G6tmlFlPQplpwiqirgrIPWnCKMvElaYgI-HiVvXc=w600',
                                  name: 'GG',
                                },
                                {
                                  avatar: 'https://pbs.twimg.com/media/D6uc2kBX4AAv3xV.jpg',
                                  name: 'HH',
                                },
                              ].map((user) => (
                                <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-1.5">
                                  <InitialIcon initials={user.name} />
                                </dd>
                              ))}
                            </>
                          </div>
                        </div>
                      </div>
                      <div>
                        <EditIcon
                          sx={{ color: 'white', '&:hover': { color: 'black' } }}
                          onClick={() => {
                            setProject(project);
                            setOpen(true);
                          }}
                        />
                      </div>
                    </a>
                  </li>
                ))}

                <li className="flex">
                  <a
                    href="/new"
                    className="hover:border-green-600 hover:border-solid hover:bg-white hover:text-green-600 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
                  >
                    <svg
                      className="group-hover:text-green-600 mb-1 text-slate-400"
                      width="20"
                      height="20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                    </svg>
                    Nuevo Proyecto
                  </a>
                </li>
              </>
            </ul>
          </section>
          {open && (
            <Nuevo
              open={open}
              setOpen={setOpen}
              project={project}
              setProject={setProject}
              refetchProjects={refreshData}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
