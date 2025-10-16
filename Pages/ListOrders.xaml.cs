using QuickRectifyMaui2.Service;
using QuickRectifyMaui2.Service.Model;
using QuickRectifyMaui2.Utils;
using System.Collections.ObjectModel;

namespace QuickRectifyMaui2.Pages;

public partial class ListOrders : ContentPage
{
    private PagedResult<Order> _currentPageResults;
    private List<Order> _loadedOrders = new List<Order>();
    private ObservableCollection<Order> _displayedItems;

    public ListOrders()
	{
		InitializeComponent();

        _displayedItems = new ObservableCollection<Order>();
        collectionViewOrders.ItemsSource = _displayedItems;

        _currentPageResults = new PagedResult<Order>();
        _currentPageResults.CurrentPage = 1;
        _currentPageResults.PageSize = 20;

        LoadInitialOrders();
    }

    private async void LoadInitialOrders()
    {
        _currentPageResults = await GetOrders();
        List<Order> orders = _currentPageResults.Items;

        foreach (Order order in orders)
        {
            _loadedOrders.Add(order);
            _displayedItems.Add(order);
        }
    }

    public async Task<PagedResult<Order>> GetOrders()
    {
        return await RequestService.GetOrders(_currentPageResults.CurrentPage, _currentPageResults.PageSize);
    }

    private async void LoadMoreItems()
    {
        _currentPageResults = await GetOrders();
        List<Order> orders = _currentPageResults.Items;

        foreach (Order order in orders)
        {
            _loadedOrders.Add(order);
            _displayedItems.Add(order);
        }
    }

    private void OnLoadMoreClicked(object sender, EventArgs e)
    {
        if (_currentPageResults.HaveNextPage) LoadMoreItems();
        else ToastMessage.ShowToastMessage("No more orders to load.");
    }

}
