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

namespace Application.Features.Invoice.Command.PutInvoice
{
    //internal class PutInvoiceHandler
    //{
    //}

    public class PutInvoiceCmdHandler : IRequestHandler<PutInvoiceCmdRequest, BaseResponse<bool>>
    {
        private readonly InvoiceRepositoryDto _repository;
        private readonly IMapper _mapper;

        public PutInvoiceCmdHandler(InvoiceRepositoryDto repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<BaseResponse<bool>> Handle(PutInvoiceCmdRequest request, CancellationToken cancellationToken)
        {
            var result = await _repository.AnularComprobanteAsync(request.Uuid);

            if (!result)
            {
                return new BaseResponse<bool>("No se encontró información para el comprobante", false);
            }

            return new BaseResponse<bool>
            {
                Obj = result
            };
        }
    }
    
}
