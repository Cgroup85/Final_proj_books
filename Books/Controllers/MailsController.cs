using Books.Server.BL;
using Books.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Books.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailsController : ControllerBase
    {
        private readonly IMailService Mail_Service;
        public MailsController(IMailService _MailService)
        {
            Mail_Service = _MailService;
        }
        [HttpPost]
        public bool SendMail(MailData Mail_Data)
        {
            return Mail_Service.SendMail(Mail_Data);
        }
    }
}
