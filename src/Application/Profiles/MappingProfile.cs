using Application.Features.Invoice.Command.PostInvoice;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Application.Features.Invoice.Queries.GetInvoice;

namespace Application.Profiles
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {

            CreateMap<ComprobanteDto, PostComprobanteCmdResponse>().ReverseMap();
            // Mapeo de los items
            CreateMap<ComprobanteItemDto, PostComprobanteItemCmdResponse>();

            CreateMap<ComprobanteListDto, GetInvoiceCmdResponse>();
        }
    }
}
