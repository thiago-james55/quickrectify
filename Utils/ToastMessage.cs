using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;

namespace QuickRectifyMaui2.Utils
{
    public static class ToastMessage
    {
        public static async Task ShowToastMessage(string message)
        {
            ToastDuration duration = ToastDuration.Short;

            double fontSize = 14;

            CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

            var toast = Toast.Make(message, duration, fontSize);

            await toast.Show(cancellationTokenSource.Token);
        }

    }
}