using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuickRectifyMaui2.Service.Model
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public bool HaveNextPage => CurrentPage * PageSize < TotalCount;
    }
}

