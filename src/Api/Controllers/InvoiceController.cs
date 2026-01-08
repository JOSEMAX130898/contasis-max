using Application.Features.Invoice.Command.PostInvoice;
using Application.Features.Invoice.Command.PutInvoice;
using Application.Features.Invoice.Queries.GetInvoice;
using Application.Features.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IMediator _mediator;
        public InvoiceController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("GetInvoice")]
        public async Task<ActionResult<BaseResponse<List<GetInvoiceCmdResponse>>>> GetInvoice(GetInvoiceCmdRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPost("PostInvoice")]
        public async Task<ActionResult<BaseResponse<PostComprobanteCmdResponse>>> PostInvoice(PostComprobanteCmdRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPost("PutInvoice")]
        public async Task<ActionResult<BaseResponse<bool>>> PutInvoice(PutInvoiceCmdRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

    }
}
