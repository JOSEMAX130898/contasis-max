import { useState, useEffect, useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { crearComprobante } from '../services/comprobantesApi'

function CrearComprobante({ setActiveView }) {
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const [nuevoItem, setNuevoItem] = useState({
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
  })

  const [formData, setFormData] = useState({
    id: '',
    tipo: 'Factura',
    serie: 'F001',
    numero: 1,
    fechaEmision: new Date().toISOString().slice(0, 10),
    rucEmisor: '20123456789',
    razonSocialEmisor: 'Mi Empresa S.A.C.',
    rucReceptor: '',
    razonSocialReceptor: '',
    subTotal: 0,
    igv: 0,
    total: 0,
    estado: 'Emitido',
  })

 
  const calcularTotales = (itemsList) => {
    const subTotal = itemsList.reduce((sum, item) => sum + item.subtotal, 0)
    const igv = subTotal * 0.18
    const total = subTotal + igv
    return { subTotal, igv, total }
  }


  useEffect(() => {
    const { subTotal, igv, total } = calcularTotales(items)
    setFormData(prev => ({
      ...prev,
      subTotal,
      igv,
      total,
    }))
  }, [items])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'descripcion',
        header: 'Descripción',
        size: 300,
      },
      {
        accessorKey: 'cantidad',
        header: 'Cantidad',
        size: 100,
      },
      {
        accessorKey: 'precioUnitario',
        header: 'Precio Unitario',
        size: 150,
        Cell: ({ cell }) => (
          <span>S/ {cell.getValue().toFixed(2)}</span>
        ),
      },
      {
        accessorKey: 'subtotal',
        header: 'Subtotal',
        size: 130,
        Cell: ({ cell }) => (
          <span className="font-semibold">S/ {cell.getValue().toFixed(2)}</span>
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        size: 100,
        Cell: ({ row }) => (
          <button
            onClick={() => eliminarItem(row.original.id)}
            className="text-red-600 hover:text-red-900 font-medium text-sm"
          >
            Eliminar
          </button>
        ),
        enableSorting: false,
      },
    ],
    []
  )

  const agregarItem = () => {
    if (nuevoItem.descripcion && nuevoItem.cantidad > 0 && nuevoItem.precioUnitario > 0) {
      const subtotal = nuevoItem.cantidad * nuevoItem.precioUnitario
      const nuevoItemCompleto = {
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        ...nuevoItem,
        subtotal,
      }
      setItems([...items, nuevoItemCompleto])
      setNuevoItem({
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
      })
      setIsModalOpen(false)
    }
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setNuevoItem({
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
    })
  }

  const eliminarItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleItemChange = (e) => {
    const { name, value } = e.target
    setNuevoItem(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'precioUnitario' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleAnular = () => {
    if (window.confirm('¿Está seguro de que desea anular este comprobante?')) {
      setFormData(prev => ({
        ...prev,
        estado: 'Anulado',
      }))
      // Aquí iría la lógica para anular el comprobante en la API
      console.log('Comprobante anulado')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      
      // Actualizar serie automáticamente según el tipo
      if (name === 'tipo') {
        if (value === 'Factura') {
          newData.serie = 'F001'
        } else if (value === 'Boleta') {
          newData.serie = 'B001'
        } else if (value === 'Recibo') {
          newData.serie = 'R001'
        }
      }
      
      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validaciones básicas
    if (!formData.rucReceptor || !formData.razonSocialReceptor) {
      setError('Por favor complete los datos del receptor')
      return
    }

    // Validar que el RUC receptor tenga máximo 11 dígitos
    if (formData.rucReceptor.length > 11) {
      setError('El RUC receptor debe tener máximo 11 dígitos')
      return
    }

    if (items.length === 0) {
      setError('Debe agregar al menos un item al comprobante')
      return
    }

    // Formatear los items para la API (solo descripcion, cantidad, precioUnitario)
    const itemsFormateados = items.map(item => ({
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
    }))

    // Preparar los datos según el formato de la API
    const datosParaAPI = {
      tipo: formData.tipo,
      serie: formData.serie,
      rucEmisor: formData.rucEmisor,
      razonSocialEmisor: formData.razonSocialEmisor,
      rucReceptor: formData.rucReceptor,
      razonSocialReceptor: formData.razonSocialReceptor,
      items: itemsFormateados,
    }

    setLoading(true)

    try {
      const data = await crearComprobante(datosParaAPI)
      console.log('Comprobante guardado exitosamente:', data)
      setSuccess(true)
      
 
      setFormData(prev => ({
        ...prev,
        rucReceptor: '',
        razonSocialReceptor: '',
      }))
      setItems([])
      

      setTimeout(() => {
        if (setActiveView) {
          setActiveView('listar')
        }
      }, 1000) 
      
    } catch (err) {
      console.error('Error al guardar el comprobante:', err)
      setError(err.message || 'Error al guardar el comprobante. Por favor intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Crear Comprobante</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Izquierda - Tabla de Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Items del Comprobante</h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
            >
              + Agregar Item
            </button>
          </div>

          {/* Tabla de items */}
          <MaterialReactTable
            columns={columns}
            data={items}
            enableColumnActions={false}
            enableColumnFilters={false}
            enableSorting={false}
            enableBottomToolbar={false}
            enableTopToolbar={false}
            enablePagination={false}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            enableColumnResizing={false}
            enableHiding={false}
            enableFullScreenToggle={false}
            muiTableContainerProps={{
              sx: { maxHeight: '400px' },
            }}
          />
        </div>

        {/* Columna Derecha */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos del Comprobante</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mensajes de éxito y error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="font-medium">¡Éxito!</p>
                <p className="text-sm">El comprobante se ha guardado correctamente.</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Factura">Factura</option>
                  <option value="Boleta">Boleta</option>
                  <option value="Recibo">Recibo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serie
                </label>
                <input
                  type="text"
                  name="serie"
                  value={formData.serie}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="hidden">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número
                </label>
                <input
                  type="number"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Emisión
                </label>
                <input
                  type="date"
                  name="fechaEmision"
                  value={formData.fechaEmision}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Datos del Emisor */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos del Emisor</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RUC Emisor
                      </label>
                      <input
                        type="text"
                        name="rucEmisor"
                        value={formData.rucEmisor}
                        onChange={handleInputChange}
                        disabled
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Razón Social Emisor
                      </label>
                      <input
                        type="text"
                        name="razonSocialEmisor"
                        value={formData.razonSocialEmisor}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Datos del Receptor */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos del Receptor</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RUC Receptor
                      </label>
                      <input
                        type="text"
                        name="rucReceptor"
                        value={formData.rucReceptor}
                        onChange={(e) => {
                          const value = e.target.value
                        
                          if (value === '' || (/^\d+$/.test(value) && value.length <= 11)) {
                            handleInputChange(e)
                          }
                        }}
                        maxLength={11}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                       
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Razón Social Receptor
                      </label>
                      <input
                        type="text"
                        name="razonSocialReceptor"
                        value={formData.razonSocialReceptor}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Totales</h3>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-semibold">S/ {formData.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">IGV (18%):</span>
                  <span className="text-sm font-semibold">S/ {formData.igv.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-base font-semibold text-gray-800">Total:</span>
                  <span className="text-base font-bold text-indigo-600">S/ {formData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="hidden">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Emitido">Emitido</option>
                <option value="Anulado">Anulado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={formData.estado === 'Anulado' || loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? 'Guardando...' : 'Guardar Comprobante'}
              </button>
              <button
                type="button"
                onClick={handleAnular}
                disabled={formData.estado === 'Anulado'}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                {formData.estado === 'Anulado' ? 'Anulado' : 'Anular Comprobante'}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal para agregar item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Agregar Item</h3>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  name="descripcion"
                  value={nuevoItem.descripcion}
                  onChange={handleItemChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Descripción del item"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    name="cantidad"
                    value={nuevoItem.cantidad}
                    onChange={handleItemChange}
                    min="1"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Unitario
                  </label>
                  <input
                    type="number"
                    name="precioUnitario"
                    value={nuevoItem.precioUnitario}
                    onChange={handleItemChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={agregarItem}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrearComprobante
