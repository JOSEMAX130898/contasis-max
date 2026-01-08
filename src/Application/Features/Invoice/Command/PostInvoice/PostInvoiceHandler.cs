using Application.Contracts.Invoice;
using Application.Features.Responses;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Invoice.Command.PostInvoice
{
    public class PostInvoiceCmdHandler : IRequestHandler<PostComprobanteCmdRequest, BaseResponse<PostComprobanteCmdResponse>>
    {
        private readonly InvoiceRepositoryDto _repository;
        private readonly IMapper _mapper;

        public PostInvoiceCmdHandler(InvoiceRepositoryDto repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<BaseResponse<PostComprobanteCmdResponse>> Handle(PostComprobanteCmdRequest request, CancellationToken cancellationToken)
        {
            var data = await _repository.CrearComprobanteAsync(request);

            if (data == null)
            {
                return new BaseResponse<PostComprobanteCmdResponse>("No se encontró información para (CargaAnioDetalle)", false);
            }

            var response = new BaseResponse<PostComprobanteCmdResponse>
            {
                Obj = _mapper.Map<PostComprobanteCmdResponse>(data)
            };

            return response;
        }
    }
}
