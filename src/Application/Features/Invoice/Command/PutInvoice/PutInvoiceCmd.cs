using Application.Features.Invoice.Command.PostInvoice;
using Application.Features.Responses;
using Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Invoice.Command.PutInvoice
{
    public class PutInvoiceCmdRequest : IRequest<BaseResponse<bool>>
    {
        public string Uuid { get; set; }

        public PutInvoiceCmdRequest(string uuid)
        {
            Uuid = uuid;
        }
    }
}
