using Application.Features.Responses;
using Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Invoice.Command.PostInvoice
{



    public class PostComprobanteCmdRequest : CrearComprobanteRequest, IRequest<BaseResponse<PostComprobanteCmdResponse>>
    {
    }

    public class PostComprobanteCmdResponse
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
        public List<PostComprobanteItemCmdResponse> Items { get; set; }
    }
    public class PostComprobanteItemCmdResponse
    {
        public string Descripcion { get; set; }
        public decimal Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }

}
