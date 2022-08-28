import { useState, useEffect } from 'react';
import Layout from 'src/components/layout';
import { PencilIcon } from '@heroicons/react/outline';
/*Parte de la tabla */
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Nuevo from './nuevo';
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  Paper,
  IconButton,
  TableHead,
} from '@mui/material';
import { Usuario } from 'src/interfaces/interfaces';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
/* *** */

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}
function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface Props {
  usuarios: Usuario[];
}
export default function indexUsers({ usuarios }: Props) {
  const router = useRouter();
  useEffect(() => {
    console.log('USUARIOS: ', usuarios);
  }, [usuarios]);
  /* Parte de la tabla */
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [usuario, setUsuario] = useState<any>(null);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usuarios.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* *** */

  const [open, setOpen] = React.useState(false);
  const refreshData = () => {
    router.replace(router.asPath);
  };
  return (
    <Layout>
      <div>
        <div>
          <section>
            <header className="bg-gray-900 space-y-4 p-4  sm:py-6 lg:py-4  xl:py-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Usuarios</h1>
                <a
                  className="hover:bg-green-600 group flex items-center rounded-md bg-green-800 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
                  onClick={() => setOpen(true)}
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
                  className="absolute left-3 top-1/2 -mt-2.5 text-gray-900 pointer-events-none group-focus-within:text-green-400"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
                <input
                  className="focus:ring-2 focus:ring-green-400 focus:outline-none appearance-none w-full text-sm leading-6 text-gray-900 placeholder-gray-900 rounded-md py-2 pl-10 ring-1 ring-sand-300 shadow-sm bg-sand-300"
                  type="text"
                  aria-label="Buscar Usuarios"
                  placeholder="Buscar Usuarios..."
                />
              </form>
            </header>

            <TableContainer component={Paper}>
              <Table aria-label="custom pagination table" className="p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
                <TableHead className="bg-green-800">
                  <TableRow>
                    <TableCell className="text-white">id</TableCell>
                    <TableCell className="text-white">Nombre</TableCell>
                    <TableCell className="text-white">Email</TableCell>
                    <TableCell className="text-white">Rol</TableCell>
                    <TableCell className="text-white">Rol desde</TableCell>
                    <TableCell className="text-white">Rol hasta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : usuarios
                  ).map((row) => (
                    <TableRow
                      key={row.id_user}
                      className="bg-gray-900 hover:bg-green-300 ring-1 ring-gray-900 "
                      onClick={() => {
                        setUsuario(row);
                        setOpen(true);
                      }}
                    >
                      <TableCell component="th" scope="row" className="text-sand-300 hover:text-gray-900">
                        {row.id_user}
                      </TableCell>
                      <TableCell className="text-sand-300 hover:text-gray-900">{row.name}</TableCell>
                      <TableCell className="text-sand-300 hover:text-gray-900">{row.email}</TableCell>

                      <TableCell className="text-sand-300 hover:text-gray-900">
                        {row.rol[0].nombre ? row.rol[0].nombre : null}
                      </TableCell>
                      <TableCell className="text-sand-300 hover:text-gray-900">
                        {row.rol[0].valido_desde ? row.rol[0].valido_desde : null}
                      </TableCell>
                      <TableCell className="text-sand-300 hover:text-gray-900">
                        {row.rol[0].valido_hasta ? row.rol[0].valido_hasta : null}
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter className="bg-green-800">
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={6}
                      count={usuarios.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          'aria-label': 'rows per page',
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            {open && (
              <Nuevo open={open} setOpen={setOpen} user={usuario} setUser={setUsuario} refetchUsers={refreshData} />
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('http://localhost:3000/api/usuarios');
  const usuarios = await res.json();
  console.log('USUARIOS: ', usuarios);
  return {
    props: { usuarios },
  };
};
