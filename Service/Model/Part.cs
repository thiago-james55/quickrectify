using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickRectifyMaui2.Service.Model;

public class Part
{
    public string Name { get; set; }
    public string Service { get; set; }
    public string Description { get; set; }
    public int Quantity { get; set; }
    public float PricePerQuantity { get; set; }
    public float PriceTotal { get; set; }

    public Part() { }

    public string Summary => $"{Name} - {Service} - {Description} -  {Quantity} - {PriceTotal:F2}";

}
