using System.ComponentModel.DataAnnotations;

namespace QuickRectify.Models
{
    public class OrderInput
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public float DiscountPercent { get; set; } = 0;
        public float DiscountCash { get; set; } = 0;

        [Required]
        public float PriceSubTotal { get; set; }

        [Required]
        public float PriceTotal { get; set; }

        [Required]
        public int ConsumerId { get; set; }

        [Required]
        public ICollection<PartInput> Parts { get; set; } = new List<PartInput>();

        public string? EngineBlockNumberImage { get; set; } = null;

        public OrderInput() { }

        public async Task<Order> ToOrder()
        {
            Order order = new Order
            {
                Id = Id,
                Date = Date ?? DateTime.Now,
                DiscountPercent = DiscountPercent,
                DiscountCash = DiscountCash,
                PriceSubTotal = PriceSubTotal,
                PriceTotal = PriceTotal,
                ConsumerId = ConsumerId,
                Parts = (await Task.WhenAll(Parts.Select(async p => await p.ToPart()))).ToList(),
                EngineBlockNumberImage = ConvertBase64ToByteArray(EngineBlockNumberImage),
            };

            return order;
        }

        public byte[] ConvertBase64ToByteArray(string base64String)
        {
            if (string.IsNullOrWhiteSpace(base64String)) return null;

            // Check if the string contains the prefix and remove it
            if (base64String.Contains(","))
            {
                base64String = base64String.Split(',')[1]; // Get the part after the comma
            }

            // Convert the Base64 string to a byte array
            byte[] imageBytes = Convert.FromBase64String(base64String);
            return imageBytes;
        }
    }
}
