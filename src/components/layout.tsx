import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { userServiceFactory } from '../../clientServices/userService';
import useUser from '../../lib/useUser';
import { useRouter } from 'next/router';
import fetchJson from 'lib/fetchJson';
import Menu2 from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import InitialIcon from 'src/components/iniciales';
import { acronimo } from 'src/helpers';

export default function Layout({ children }: any) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [openMob, setOpenMob] = React.useState(true);

  const handleClickMob = () => {
    setOpenMob(!openMob);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const userService = userServiceFactory();
  const { user, mutateUser } = useUser({
    redirectTo: '/login',
    redirectIfFound: false,
  });

  useEffect(() => {});

  const onLogout = async (e: any) => {
    e.preventDefault();
    try {
      mutateUser(await fetchJson('/api/logout', { method: 'POST' }), false);
    } catch (error: any) {
      alert(error.response.data.error);
    }
    router.push('/login');
  };

  const navigation = [
    { name: 'Proyectos', href: '/proyectos', current: true },
    { name: 'Usuarios', href: '/usuarios', current: false },
    { name: 'Seguridad', href: '#', current: false },
  ];
  const userNavigation = [{ name: 'Salir', href: '/api/login', onClick: onLogout }];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Disclosure as="nav" className="bg-green-800">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="hidden md:block">
                      <div className=" flex items-baseline space-x-4">
                          <a
                            key={navigation[0].name}
                            href={navigation[0].href}
                            className={classNames(
                              navigation[0].href.toLowerCase() == router.pathname
                                ? 'bg-green-600 text-white'
                                : ' hover:bg-green-400 text-white',
                              'px-3 py-2 rounded-md text-sm font-medium',
                            )}
                          >
                            {navigation[0].name}
                          </a>
                          <a
                            key={navigation[1].name}
                            href={navigation[1].href}
                            className={classNames(
                              navigation[1].href.toLowerCase() == router.pathname
                                ? 'bg-green-600 text-white'
                                : ' hover:bg-green-400 text-white',
                              'px-3 py-2 rounded-md text-sm font-medium',
                            )}
                          >
                            {navigation[1].name}
                          </a>
                          <a
                            key={'seguridad'}
                            className={classNames(
                              ' hover:bg-green-400 text-white',
                              'px-3 py-2 rounded-md text-sm font-medium',
                            )}
                            onClick={handleClick}
                          >
                            Seguridad
                          </a>
                        <Menu2
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={openMenu}
                          onClose={handleClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              router.push('/permisos');
                              handleClose();
                            }}
                          >
                            Permisos
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              router.push('/roles');
                              handleClose();
                            }}
                          >
                            Roles
                          </MenuItem>
                        </Menu2>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs bg-green-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <InitialIcon initials={acronimo(user?.name)} />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    onClick={item.onClick ? item.onClick : undefined}
                                    className={classNames(
                                      active ? 'bg-sand-300' : '',
                                      'block px-4 py-2 text-sm text-green-400',
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-green-800 inline-flex items-center justify-center p-2 rounded-md text-green-400 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {/* {user?.proyectos ? ( */}
                    <Disclosure.Button
                      key={navigation[0].name}
                      as="a"
                      href={navigation[0].href}
                      className={classNames(
                        navigation[0].href.toLowerCase() == router.pathname
                          ? 'bg-green-800 text-white'
                          : 'hover:bg-green-600 text-white',
                        'block px-3 py-2 rounded-md text-base font-medium',
                      )}
                    >
                      {navigation[0].name}
                    </Disclosure.Button>
                  {/* ) : null} */}
                  {/* {user?.usuarios ? ( */}
                    <Disclosure.Button
                      key={navigation[1].name}
                      as="a"
                      href={navigation[1].href}
                      className={classNames(
                        navigation[1].href.toLowerCase() == router.pathname
                          ? 'bg-green-800 text-white'
                          : 'hover:bg-green-600 text-white',
                        'block px-3 py-2 rounded-md text-base font-medium',
                      )}
                    >
                      {navigation[1].name}
                    </Disclosure.Button>
                  {/* ) : null} */}
                  {/* {user?.seguridad ? ( */}
                    <List>
                      <ListItemButton onClick={() => handleClickMob()}>
                        <ListItemText className={classNames('bg-green-800 text-white')} primary="Seguridad" />
                        {openMob ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={openMob} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemText
                              onClick={() => {
                                router.push('/permisos');
                                handleClose();
                              }}
                              className={classNames('bg-green-800 text-white')}
                              primary="Permisos"
                            />
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemText className={classNames('bg-green-800 text-white')} primary="Roles" />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </List>
                  {/* ) : null} */}
                </div>
                <div className="pt-4 pb-3 border-t border-green-600">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <InitialIcon initials={acronimo(user?.name)} />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{user?.name}</div>
                      <div className="text-xs font-medium leading-none text-sand-300">{user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        onClick={item.onClick ? item.onClick : undefined}
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-600"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <div className="bg-black flex-1">
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-black flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
