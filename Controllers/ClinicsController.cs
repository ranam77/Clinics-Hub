
using BookingApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Swashbuckle.AspNetCore.Annotations;
using System.Data;

namespace BookingApi.Controllers
{
    [Route("api/clinics")]
    [ApiController]
    public class ClinicsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ClinicsController> _logger;

        public ClinicsController(
            IConfiguration configuration,
            ILogger<ClinicsController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet("allprojects")]
        [SwaggerOperation(Summary = "Get All Projects")]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = new List<ProjectResponse>();

            try
            {
                var connectionString =
                    _configuration.GetConnectionString("DefaultConnection");

                await using var connection =
                    new SqlConnection(connectionString);

                await using var command =
                    new SqlCommand("dbo.GetProjects", connection);

                command.CommandType = CommandType.StoredProcedure;

                await connection.OpenAsync();

                await using var reader =
                    await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var project = new ProjectResponse
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        name = reader.GetString(reader.GetOrdinal("businessname")),
                        ImageUrl = reader.IsDBNull( reader.GetOrdinal("ImageUrl")) ? string.Empty  : reader.GetString(reader.GetOrdinal("ImageUrl"))
                    };

                    projects.Add(project);
                }

                return Ok(projects);
            }
            catch (SqlException ex)
            {
                _logger.LogError(
                    ex, "Database error retrieving projects.");

                return StatusCode(500, new
                {
                    message = "Database error retrieving projects."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex, "Error retrieving projects.");

                return StatusCode(500, new
                {
                    message = "Error retrieving projects."
                });
            }
        }

        [HttpGet("relatedclinics/{projectId:int}")]
        [SwaggerOperation(Summary = "Get Clinics By Project ID")]
        public async Task<IActionResult> GetClinics(int projectId)
        {
            var clinics = new List<Clinic>();

            try
            {
                var connectionString =
                    _configuration.GetConnectionString("DefaultConnection");

                await using var connection =
                    new SqlConnection(connectionString);

                await using var command =
                    new SqlCommand(
                        "dbo.GetClinicsByProjectId", connection);

                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add( "@ProjectId", SqlDbType.Int).Value = projectId;
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
    }
}
