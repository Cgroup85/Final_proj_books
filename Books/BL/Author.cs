using static System.Reflection.Metadata.BlobBuilder;
using Books.Server.DAL;

namespace Books.Server.BL
{
    public class Author
    {
        int id;
        string name;
        string birthDate;
        string deathDate;
        string topWork;
        string description;
        string image;
        public Author()
        {
        }

        public Author(int id, string name, string birthDate, string deathDate, string topWork, string description, string image)
        {
            Id = id;
            Name = name;
            BirthDate = birthDate;
            DeathDate = deathDate;
            TopWork = topWork;
            Description = description;
            Image = image;
        }

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string BirthDate { get => birthDate; set => birthDate = value; }
        public string DeathDate { get => deathDate; set => deathDate = value; }
        public string TopWork { get => topWork; set => topWork = value; }
        public string Description { get => description; set => description = value; }
        public string Image { get => image; set => image = value; }



        public bool insertAllAuthors(Author author)
        {
            DBservices db = new DBservices();
            try
            {
                db.insertAllAuthors(author);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public List<Author> ReadAllAuthors()
        {
            DBservices db = new DBservices();
            try
            {
                return db.ReadAllAuthors();
            }
            catch
            {
                return null;
            }
        }

        // שיטה לשליפת ספרים לפי מזהה מחבר
        public List<Object> getBooksByAuthor(int authorId)
        {
            DBservices db = new DBservices();
            try
            {
                return db.getBooksByAuthor(authorId); // שימוש במזהה המחבר הנוכחי
            }
            catch
            {

                return null;
            }
        }

        public List<dynamic> GetAuthorsNumInLibraries()
        {
            DBservices db = new DBservices();
            try
            {
                return db.GetAuthorsNumInLibraries();
            }
            catch
            {
                return null;
            }
        }

    }
}

