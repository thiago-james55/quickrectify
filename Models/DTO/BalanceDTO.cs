using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace QuickRectify.Models.DTO
{
    public class BalanceDTO
    {

        public int Id { get; set; }
        public DateTime Date { get; set; }
        public DateTime? DateOfPayment { get; set; }
        public int InitialOrder { get; set; }
        public int FinalOrder { get; set; }
        public List<int>? ExcludedOrders { get; set; }
        public string? Description { get; set; }
        public ConsumerDTO Consumer { get; set; }
        public int ConsumerId { get; set; }
        public float PriceTotal { get; set; }
        public bool IsPaid { get; set; }

        public BalanceDTO(int id, DateTime date, DateTime dateOfPayment, int initialOrder, int finalOrder, List<int> excludedOrders, string description, ConsumerDTO consumerDTO, int consumerId, float priceTotal, bool isPaid)
        {
            Id = id;
            Date = date;
            DateOfPayment = dateOfPayment;
            InitialOrder = initialOrder;
            FinalOrder = finalOrder;
            ExcludedOrders = excludedOrders;
            Description = description;
            Consumer = consumerDTO;
            ConsumerId = consumerId;
            PriceTotal = priceTotal;
            IsPaid = isPaid;
        }

        public BalanceDTO(Balance balance)
        {
            Id = balance.Id;
            Date = balance.Date;
            DateOfPayment = balance.DateOfPayment;
            InitialOrder = balance.InitialOrder;
            FinalOrder = balance.FinalOrder;

            ExcludedOrders = balance.ExcludedOrders.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList();

            Description = balance.Description;
            Consumer = new ConsumerDTO(balance.Consumer);
            ConsumerId = balance.ConsumerId;
            PriceTotal = balance.PriceTotal;
            IsPaid = balance.IsPaid;
        }
    }
}
