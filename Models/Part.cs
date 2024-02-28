using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickRectify.Models
{
    public class Part
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Service { get; set; }
        public string? Description { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public float PricePerQuantity { get; set; }
        [Required]
        public float PriceTotal { get; set; }

        public int OrderId {  get; set; }

        [ForeignKey(nameof(OrderId))]
        public Order Order { get; set; }

        public Part() { }

    }
}
