using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace QuickRectify.Models
{

    public class ConsumerInput
    {

        public int? Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Document { get; set; }
        public string? Address { get; set; }
        [Required]
        public string Phone1 { get; set; }
        public string? Phone2 { get; set; }
        public string? Phone3 { get; set; }

        public ConsumerInput() { }

        public async Task<Consumer> ToConsumer()
        {
            Consumer consumer = new Consumer();
            if (Id > 0) consumer.Id = (int)Id;
            consumer.Name = await CapitalizeName(Name);
            consumer.Document = Document;
            consumer.Address = Address;
            consumer.Phone1 = Phone1;
            consumer.Phone2 = Phone2;
            consumer.Phone3 = Phone3;

            return consumer;

        }

        private async Task<string> CapitalizeName(string name)
        {
            
            TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;

            string capitalized = textInfo.ToTitleCase(name.ToLower());

            return capitalized;
        }

    }
}