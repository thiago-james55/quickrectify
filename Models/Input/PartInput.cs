using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace QuickRectify.Models
{
    public class PartInput
    {
        public int? Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Service { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public float PricePerQuantity { get; set; }
        [Required]
        public float PriceTotal { get; set; }
        public bool IsPaid { get; set; } = false;

        public PartInput() { }

        public async Task<Part> ToPart()
        {
            Part part = new Part();

            if (Id > 0) part.Id = (int)Id;
            part.Name = Name;
            part.Service = Service;
            part.Description = await CapitalizeDescription(Description);
            part.Quantity = Quantity;
            part.PricePerQuantity = PricePerQuantity;
            part.PriceTotal = PriceTotal;
            part.IsPaid = IsPaid;

            return part;
        }

        private async Task<string> CapitalizeDescription(string description)
        {

            TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;

            string capitalized = textInfo.ToTitleCase(description.ToLower());

            return capitalized;
        }

    }
}
