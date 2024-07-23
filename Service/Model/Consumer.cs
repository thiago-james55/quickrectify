namespace QuickRectifyMaui2.Service.Model;

public class Consumer
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public string Document { get; set; }
    public string? Address { get; set; }
    public string Phone1 { get; set; }
    public string? Phone2 { get; set; }
    public string? Phone3 { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();

    public Consumer() { }

}