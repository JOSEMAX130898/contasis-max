import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CrearComprobante from './components/CrearComprobante'
import ListarComprobantes from './components/ListarComprobantes'

function App() {
  const [activeView, setActiveView] = useState('crear')

  const renderContent = () => {
    switch (activeView) {
      case 'crear':
        return <CrearComprobante setActiveView={setActiveView} />
      case 'listar':
        return <ListarComprobantes />
      default:
        return <CrearComprobante setActiveView={setActiveView} />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
