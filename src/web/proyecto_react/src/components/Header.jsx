import { useState, useRef, useEffect } from 'react'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  
  const usuario = {
    nombre: 'Mi Empresa SAC',
    ruc: '20123456789',
    email: 'juan.perez@empresa.com',
  }

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
      
        </div>
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800">{usuario.nombre}</span>
              <span className="text-xs text-gray-500">RUC: {usuario.ruc}</span>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isMenuOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">{usuario.nombre}</p>
                <p className="text-xs text-gray-500 mt-1">{usuario.email}</p>
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-medium">RUC:</span> {usuario.ruc}
                </p>
              </div>
              
              <div className="py-2">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Mi Perfil
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Configuración
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Reportes
                </button>
              </div>
              
              <div className="border-t border-gray-200 py-2">
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
