namespace BookingApi.Services.Location
{
    using System.Text.Json;
    using System.Text.Json.Serialization;

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

                var result = await response.Content.ReadFromJsonAsync<IpGeolocationResponse>();

                return result?.Success == true? result.CountryCode?.ToUpperInvariant() : null;
            }
            catch (HttpRequestException)
            {
                return null;
            }
        }

 

public class IpGeolocationResponse
    {
        public bool Success { get; set; }

        [JsonPropertyName("country_code")]
        public string? CountryCode { get; set; }
    }
}
}
