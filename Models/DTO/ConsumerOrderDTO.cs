using System.ComponentModel.DataAnnotations;

namespace QuickRectify.Models.DTO
{
    public class ConsumerOrderDTO
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string Phone3 { get; set; }

        public ConsumerOrderDTO(int id, string name, string phone1, string phone2, string phone3)
        {
            Id = id;
            Name = name;
            Phone1 = phone1;
            Phone2 = phone2;
            Phone3 = phone3;
        }

        public ConsumerOrderDTO(Consumer consumer)
        {
            Id = consumer.Id;
            Name = consumer.Name;
            Phone1 = consumer.Phone1;
            Phone2 = consumer.Phone2;
            Phone3 = consumer.Phone3;
        }



    }
}