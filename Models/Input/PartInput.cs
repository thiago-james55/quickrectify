using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickRectify.Models
{
    public class PartInput
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Service { get; set; }
        public string Description { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public float PricePerQuantity { get; set; }
        [Required]
        public float PriceTotal { get; set; }

        public PartInput() { }

        public Part ToPart()
        {
            Part part = new Part();

            if (Id > 0) part.Id = Id;
            part.Name = Name;
            part.Service = Service;
            part.Description = Description;
            part.Quantity = Quantity;
            part.PricePerQuantity = PricePerQuantity;
            part.PriceTotal = PriceTotal;

            return part;
        }

    }
}
