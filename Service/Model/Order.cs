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

    public List<Part> Parts { get; set; } = new List<Part>();

    public Order () { }

    // -------------------
    // Strings para UI
    // -------------------
    public string OrderInfo => $"OS N° {Id}     {Date:dd/MM/yyyy}";
    public string ConsumerInfo => $"{Consumer?.Name ?? ""}     {Consumer?.Phone1 ?? ""}";
    public string DiscountInfo => $"Desconto % {DiscountPercent:F2}     Desconto R$ {DiscountCash:F2}";
    public string PriceInfo => $"SubTotal R$ {PriceSubTotal:F2}     Total R$ {PriceTotal:F2}";

    // String resumida das peças (opcional, para performance)
    public string PartsSummary => string.Join("\n", Parts.Select(p => $"{p.Summary}"));


}
