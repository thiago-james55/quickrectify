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
        public ConsumerOrderDTO Consumer { get; set; }
        public IEnumerable<PartDTO> Parts { get; set; } = new List<PartDTO>();

        public OrderDTO(int id, DateTime date, float discountPercent, float discountCash, float priceSubTotal, float priceTotal, ConsumerOrderDTO consumerOrderDTO, IEnumerable<Part> parts)
        {
            Id = id;
            Date = date;
            DiscountPercent = discountPercent;
            DiscountCash = discountCash;
            PriceSubTotal = priceSubTotal;
            PriceTotal = priceTotal;
            Consumer = consumerOrderDTO;

            Parts = parts.Select(part => new PartDTO(part)).ToList();

        }

        public OrderDTO(Order order)
        {
            Id = order.Id;
            Date = order.Date;
            DiscountPercent = order.DiscountPercent;
            DiscountCash = order.DiscountCash;
            PriceSubTotal = order.PriceSubTotal;
            PriceTotal = order.PriceTotal;
            Consumer = new ConsumerOrderDTO(order.Consumer);
            Parts = order.Parts.Select(part => new PartDTO(part)).ToList();
        }




    }
}
