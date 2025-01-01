using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickRectify.Models
{
    public class PartDTO
    {

        public string Name { get; set; }
        public string Service { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public float PricePerQuantity { get; set; }
        public float PriceTotal { get; set; }
        public bool IsPaid { get; set; }

        public PartDTO(string name, string service, string description, int quantity, float pricePerQuantity, float priceTotal, bool isPaid)
        {
            Name = name;
            Service = service;
            Description = description;
            Quantity = quantity;
            PricePerQuantity = pricePerQuantity;
            PriceTotal = priceTotal;
            IsPaid = isPaid;
        }

        public PartDTO(Part part)
        {
            Name = part.Name;
            Service = part.Service;
            Description = part.Description;
            Quantity = part.Quantity;
            PricePerQuantity = part.PricePerQuantity;
            PriceTotal = part.PriceTotal;
            IsPaid = part.IsPaid;
        }
    }
}
