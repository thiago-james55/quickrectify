using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QuickRectify.Models.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public float DiscountPercent { get; set; }
        public float DiscountCash { get; set; }
        public float PriceSubTotal { get; set; }
        public float PriceTotal { get; set; }
        public ConsumerOrderDTO ConsumerOrderDTO { get; set; }
        public IEnumerable<PartDTO> PartsDTO { get; set; } = new List<PartDTO>();

        public OrderDTO(int id, DateTime date, float discountPercent, float discountCash, float priceSubTotal, float priceTotal, ConsumerOrderDTO consumerOrderDTO, IEnumerable<Part> parts)
        {
            Id = id;
            Date = date;
            DiscountPercent = discountPercent;
            DiscountCash = discountCash;
            PriceSubTotal = priceSubTotal;
            PriceTotal = priceTotal;
            ConsumerOrderDTO = consumerOrderDTO;

            PartsDTO = parts.Select(part => new PartDTO(part)).ToList();

        }

        public OrderDTO(Order order)
        {
            Id = order.Id;
            Date = order.Date;
            DiscountPercent = order.DiscountPercent;
            DiscountCash = order.DiscountCash;
            PriceSubTotal = order.PriceSubTotal;
            PriceTotal = order.PriceTotal;
            ConsumerOrderDTO = new ConsumerOrderDTO(order.Consumer);
            PartsDTO = order.Parts.Select(part => new PartDTO(part)).ToList();
        }




    }
}
