import { useEffect, useState } from 'react';
import Layout from 'src/components/layout';
import { useRouter } from 'next/router';
import { isNilorEmpty } from 'src/helpers';
import { Box, Typography, Tab, styled } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

interface StyledTabProps {
  label: string;
  value: string;
}
const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: 'white',
  '&.Mui-selected': {
    color: '#a3b18a',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

export default function test() {
  const router = useRouter();
  const [proyecto, setProyecto] = useState<any>({});

  const loadTask = async (id: string) => {
    const res = await fetch('http://localhost:3000/api/proyectos/' + id);
    const task = await res.json();
    setProyecto(task);
  };
  useEffect(() => {
    if (typeof router.query.id === 'string') loadTask(router.query.id);
  }, [router.query]);

  /*  useEffect(() => {
    fetch('/api/proyectos')
      .then((res) => res.json())
      .then((data) => {
        setProyecto(data);
      });
  }, []); */

  const thisUserStories = [
    {
      name: 'Story 1',
      state: 'To do',
      projectName: 'Proyecto 1',
    },
    { name: 'Story 2', state: 'Doing', projectName: 'Proyecto 1' },
  ];
  const [value, setValue] = useState('0');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (isNilorEmpty(proyecto)) return <text>No hay nada</text>;
  return (
    <Layout>
      <section className="flex flex-col min-h-full">
        <header className="bg-gray-900 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{proyecto.nombre} </h1>
            <a
              href="/new"
              className="hover:bg-green-400 group flex items-center rounded-md bg-green-600 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
            >
              <svg width="20" height="20" fill="currentColor" className="mr-2" aria-hidden="true">
                <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
              </svg>
              Nuevo
            </a>
          </div>
        </header>

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="bg-gray-900">
            <TabList
              onChange={handleChange}
              aria-label="basic tabs example"
              TabIndicatorProps={{
                style: { background: '#a3b18a' },
              }}
            >
              <StyledTab label="Historias de Usuario" value={'0'} />
              <StyledTab label="Tablero" value={'1'} />
              <StyledTab label="Burndown Chart" value={'2'} />
            </TabList>
          </Box>
          <div className="bg-white p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8  text-sm leading-6 relative flex flex-grow ">
            <TabPanel value={'0'} style={{ flex: 1 }}>
              <ul className=" grid grid-cols-1 gap-4 text-sm ">
                {thisUserStories.map((story) => (
                  <li>
                    <a className="hover:bg-green-600 hover:ring-green-400 hover:shadow-md group rounded-md p-3 bg-green-300 ring-1 ring-slate-200 shadow-sm flex">
                      <div className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                        <div className="flex flex-col text-slate-900 group-hover:text-white">
                          <div>
                            <dt className="sr-only">Title</dt>
                            <dd className=" font-semibold ">{story.name}</dd>
                          </div>
                          <div>
                            <dt className="sr-only">Category</dt>
                            <dd className="">{story.projectName}</dd>
                          </div>
                        </div>
                        <div>
                          <dt className="sr-only">Category</dt>
                          <dd className="">{story.state}</dd>
                        </div>
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
                    Agregar historia
                  </a>
                </li>
              </ul>
            </TabPanel>
            <TabPanel value={'1'}>Item Two</TabPanel>
            <TabPanel value={'2'}>Item Three</TabPanel>{' '}
          </div>
        </TabContext>
      </section>
    </Layout>
  );
}
