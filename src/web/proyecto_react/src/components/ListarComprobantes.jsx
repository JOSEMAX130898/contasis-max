import { useState, useMemo, useEffect, useRef } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { MenuItem } from '@mui/material'
import { obtenerComprobantes, anularComprobante } from '../services/comprobantesApi'

function ListarComprobantes() {
  const [modalAnular, setModalAnular] = useState({ abierto: false, comprobanteId: null })
  const [comprobantes, setComprobantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [anulando, setAnulando] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0, 
    pageSize: 20,
  })
  const [totalCount, setTotalCount] = useState(0)
  const cargandoRef = useRef(false)
  const [filtros, setFiltros] = useState({
    fechaDesde: null,
    fechaHasta: null,
    tipo: null,
    rucReceptor: null,
    estado: null,
  })

 
  
  const cargarComprobantes = async () => {
   
    if (cargandoRef.current) {
      console.log('⚠️ Ya hay una carga en progreso, ignorando...')
      return
    }
    
    cargandoRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔵 Iniciando carga de comprobantes...')
      const response = await obtenerComprobantes(
        filtros,
        pagination.pageIndex + 1, 
        pagination.pageSize
      )
      
      console.log('🟢 Respuesta completa de la API:', response)
      console.log('🟢 Tipo de respuesta:', typeof response)
      console.log('🟢 response.success:', response?.success)
      console.log('🟢 response.obj:', response?.obj)
      console.log('🟢 Es array response.obj?:', Array.isArray(response?.obj))
   
      let comprobantesData = []
      if (response && response.success && Array.isArray(response.obj)) {
        comprobantesData = response.obj
        console.log('✅ Datos extraídos de response.obj, cantidad:', comprobantesData.length)
      } else if (Array.isArray(response)) {
        comprobantesData = response
        console.log('✅ Datos extraídos directamente del array, cantidad:', comprobantesData.length)
      } else if (response && Array.isArray(response.data)) {
        comprobantesData = response.data
        console.log('✅ Datos extraídos de response.data, cantidad:', comprobantesData.length)
      } else {
        console.warn('⚠️ No se pudo extraer datos de la respuesta. Estructura:', Object.keys(response || {}))
      }
      
      console.log('📊 comprobantesData antes de transformar:', comprobantesData)
      console.log('📊 Primer elemento (si existe):', comprobantesData[0])
      
      // Transformar snake_case a camelCase
      const comprobantesTransformados = comprobantesData.map(item => ({
        ...item,
        fechaEmision: item.fecha_emision || item.fechaEmision,
        rucReceptor: item.ruc_receptor || item.rucReceptor,
        razonSocialReceptor: item.razon_social_receptor || item.razonSocialReceptor,
        estadoDescripcion: item.estado_descripcion || item.estadoDescripcion,
      }))
      
   
 
      setComprobantes(comprobantesTransformados)
      setTotalCount(comprobantesTransformados.length)

    } catch (err) {
      console.error('❌ Error al cargar comprobantes:', err)
      setError(err.message || 'Error al cargar los comprobantes')
      setComprobantes([])
    } finally {

      setLoading(false)
      cargandoRef.current = false
 
    }
  }

  useEffect(() => {
    console.log('🔄 useEffect ejecutado - cargando comprobantes')
    cargarComprobantes()
  }, []) // Solo cargar una vez al montar el componente


  const handleActualizar = () => {
    console.log('🔄 handleActualizar llamado')
    cargarComprobantes() 
  }

  const handleAnularComprobante = async () => {
    if (!modalAnular.comprobanteId) return

    setAnulando(true)
    setError(null)

    try {
      console.log('🔄 Anulando comprobante:', modalAnular.comprobanteId)
      const response = await anularComprobante(modalAnular.comprobanteId)
      console.log('✅ Comprobante anulado exitosamente:', response)
      
      // Cerrar el modal
      setModalAnular({ abierto: false, comprobanteId: null })
      
      // Recargar la lista de comprobantes
      await cargarComprobantes()
    } catch (err) {
      console.error('❌ Error al anular comprobante:', err)
      setError(err.message || 'Error al anular el comprobante')
    } finally {
      setAnulando(false)
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        size: 120,
        Cell: ({ cell }) => (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'serie',
        header: 'Serie',
        size: 100,
      },
      {
        accessorKey: 'numero',
        header: 'Número',
        size: 120,
      },
      {
        accessorKey: 'fechaEmision',
        header: 'Fecha Emisión',
        size: 150,
        Cell: ({ cell }) => {
          const fecha = cell.getValue()
          if (!fecha || fecha === '0001-01-01T00:00:00') return '-'
          try {
            return new Date(fecha).toLocaleDateString('es-ES')
          } catch {
            return fecha
          }
        },
      },
      {
        accessorKey: 'razonSocialReceptor',
        header: 'Receptor',
        size: 200,
        Cell: ({ cell }) => cell.getValue() || '-',
      },
      {
        accessorKey: 'rucReceptor',
        header: 'RUC Receptor',
        size: 130,
        Cell: ({ cell }) => cell.getValue() || '-',
      },
      {
        accessorKey: 'subtotal',
        header: 'Subtotal',
        size: 120,
        Cell: ({ cell }) => (
          <span className="font-semibold">
            S/ {Number(cell.getValue() || 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'igv',
        header: 'IGV',
        size: 120,
        Cell: ({ cell }) => (
          <span className="font-semibold">
            S/ {Number(cell.getValue() || 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        size: 130,
        Cell: ({ cell }) => (
          <span className="font-semibold text-green-600">
            S/ {Number(cell.getValue() || 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'estadoDescripcion',
        header: 'Estado',
        size: 120,
        Cell: ({ cell, row }) => {
          const estado = row.original.estado
          const descripcion = cell.getValue() || `Estado ${estado}`
          const colorClass = estado === 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
              {descripcion}
            </span>
          )
        },
      },
    ],
    []
  )

  console.log('🔄 Render - comprobantes en estado:', comprobantes)
  console.log('🔄 Render - comprobantes.length:', comprobantes.length)
  console.log('🔄 Render - loading:', loading)
  console.log('🔄 Render - totalCount:', totalCount)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Listar Comprobantes</h1>
        <button 
          onClick={handleActualizar}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? 'Cargando...' : '🔄 Actualizar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md w-full">
        <MaterialReactTable
          columns={columns}
          data={comprobantes}
          enableColumnResizing={false}
          enableDensityToggle={false}
          enableHiding={false}
          enableFullScreenToggle={false}
          enableStickyHeader
          enableSorting={true}
          enableColumnFilters={true}
          enableGlobalFilter={true}
          enablePagination={true}
          manualPagination={false}
          rowCount={comprobantes.length}
          state={{
            pagination,
            isLoading: loading,
          }}
          enableRowActions={true}
          positionActionsColumn="last"
          renderRowActionMenuItems={({ row }) => [
            <MenuItem
              key="editar"
              onClick={() => {
                console.log('Editar', row.original.id)
              }}
            >
              Editar
            </MenuItem>,
            <MenuItem
              key="anular"
              onClick={() => {
                setModalAnular({ abierto: true, comprobanteId: row.original.id })
              }}
            >
              Anular
            </MenuItem>,
            <MenuItem
              key="eliminar"
              onClick={() => {
                if (window.confirm('¿Está seguro de que desea eliminar este comprobante?')) {
                  console.log('Eliminar', row.original.id)
                }
              }}
            >
              Eliminar
            </MenuItem>,
          ]}
          initialState={{ 
            density: 'comfortable',
            showGlobalFilter: true,
          }}
          muiTableContainerProps={{
            sx: { maxHeight: '600px', width: '100%', overflow: 'auto' },
          }}
        />
      </div>

      {/* Modal de confirmación para anular */}
      {modalAnular.abierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar Anulación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Está seguro de que desea anular este comprobante?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalAnular({ abierto: false, comprobanteId: null })}
                disabled={anulando}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-semibold rounded-lg transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAnularComprobante}
                disabled={anulando}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200"
              >
                {anulando ? 'Anulando...' : 'Confirmar Anulación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListarComprobantes
