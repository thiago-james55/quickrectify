using QuickRectifyMaui2.Service.Model;
using QuickRectifyMaui2.Utils;
using System.Net.Http.Json;

namespace QuickRectifyMaui2.Service;

public static class RequestService
{
    static readonly HttpClient _httpClient = new HttpClient();

    public static async Task<bool> ServerIsValid(String? ipAddress, String? ipPort)
    {

        var serverUrl = await GetServerURL(ipAddress, ipPort);

        try
        {
            var response = await _httpClient.GetAsync(serverUrl + "/swagger"); //Change to healthy
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            await ToastMessage.ShowToastMessage(ex.Message);
            return false;
        }

    }

    public static async Task<String> GetServerURL(String? ipAddress, String? ipPort)
    {
        if (ipAddress == null || ipPort == null)
        {
            ipAddress = Preferences.Get("serverIpAddress", String.Empty);
            ipPort = Preferences.Get("serverIpPort", String.Empty);
        }

        if (!(ipAddress != String.Empty && ipPort != String.Empty))
        {
            await ToastMessage.ShowToastMessage("IP não configurado!");
            return String.Empty;
        }

        return $"http://{ipAddress}:{ipPort}";
    }

    public static async Task<PagedResult<Order>> GetOrders(int page , int pageSize)
    {

        var serverUrl = await GetServerURL(null,null);

        try
        {
            var orders = await _httpClient.GetFromJsonAsync<PagedResult<Order>>(serverUrl + "/Orders?page=" + page + "&pageSize=" + pageSize);
            return orders ?? new PagedResult<Order>();
        }
        catch (Exception ex)
        {
            // Handle exceptions such as network errors or JSON deserialization errors
            await ToastMessage.ShowToastMessage($"Unable to fetch items: {ex.Message}");
            return new PagedResult<Order>();
        }
    }



}