const API_BASE_URL = 'https://5a4378b8bf59.ngrok-free.app/api/invoice'

/**
 * Obtiene la lista de comprobantes con filtros y paginación
 * @param {Object} filtros - Objeto con los filtros de búsqueda
 * @param {string|null} filtros.fechaDesde - Fecha desde (formato: YYYY-MM-DD)
 * @param {string|null} filtros.fechaHasta - Fecha hasta (formato: YYYY-MM-DD)
 * @param {string|null} filtros.tipo - Tipo de comprobante (Factura, Boleta, Recibo)
 * @param {string|null} filtros.rucReceptor - RUC del receptor
 * @param {string|null} filtros.estado - Estado del comprobante
 * @param {number} page - Número de página (por defecto 1)
 * @param {number} pageSize - Tamaño de página (por defecto 20)
 * @returns {Promise<Object>} Respuesta de la API con los comprobantes
 */
export const obtenerComprobantes = async (filtros = {}, page = 1, pageSize = 20) => {
  try {
    const requestBody = {
    //   fechaDesde: filtros.fechaDesde || null,
    //   fechaHasta: filtros.fechaHasta || null,
    //   tipo: filtros.tipo || null,
    //   rucReceptor: filtros.rucReceptor || null,
    //   estado: filtros.estado || null,
      page,
      pageSize,
    }

    const response = await fetch(`${API_BASE_URL}/GetInvoice`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error('Error al obtener comprobantes:', error)
    throw error
  }
}

/**
 * Crea un nuevo comprobante
 * @param {Object} datosComprobante - Datos del comprobante a crear
 * @param {string} datosComprobante.tipo - Tipo de comprobante (Factura, Boleta, Recibo)
 * @param {string} datosComprobante.serie - Serie del comprobante
 * @param {string} datosComprobante.rucEmisor - RUC del emisor
 * @param {string} datosComprobante.razonSocialEmisor - Razón social del emisor
 * @param {string} datosComprobante.rucReceptor - RUC del receptor
 * @param {string} datosComprobante.razonSocialReceptor - Razón social del receptor
 * @param {Array} datosComprobante.items - Array de items del comprobante
 * @returns {Promise<Object>} Respuesta de la API
 */
export const crearComprobante = async (datosComprobante) => {
  try {
    const response = await fetch(`${API_BASE_URL}/PostInvoice`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
      },
      body: JSON.stringify(datosComprobante),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error('Error al crear comprobante:', error)
    throw error
  }
}

/**
 * Anula un comprobante por su UUID
 * @param {string} uuid - UUID del comprobante a anular
 * @returns {Promise<Object>} Respuesta de la API
 */
export const anularComprobante = async (uuid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/PutInvoice`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ uuid }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error('Error al anular comprobante:', error)
    throw error
  }
}