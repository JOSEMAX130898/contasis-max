using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class CrearComprobanteRequest
    {
        public string Tipo { get; set; }
        public string Serie { get; set; }

        public string RucEmisor { get; set; }
        public string RazonSocialEmisor { get; set; }

        public string RucReceptor { get; set; }
        public string RazonSocialReceptor { get; set; }

        public List<ComprobanteItemDto> Items { get; set; }
    }
}
