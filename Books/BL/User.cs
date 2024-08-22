using Books.Server.DAL;
using Microsoft.AspNetCore.Mvc;

namespace Books.Server.BL;

public class User
{
    private int id;
    private string userName;
    private string email;
    private string password;
    private bool isAdmin = false;
    private bool isActive = true;

    public User()
    {
    }

    public User(int id, string userName, string email, string password, bool isAdmin, bool isActive)
    {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.isActive = isActive;
    }

    public int Id { get => id; set => id = value; }
    public string UserName { get => userName; set => userName = value; }
    public string Email { get => email; set => email = value; }
    public string Password { get => password; set => password = value; }
    public bool IsAdmin { get => isAdmin; set => isAdmin = value; }
    public bool IsActive { get => isActive; set => isActive = value; }


    public bool registration(User user)
    {
        DBservices db = new DBservices();
        try
        {
            db.Registration(user);
            return true;

        }
        catch
        {
            return false;
        }

    }

    public User login(Login login)
    {
        DBservices db = new DBservices();
        try
        {
            User user = db.Login(login);
            return user;
        }
        catch
        {
            return null;
        }
    }

    public List<User> getAllUsers()
    {
        DBservices db = new DBservices();
        try
        {
            List<User> allUsers = db.GetAllUsers();
            return allUsers;
        }
        catch
        {
            return null;
        }
    }

    public void deleteUserById(int id)
    {
        DBservices db = new DBservices();
        db.DeleteUserById(id);
    }

    public User getUserByEmail(string email)
    {
        DBservices db = new DBservices();
        return db.getUserByEmail(email);

    }

    public bool updateUserHighScore(int id,int score)
    {
        DBservices db = new DBservices();
        bool flag = db.updateUserHighScore(id, score);
        if (flag)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public int getUserHighScore(int id)
    {
        DBservices db = new DBservices();
        return db.getUserHighScore(id);
    }

    public IActionResult updateUserPassword(string email, string password)
    {
        DBservices db = new DBservices();
        try
        {
            db.updateUserPassword(email, password);
            return new OkResult();
        }
        catch
        {
            return new BadRequestResult();
        }
    }

    public List<object> getTopHighScores()
    {
        List<object> scores = new List<object>();
        DBservices db = new DBservices();
        return scores = db.GetTopHighScores();
    }


}
