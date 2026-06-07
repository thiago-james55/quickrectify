using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickRectify.Models
{
    public class Balance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;
        public DateTime? DateOfPayment { get; set; }
        public int InitialOrder { get; set; }
        public int FinalOrder { get; set; }
        public string? ExcludedOrders  { get; set; }
        public string? Description { get; set; }

        [ForeignKey(nameof(ConsumerId))]
        public Consumer Consumer { get; set; }

        [ForeignKey(nameof(OrderId))]
        public Order Order { get; set; }


        [Required]
        public int ConsumerId { get; set; }

        public int? OrderId { get; set; }

        [Required]
        public float PriceTotal { get; set; }

        [Required]
        public bool IsPaid { get; set; }

        public Balance() { }

        public string ToStringBasic()
        {
            return $"Id: ({Id}) - OS Inicial: ({InitialOrder}) - OS Final: ({FinalOrder})";
        }

    }
}