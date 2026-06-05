namespace QuickRectify.Models.DTOs
{
    public class DashboardChartResponse
    {
        public List<ChartItem> Weekly { get; set; } = [];
        public List<ChartItem> Monthly { get; set; } = [];
        public List<ChartItem> Yearly { get; set; } = [];

        public List<ChartItem> TopClientsMonthly { get; set; } = [];
        public List<ChartItem> TopClientsYearly { get; set; } = [];
    }

    public class ChartItem
    {
        public string Label { get; set; } = string.Empty;
        public int Value { get; set; }
    }
}