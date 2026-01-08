using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Responses
{
    public class BaseResponse<T>
    {
        public BaseResponse()
        {
            Success = true;
            Message = "OK";
        }
        public BaseResponse(string message)
        {
            Success = true;
            Message = message;
        }

        public BaseResponse(string message, bool success)
        {
            Success = success;
            Message = message;
        }


        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        //public List<string>? ValidationErrors { get; set; }
        public T Obj { get; set; }
    }
}
