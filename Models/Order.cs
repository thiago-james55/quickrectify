using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickRectify.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
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

        [Required]
        public ICollection<Part> Parts { get; set; } = new List<Part>();

        public Order () { }


    }
}
