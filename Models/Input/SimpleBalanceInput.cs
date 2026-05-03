using System.ComponentModel.DataAnnotations;

namespace QuickRectify.Models.Input
{
    public class SimpleBalanceInput
    {
        [Required]
        public int ConsumerId { get; set; }
        [Required]
        public List<int> OrderIds { get; set; }

        public SimpleBalanceInput() { }
    }
}
