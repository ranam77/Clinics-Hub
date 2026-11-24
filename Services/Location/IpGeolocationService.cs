namespace BookingApi.Services.Location
{
    using System.Text.Json;

    public class IpGeolocationService
    {
        private readonly HttpClient _httpClient;

        public IpGeolocationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string?> GetCountryCodeAsync(string ip)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://ipwho.is/{ip}");

                if (!response.IsSuccessStatusCode)
                    return null;

                var result = await response.Content.ReadFromJsonAsync<IpResponse>();

                return result?.Success == true? result.CountryCode?.ToUpperInvariant() : null;
            }
            catch (HttpRequestException)
            {
                return null;
            }
        }

        private class IpResponse
        {
            public bool Success { get; set; }
            public string? CountryCode { get; set; }
        }
    }
}
