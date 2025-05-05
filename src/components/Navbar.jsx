'use client'; // Añadir esta línea al principio

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook para saber la ruta actual
import { useState, useEffect } from 'react'; // Importar useState y useEffect
import { motion, AnimatePresence } from 'framer-motion'; // Importar motion y AnimatePresence
import { useSession, signIn, signOut } from 'next-auth/react'; // Importar hooks de NextAuth

// Componente reutilizable para los enlaces de navegación
function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={href}
        onClick={onClick}
        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors
          ${isActive
            ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
          md:text-sm md:inline-block md:mt-0`
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession(); // Obtener estado de la sesión
  const isLoading = status === "loading";
  const [scrolled, setScrolled] = useState(false);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    closeMobileMenu(); // Cerrar menú si está abierto
    await signOut({ callbackUrl: '/' }); // Redirigir a home después de cerrar sesión
  };

  const handleSignIn = () => {
    closeMobileMenu();
    signIn(); // Redirige a la página de login por defecto de NextAuth o a la configurada
  };

  return (
    <motion.nav 
      className={`bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo o Título */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" onClick={closeMobileMenu} className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Verb Master
            </Link>
          </motion.div>

          {/* Enlaces Desktop + Auth */}
          <div className="hidden md:flex md:items-center md:ml-6">
            {/* Enlaces de Navegación */}
            <motion.div 
              className="flex items-baseline space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              <NavLink href="/">Home</NavLink>
              <NavLink href="/verbs">Verbs</NavLink>
              <NavLink href="/practice">Practice</NavLink>
              <NavLink href="/flashcards">Flashcards</NavLink>
              {/* Opcional: Mostrar enlace a Progreso si está logueado */}
              {session && <NavLink href="/progress">Progress</NavLink>}
            </motion.div>

            {/* Sección de Autenticación (Desktop) */}
            <motion.div 
              className="ml-4 flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {isLoading ? (
                <span className="text-sm text-gray-500 dark:text-gray-400">Cargando...</span>
              ) : session ? (
                <>
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden lg:inline">
                    {session.user?.email || session.user?.name}
                  </span>
                  <motion.button
                    onClick={handleSignOut}
                    className="px-3 py-1 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Salir
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={handleSignIn}
                  className="px-3 py-1 rounded-md text-sm font-medium text-blue-600 dark:text-blue-300 bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Entrar
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Botón Menú Móvil */}
          <motion.div 
            className="-mr-2 flex md:hidden items-center"
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={toggleMobileMenu}
              className="bg-gray-100 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Menú Móvil Desplegable con Auth */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink href="/" onClick={closeMobileMenu}>Home</NavLink>
              <NavLink href="/verbs" onClick={closeMobileMenu}>Verbs</NavLink>
              <NavLink href="/practice" onClick={closeMobileMenu}>Practice</NavLink>
              <NavLink href="/flashcards" onClick={closeMobileMenu}>Flashcards</NavLink>
              {session && <NavLink href="/progress" onClick={closeMobileMenu}>Progress</NavLink>}
              
              {/* Separador y Auth en móvil */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"></div>
              {isLoading ? (
                 <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Cargando...</div>
              ) : session ? (
                <div className="px-3 py-2 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{session.user?.email || session.user?.name}</p>
                  <motion.button
                    onClick={handleSignOut}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cerrar Sesión
                  </motion.button>
                </div>
              ) : (
                <motion.button 
                  onClick={handleSignIn}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Iniciar Sesión
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 