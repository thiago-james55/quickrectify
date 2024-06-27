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

        public OrderInput() { }

        public async Task<Order> ToOrder()
        {
            Order order = new Order
            {
                Id = Id,
                Date = Date ?? DateTime.UtcNow,
                DiscountPercent = DiscountPercent,
                DiscountCash = DiscountCash,
                PriceSubTotal = PriceSubTotal,
                PriceTotal = PriceTotal,
                ConsumerId = ConsumerId,
                Parts = (await Task.WhenAll(Parts.Select(async p => await p.ToPart()))).ToList()
            };

            return order;
        }
    }
}
