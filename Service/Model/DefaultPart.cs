namespace QuickRectifyMaui2.Service.Model;

public class DefaultPart
{
    public string? Name { get; set; }
    public List<string> Services { get; set; }

    public DefaultPart(string name, List<string> services)
    {
        Name = name;
        Services = services;
    }
}