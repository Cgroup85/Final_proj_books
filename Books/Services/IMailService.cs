using Books.Server.BL;

namespace Books.Server.Services
{
    public interface IMailService
    {
        bool SendMail(MailData Mail_Data);

    }
}
