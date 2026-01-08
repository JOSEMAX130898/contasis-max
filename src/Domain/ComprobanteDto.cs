using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class ComprobanteDto
    {
        public Guid Id { get; set; }
        public string Tipo { get; set; }
        public string Serie { get; set; }
        public int Numero { get; set; }
        public DateTime FechaEmision { get; set; }

        public string RucEmisor { get; set; }
        public string RazonSocialEmisor { get; set; }
        public string RucReceptor { get; set; }
        public string RazonSocialReceptor { get; set; }

        public decimal SubTotal { get; set; }
        public decimal Igv { get; set; }
        public decimal Total { get; set; }

        public string Estado { get; set; }

        public List<ComprobanteItemDto> Items { get; set; }

    }
    public class ComprobanteItemDto
    {
        public string Descripcion { get; set; }
        public decimal Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }


    public class ComprobanteListDto
    {
        public Guid Id { get; set; }
        public string Tipo { get; set; }
        public string Serie { get; set; }
        public int Numero { get; set; }
        public DateTime FechaEmision { get; set; }
        public string RucEmisor { get; set; }
        public string RazonSocialEmisor { get; set; }
        public string RucReceptor { get; set; }
        public string RazonSocialReceptor { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Igv { get; set; }
        public decimal Total { get; set; }
        public short Estado { get; set; }
        public string EstadoDescripcion { get; set; }
    }

    public class ComprobanteFilter
    {
        public DateTime? FechaDesde { get; set; }
        public DateTime? FechaHasta { get; set; }
        public string? Tipo { get; set; }
        public string? RucReceptor { get; set; }
        public short? Estado { get; set; }
        public int? Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
