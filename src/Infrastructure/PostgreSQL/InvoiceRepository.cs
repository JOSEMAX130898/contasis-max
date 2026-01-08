using Application.Contracts.Invoice;
using Dapper;
using Domain;
using Microsoft.Extensions.Logging;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.PostgreSQL
{
    public class InvoiceRepository: InvoiceRepositoryDto
    {
        protected readonly IDbConnection _db;
        private readonly ILogger<InvoiceRepository> _logger;
        public InvoiceRepository(IDbConnection db, ILogger<InvoiceRepository> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<ComprobanteDto> CrearComprobanteAsync(CrearComprobanteRequest datos)
        {
            try
            {
                var itemsLowerCase = datos.Items.Select(i => new
                {
                    descripcion = i.Descripcion,
                    cantidad = i.Cantidad,
                    precioUnitario = i.PrecioUnitario
                }).ToList();

                var jsonItems = JsonSerializer.Serialize(itemsLowerCase);

                using (NpgsqlConnection npgsqlConnection = new NpgsqlConnection(_db.ConnectionString))
                {
                    await npgsqlConnection.OpenAsync();
                    var parameters = new {
                        p_tipo = datos.Tipo,
                        p_serie = datos.Serie,
                        p_ruc_emisor = datos.RucEmisor,
                        p_razon_social_emisor = datos.RazonSocialEmisor,
                        p_ruc_receptor = datos.RucReceptor,
                        p_razon_social_receptor = datos.RazonSocialReceptor,
                        p_items = jsonItems
                    };
                    var json = await npgsqlConnection.QuerySingleOrDefaultAsync<string>(
                        "SELECT * FROM fn_crear_comprobante(@p_tipo, @p_serie,@p_ruc_emisor,@p_razon_social_emisor,@p_ruc_receptor,@p_razon_social_receptor,@p_items)",
                        parameters
                    );
                    var comprobante = JsonSerializer.Deserialize<ComprobanteDto>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                    );
                    return comprobante;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error al crear comprobante");
                throw;
            }
        }

        public async Task<bool> AnularComprobanteAsync(string uuid)
        {
            try
            {
                Guid idComprobante = Guid.Parse(uuid);
                using (var npgsqlConnection = new NpgsqlConnection(_db.ConnectionString))
                {
                    await npgsqlConnection.OpenAsync();

                    // Llamada a la función PL/pgSQL que devuelve boolean
                    var parameters = new { p_id = idComprobante };
                    bool resultado = await npgsqlConnection.QuerySingleAsync<bool>(
                        "SELECT fn_comprobante_anular(@p_id);",
                        parameters
                    );

                    return resultado;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error al anular comprobante");
                throw;
            }
        }


        public async Task<IEnumerable<ComprobanteListDto>> ListarComprobantesAsync(ComprobanteFilter filter)
        {
            try
            {
              
                using (NpgsqlConnection npgsqlConnection = new NpgsqlConnection(_db.ConnectionString))
                {
                    await npgsqlConnection.OpenAsync();
                    var parameters = new
                    {
                        p_fecha_desde = filter.FechaDesde.HasValue ? filter.FechaDesde.Value : (DateTime?)null,
                        p_fecha_hasta = filter.FechaHasta.HasValue ? filter.FechaHasta.Value : (DateTime?)null,
                        p_tipo = filter.Tipo,
                        p_ruc_receptor = filter.RucReceptor,
                        p_estado = filter.Estado,
                        p_page = filter.Page,
                        p_page_size = filter.PageSize
                    };
                    return await npgsqlConnection.QueryAsync<ComprobanteListDto>(
                        "SELECT * FROM fn_comprobante_listar(@p_fecha_desde, @p_fecha_hasta, @p_tipo, @p_ruc_receptor, @p_estado, @p_page, @p_page_size)",
                        parameters
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error al crear comprobante");
                throw;
            }
        }

    }
}
