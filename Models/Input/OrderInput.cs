using System.ComponentModel.DataAnnotations;

namespace QuickRectify.Models
{
    public class OrderInput
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public float? DiscountPercent { get; set; }
        public float? DiscountCash { get; set; }

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
                DiscountPercent = DiscountPercent ?? 0,
                DiscountCash = DiscountCash ?? 0,
                PriceSubTotal = PriceSubTotal,
                PriceTotal = PriceTotal,
                ConsumerId = ConsumerId,
                Parts = Parts.Select(p => p.ToPart()).ToList()
            };

            return order;
        }
    }
}
