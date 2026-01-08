using Application.Contracts.Invoice;
using Application.Features.Invoice.Command.PostInvoice;
using Application.Features.Responses;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Invoice.Queries.GetInvoice
{
    internal class GetInvoiceHandler
    {
    }

    public class GetInvoiceCmdHandler : IRequestHandler<GetInvoiceCmdRequest, BaseResponse<List<GetInvoiceCmdResponse>>>
    {
        private readonly InvoiceRepositoryDto _repository;
        private readonly IMapper _mapper;

        public GetInvoiceCmdHandler(InvoiceRepositoryDto repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<BaseResponse<List<GetInvoiceCmdResponse>>> Handle(GetInvoiceCmdRequest request, CancellationToken cancellationToken)
        {
            var data = await _repository.ListarComprobantesAsync(request);

            if (data == null)
            {
                return new BaseResponse<List<GetInvoiceCmdResponse>>("No se encontró información para (ListarComprobantesAsync)", false);
            }

            var response = new BaseResponse<List<GetInvoiceCmdResponse>>
            {
                Obj = _mapper.Map<List<GetInvoiceCmdResponse>>(data)
            };

            return response;
        }
    }
}
