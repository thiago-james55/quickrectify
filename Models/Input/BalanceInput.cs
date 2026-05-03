using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;

namespace QuickRectify.Models.Input
{
    public class BalanceInput
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public DateTime? DateOfPayment { get; set; }

        [Required]
        public int InitialOrder { get; set; }

        [Required]
        public int FinalOrder { get; set; }

        public List<int>? ExcludedOrders { get; set; }
        public string? Description { get; set; }

        [Required]
        public int ConsumerId { get; set; }

        public float PriceTotal { get; set; }
        public bool IsPaid { get; set; } = false;

        public BalanceInput() { }

        public async Task<Balance> ToBalance()
        {
            Balance balance = new Balance
            {
                Id = Id,
                Date = Date ?? DateTime.UtcNow,
                InitialOrder = InitialOrder,
                FinalOrder = FinalOrder,
                ExcludedOrders = ExcludedOrders != null ? string.Join(",", ExcludedOrders) : null,
                Description = Description,
                ConsumerId = ConsumerId,
                PriceTotal = PriceTotal,
                IsPaid = IsPaid,
            };

            return balance;
        }
        
    }
}
