using QuickRectifyMaui2.Utils;
using System.Net;

public static class RequestService
{
    static readonly HttpClient _httpClient = new HttpClient();

    public static async Task<bool> ServerIsValid(String? ipAddress, String? ipPort)
    {
        if (ipAddress == null || ipPort == null) 
        {
            ipAddress = Preferences.Get("serverIpAddress", String.Empty);
            ipPort = Preferences.Get("serverIpPort", String.Empty);
        }


        if ( !(ipAddress != String.Empty && ipPort != String.Empty) )
        {
            await ToastMessage.ShowToastMessage("IP não configurado!");
            return false;
        }

        var serverUrl = $"http://{ipAddress}:{ipPort}";

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

}
