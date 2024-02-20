using System.ComponentModel.DataAnnotations;

namespace QuickRectify.Models
{
    public class OrderInput
    {
        public int Id { get; set; }
        public float DiscountPercent { get; set; }
        public float DiscountCash { get; set; }
        [Required]
        public float PriceSubTotal { get; set; }
        [Required]
        public float PriceTotal { get; set; }
        
        [Required]
        public int ConsumerId { get; set; }

        [Required]
        public ICollection<PartInput> Parts { get; set; } = new List<PartInput>();

        public OrderInput () { }

        public async Task<Order> ToOrder()
        {
            Order order = new Order ();

            if (Id  > 0) order.Id = Id;
            order.DiscountPercent = DiscountPercent;
            order.DiscountCash = DiscountCash;
            order.PriceSubTotal = PriceSubTotal;
            order.PriceTotal = PriceTotal;
            order.ConsumerId = ConsumerId;
            order.Parts = Parts.Select(p => p.ToPart()).ToList();

            return order;


        }

        
    }
}
