namespace Books.Server.BL;

public class Login
{
    private string email;
    private string password;
    public Login()
    {
    }

    public string Email { get => email; set => email = value; }
    public string Password { get => password; set => password = value; }
}
