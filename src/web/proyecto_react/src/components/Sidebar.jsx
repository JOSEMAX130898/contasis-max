function Sidebar({ activeView, setActiveView }) {
  const menuItems = [
    { id: 'crear', label: 'CREAR COMPROBANTE' },
    { id: 'listar', label: 'LISTAR COMPROBANTES' },
  ]

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Sistema de Comprobantes</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center px-6 py-4 text-left transition-colors duration-200 ${
              activeView === item.id
                ? 'bg-indigo-600 text-white border-l-4 border-indigo-400'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
   
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
