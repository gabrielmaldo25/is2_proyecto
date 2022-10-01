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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isNilorEmpty } from 'src/helpers';
import EditIcon from '@mui/icons-material/Edit';

export default function MostrarSprint({ sprint, setSprint, setOpenSprint, historias, setUserStory, setOpenUS }) {
  return (
    <Accordion className="mt-4">
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <div className="flex flex-row gap-4">
          <Typography>
            Sprint {sprint.id_sprint} {!isNilorEmpty(sprint.nombre) ? `: ${sprint.nombre} (${sprint.estado}) ` : null}
          </Typography>
          {sprint.estado !== 'Cerrado' && (
            <EditIcon
              sx={{ color: 'black', '&:hover': { color: 'green' } }}
              onClick={() => {
                setSprint(sprint);
                setOpenSprint(true);
              }}
            />
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {historias.filter((story) => story.id_sprint == sprint.id_sprint).length > 0 ? (
          historias
            .filter((story) => story.id_sprint == sprint.id_sprint)
            .map((story) => (
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
                      <dd className="">
                        {' '}
                        {story.estado} | {story.usuario?.name || 'SIN ASIGNAR'}{' '}
                      </dd>
                    </div>
                  </div>
                </a>
              </li>
            ))
        ) : (
          <div className="text-lg font-bold">Sin historias aún...</div>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
