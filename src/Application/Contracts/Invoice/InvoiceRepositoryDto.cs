using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Invoice
{
    public interface InvoiceRepositoryDto
    {
        Task<ComprobanteDto> CrearComprobanteAsync(CrearComprobanteRequest request);
        Task<bool> AnularComprobanteAsync(string uuid);
        Task<IEnumerable<ComprobanteListDto>> ListarComprobantesAsync(ComprobanteFilter filter);
    }
}
