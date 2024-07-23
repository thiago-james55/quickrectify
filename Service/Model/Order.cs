namespace QuickRectifyMaui2.Service.Model;

public class Order
{
    public int? Id { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public float? DiscountPercent { get; set; } = 0;
    public float? DiscountCash { get; set; } = 0;
    public float PriceSubTotal { get; set; }
    public float PriceTotal { get; set; }
    
    public int ConsumerId { get; set; }

    public Consumer Consumer { get; set; }

    public ICollection<Part> Parts { get; set; } = new List<Part>();

    public Order () { }


}
