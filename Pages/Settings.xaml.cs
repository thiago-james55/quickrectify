using QuickRectifyMaui2.Utils;

namespace QuickRectifyMaui2.Pages;

public partial class Settings : ContentPage
{
	public Settings()
	{
		InitializeComponent();
	}

    private async void SaveButton_Clicked(object sender, EventArgs e)
    {

        saveButton.IsEnabled = false;
        serverStatusEntry.Text = "Conectando ao Servidor...";
        serverStatusEntry.TextColor = Color.Parse("Yellow");

        var ipAddress = ipAddressEntry.Text;
        var ipPort = ipPortEntry.Text;

        if (ipAddress.Length < 6 || ipPort.Length < 2) 
        {
            await ToastMessage.ShowToastMessage("Preencha o IP corretamente!");
            return; 
        }

        if (await RequestService.ServerIsValid(ipAddress, ipPort) ) 
        {
            Preferences.Set("serverIpAddress", ipAddress);
            Preferences.Set("serverIpPort", ipPort);

            await ToastMessage.ShowToastMessage("IP salvo com sucesso!");
            await ChangeServerStatusEntry(true);
            saveButton.IsEnabled = true;
        }
        else { 
            await ToastMessage.ShowToastMessage("Servidor Offline ou IP invalido!");
            await ChangeServerStatusEntry(false);
            saveButton.IsEnabled = true;
        }


    }

    protected async override void OnAppearing()
    {
        base.OnAppearing();

        var ipAddress = Preferences.Get("serverIpAddress",String.Empty);
        var ipPort = Preferences.Get("serverIpPort", String.Empty);

        if (ipAddress != String.Empty && ipPort != String.Empty)
        {
            ipAddressEntry.Text = ipAddress;
            ipPortEntry.Text = ipPort;

            if (await RequestService.ServerIsValid(ipAddress, ipPort)) await ChangeServerStatusEntry(true); 
            else await ChangeServerStatusEntry(false);
        }
    }

    private async Task ChangeServerStatusEntry(bool status)
    {
        if (status)
        {
            serverStatusEntry.Text = "Servidor Online!";
            serverStatusEntry.TextColor = Color.Parse("Green");
            return;
        }

        serverStatusEntry.Text = "Servidor Offline ou IP inválido!";
        serverStatusEntry.TextColor = Color.Parse("Red");
    }


}