using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickRectify.Models
{
    public class Order
    {
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public float DiscountPercent { get; set; }
        public float DiscountCash { get; set; }
        [Required]
        public float PriceSubTotal { get; set; }
        [Required]
        public float PriceTotal { get; set; }
        
        [Required]
        public int ConsumerId { get; set; }

        [ForeignKey(nameof(ConsumerId))]
        public Consumer Consumer { get; set; }

        public IEnumerable<Part> Parts { get; set; } = new List<Part>();

        public Order () { }

        
    }
}
