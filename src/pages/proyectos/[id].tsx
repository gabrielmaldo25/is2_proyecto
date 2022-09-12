import { useEffect, useState } from 'react';
import Layout from 'src/components/layout';
import { useRouter } from 'next/router';
import { isNilorEmpty } from 'src/helpers';
import {
  Box,
  Typography,
  Tab,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NuevoUS from 'src/components/historias/nuevo';
import { UserStory, Sprint } from 'src/interfaces/interfaces';
import { GetServerSideProps } from 'next';
import ABMSprint from 'src/components/abmSprint';
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

interface Props {
  historias: UserStory[];
  sprints: Sprint[];
}

export default function test({ historias, sprints }: Props) {
  console.log('SPRINT', sprints);

  const router = useRouter();
  const [proyecto, setProyecto] = useState<any>({});
  const [openUS, setOpenUS] = useState<any>(false);
  const [userStory, setUserStory] = useState<any>(null);
  const [openSprint, setOpenSprint] = useState<any>(false);
  const [sprint, setSprint] = useState<any>(null);

  /*Del boton nuevo */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  /****/
  const loadProject = async (id: string) => {
    let res = await fetch('http://localhost:3000/api/proyectos/' + id);
    const project = await res.json();
    setProyecto(project);
  };
  useEffect(() => {
    if (typeof router.query.id === 'string') loadProject(router.query.id);
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
  const refetchUStories = () => {
    router.replace(router.asPath);
  };

  if (isNilorEmpty(proyecto)) return <text>No hay nada</text>;
  return (
    <Layout>
      <section className="flex flex-col min-h-full">
        <header className="bg-gray-900 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{proyecto.nombre} </h1>
            <a
              onClick={handleClick}
              className="hover:bg-green-400 group flex items-center rounded-md bg-green-600 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
            >
              <svg width="20" height="20" fill="currentColor" className="mr-2" aria-hidden="true">
                <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
              </svg>
              Nuevo
            </a>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => setOpenUS(true)}>Historia de Usuario</MenuItem>
            <MenuItem onClick={() => setOpenSprint(true)}>Sprint</MenuItem>
          </Menu>
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
              <div>
                {sprints.map((sprint) => (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        Sprint {sprint.id_sprint} {!isNilorEmpty(sprint.nombre) ? `: ${sprint.nombre}` : null}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {historias
                        .filter((story) => story.id_sprint == sprint.id_sprint)
                        .map((story: any) => (
                          <li>
                            <a
                              onClick={() => {
                                setUserStory(story);
                                setOpenUS(true);
                              }}
                              className="hover:bg-green-600 hover:ring-green-400 hover:shadow-md group rounded-md p-1 bg-green-300 ring-1 ring-slate-200 shadow-sm flex"
                            >
                              <div className="grid sm:block lg:grid xl:block items-center">
                                <div className="flex flex-col text-slate-900 group-hover:text-white">
                                  <div>
                                    <dt className="sr-only">Title</dt>
                                    <dd className=" font-semibold ">{story.nombre}</dd>
                                  </div>
                                  <div>
                                    <dt className="sr-only">Category</dt>
                                    <dd className="">{story.descripcion}</dd>
                                  </div>
                                </div>
                                <div>
                                  <dt className="sr-only">Category</dt>
                                  <dd className=""> ESTADO | ASIGNADO A QUIEN </dd>
                                </div>
                              </div>
                            </a>
                          </li>
                        ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
              <div>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
                    <Typography>Backlog</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul className=" grid grid-cols-1 gap-4 text-sm ">
                      {historias
                        .filter((story) => isNilorEmpty(story.id_sprint))
                        .map((story: any) => (
                          <li>
                            <a
                              onClick={() => {
                                setUserStory(story);
                                setOpenUS(true);
                              }}
                              className="hover:bg-green-600 hover:ring-green-400 hover:shadow-md group rounded-md p-1 bg-green-300 ring-1 ring-slate-200 shadow-sm flex"
                            >
                              <div className="grid sm:block lg:grid xl:block items-center">
                                <div className="flex flex-col text-slate-900 group-hover:text-white">
                                  <div>
                                    <dt className="sr-only">Title</dt>
                                    <dd className=" font-semibold ">{story.nombre}</dd>
                                  </div>
                                  <div>
                                    <dt className="sr-only">Category</dt>
                                    <dd className="">{story.descripcion}</dd>
                                  </div>
                                </div>
                                <div>
                                  <dt className="sr-only">Category</dt>
                                  <dd className=""> ESTADO | ASIGNADO A QUIEN </dd>
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
                  </AccordionDetails>
                </Accordion>
              </div>
            </TabPanel>
            <TabPanel value={'1'}>Item Two</TabPanel>
            <TabPanel value={'2'}>Item Three</TabPanel>{' '}
          </div>
        </TabContext>
      </section>
      {openUS && (
        <NuevoUS
          open={openUS}
          setOpen={setOpenUS}
          id_proyecto={router.query.id}
          userStory={userStory}
          setUserStory={setUserStory}
          refetchUStories={refetchUStories}
        />
      )}
      {openSprint && (
        <ABMSprint
          open={openSprint}
          setOpen={setOpenSprint}
          id_backlog={proyecto.id_backlog}
          sprint={sprint}
          setSprint={setSprint}
          refetchSprints={refetchUStories}
        />
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let res = await fetch(`http://localhost:3000/api/historias?id_proyecto=${context.params.id}`);
  const historias = await res.json();
  console.log('HISTORIS: ', historias);
  res = await fetch(`http://localhost:3000/api/sprints?id_proyecto=${context.params.id}`);
  let sprints = await res.json();
  return {
    props: { historias, sprints },
  };
};
