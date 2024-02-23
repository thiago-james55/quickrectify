namespace QuickRectify.Models.DTO
{
    public class ConsumerDTO
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Document { get; set; }
        public string Address { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string Phone3 { get; set; }

        public ConsumerDTO(int id, string name, string document, string address, string phone1, string phone2, string phone3)
        {
            Id = id;
            Name = name;
            Document = document;
            Address = address;
            Phone1 = phone1;
            Phone2 = phone2;
            Phone3 = phone3;
        }

        public ConsumerDTO(Consumer consumer)
        {
            Id = consumer.Id;
            Name = consumer.Name;
            Document = consumer.Document;
            Address = consumer.Address;
            Phone1 = consumer.Phone1;
            Phone2 = consumer.Phone2;
            Phone3 = consumer.Phone3;
        }



    }
}