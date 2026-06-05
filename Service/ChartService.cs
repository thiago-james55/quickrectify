using Microsoft.EntityFrameworkCore;
using QuickRectify.Config;
using QuickRectify.Models;
using QuickRectify.Models.DTOs;

namespace QuickRectify.Services
{
    public class ChartService
    {
        private readonly DbContextConfig _context;

        public ChartService(DbContextConfig context)
        {
            _context = context;
        }

        public async Task<DashboardChartResponse> GetDashboardAsync()
        {
            var today = DateTime.UtcNow;

            var weekStart = today.Date.AddDays(-(int)today.DayOfWeek);
            var monthStart = new DateTime(today.Year, today.Month, 1);
            var yearStart = new DateTime(today.Year, 1, 1);

            var orders = await _context.Orders
                .Include(o => o.Consumer)
                .Include(o => o.Parts)
                .Where(o => o.Date >= yearStart)
                .ToListAsync();

            return new DashboardChartResponse
            {
                Weekly = GetPartsChart(
                    orders.Where(o => o.Date >= weekStart)
                ),

                Monthly = GetPartsChart(
                    orders.Where(o => o.Date >= monthStart)
                ),

                Yearly = GetPartsChart(
                    orders
                ),

                TopClientsMonthly = GetTopClients(
                    orders.Where(o => o.Date >= monthStart)
                ),

                TopClientsYearly = GetTopClients(
                    orders
                )
            };
        }

        private List<ChartItem> GetPartsChart(IEnumerable<Order> orders)
        {
            return orders
                .SelectMany(o => o.Parts)
                .GroupBy(p => p.Name)
                .Select(g => new ChartItem
                {
                    Label = g.Key,
                    Value = g.Count()
                })
                .OrderByDescending(x => x.Value)
                .ToList();
        }

        private List<ChartItem> GetTopClients(IEnumerable<Order> orders)
        {
            return orders
                .Where(o => o.Consumer.Name != "Orçamento")
                .GroupBy(o => o.Consumer.Name)
                .Select(g => new ChartItem
                {
                    Label = g.Key,
                    Value = g.Count()
                })
                .OrderByDescending(x => x.Value)
                .Take(10)
                .ToList();
        }
    }
}