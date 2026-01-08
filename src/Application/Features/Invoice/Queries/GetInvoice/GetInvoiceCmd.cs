using Application.Features.Invoice.Command.PostInvoice;
using Application.Features.Responses;
using Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Invoice.Queries.GetInvoice
{
    internal class GetInvoiceCmd
    {
    }

    public class GetInvoiceCmdRequest : ComprobanteFilter, IRequest<BaseResponse<List<GetInvoiceCmdResponse>>>
    {
    }

    public class GetInvoiceCmdResponse
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
}
