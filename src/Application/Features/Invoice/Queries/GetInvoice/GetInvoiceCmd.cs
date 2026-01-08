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
        public Guid id { get; set; }
        public string tipo { get; set; }
        public string serie { get; set; }
        public int numero { get; set; }
        public DateTime fecha_emision { get; set; }
        public string ruc_emisor { get; set; }
        public string razon_social_emisor { get; set; }
        public string ruc_receptor { get; set; }
        public string razon_social_receptor { get; set; }
        public decimal subtotal { get; set; }
        public decimal igv { get; set; }
        public decimal total { get; set; }
        public short estado { get; set; }
        public string estado_descripcion { get; set; }
    }
}
