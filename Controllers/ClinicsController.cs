
using BookingApi.Models;
using BookingApi.Services.Location;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Swashbuckle.AspNetCore.Annotations;
using System.Data;
using System.Net;

namespace BookingApi.Controllers
{
    [Route("api/clinics")]
    [ApiController]
    public class ClinicsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ClinicsController> _logger;
        private readonly IpGeolocationService _geoService;
        public ClinicsController(
            IConfiguration configuration,
            ILogger<ClinicsController> logger, IpGeolocationService geoService)
        {
            _configuration = configuration;
            _logger = logger;
            _geoService = geoService;
        }

        [HttpGet("allprojects")]
        [SwaggerOperation(Summary = "Get All Projects")]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = new List<ProjectResponse>();
            try
            {
                    var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                    var countryCode = string.IsNullOrWhiteSpace(ip) || IPAddress.IsLoopback(HttpContext.Connection.RemoteIpAddress!) ? "SA"
                        : await _geoService.GetCountryCodeAsync(ip);
                var connectionString = _configuration.GetConnectionString("DefaultConnection");
                await using var connection = new SqlConnection(connectionString);
                await using var command = new SqlCommand("dbo.GetProjects", connection);
                command.CommandType = CommandType.StoredProcedure; 
                command.Parameters.Add("@CountryCode", SqlDbType.NVarChar).Value = countryCode;
                await connection.OpenAsync();
                await using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {                    
                    var project = new ProjectResponse
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        name = reader.GetString(reader.GetOrdinal("Name")),
                        ImageUrl = reader.IsDBNull( reader.GetOrdinal("ImageUrl")) ? string.Empty  : reader.GetString(reader.GetOrdinal("ImageUrl"))
                    };
                    projects.Add(project);
                }
                return Ok(projects);
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error retrieving projects.");
                return StatusCode(500, new{message = "Database error retrieving projects."});            
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving projects.");
                return StatusCode(500, new {message = "Error retrieving projects."});
            }
        }

        [HttpGet("relatedclinics/{projectId:int}")]
        [SwaggerOperation(Summary = "Get Clinics By Project ID")]
        public async Task<IActionResult> GetClinics(int projectId)
        {
            var clinics = new List<Clinic>();

            try
            {
                var connectionString =  _configuration.GetConnectionString("DefaultConnection");
                await using var connection = new SqlConnection(connectionString);
                await using var command =new SqlCommand("dbo.GetClinicsByProjectId", connection);
                var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                var countryCode = string.IsNullOrWhiteSpace(ip) || IPAddress.IsLoopback(HttpContext.Connection.RemoteIpAddress!) ? "SA"
                    : await _geoService.GetCountryCodeAsync(ip);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add( "@ProjectId", SqlDbType.Int).Value = projectId;
                command.Parameters.Add("@CountryCode", SqlDbType.NVarChar).Value = countryCode;
                await connection.OpenAsync();
                await using var reader =
                    await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var clinic = new Clinic
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        Name = reader.GetString(reader.GetOrdinal("Name")),
                        ImageUrl = reader.IsDBNull( reader.GetOrdinal("ImageUrl"))? string.Empty
                            : reader.GetString(reader.GetOrdinal("ImageUrl"))
                    };
                    clinics.Add(clinic);
                }

                return Ok(clinics);
            }
            catch (SqlException ex)
            {
                _logger.LogError(
                    ex, "Database error retrieving clinics for project {ProjectId}.", projectId);

                return StatusCode(500, new
                {
                    message = "Database error retrieving clinics."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving clinics for project {ProjectId}.",projectId);
                return StatusCode(500, new
                {
                    message = "Error retrieving clinics."
                });
            }
        }

        [HttpGet("relatedspeciality/{clinicID:int}")]
        [SwaggerOperation(Summary = "Get Specialities By Clinic  ID")]
        public async Task<IActionResult> GetSpeciality(int ClinicID)
        {
            var Specialities = new List<Speciality>();
            try
            {
                var connectionString =  _configuration.GetConnectionString("DefaultConnection");
                await using var connection = new SqlConnection(connectionString);
                var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                var countryCode = string.IsNullOrWhiteSpace(ip) || IPAddress.IsLoopback(HttpContext.Connection.RemoteIpAddress!) ? "SA"
                    : await _geoService.GetCountryCodeAsync(ip);
                await using var command = new SqlCommand("dbo.GetSpecialitiesByClinicId", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@ClinicId", SqlDbType.Int).Value = ClinicID;
                command.Parameters.Add("@CountryCode", SqlDbType.NVarChar).Value = countryCode;
                await connection.OpenAsync();
                await using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var sp = new Speciality
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        Name = reader.GetString(reader.GetOrdinal("Name")),
                        ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? string.Empty : reader.GetString(reader.GetOrdinal("ImageUrl"))
                    };
                    Specialities.Add(sp);
                }
                return Ok(Specialities);
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error retrieving Specialities for clinic {ClinicID}.", ClinicID);
                return StatusCode(500, new {message = "Database error retrieving Specialities for clinic ."});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrievingSpecialities for clinic {ClinicID}.", ClinicID);
                return StatusCode(500, new{message = "Error retrieving clinics."});
            }
        }
    }
}
