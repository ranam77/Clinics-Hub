using BookingApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Swashbuckle.AspNetCore.Annotations;
using System.Data;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<PatientsController> _logger;
    public DoctorsController(IConfiguration configuration, ILogger<PatientsController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet("get/{doctorID:long}")]
    [SwaggerOperation(Summary = "Get Doctor by ID")]
    public async Task<IActionResult> GetDoctor(Int64 doctorID)
    {
        Doctor doc = null;
        try
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            await using var connection = new SqlConnection(connectionString);
            await using var command = new SqlCommand("dbo.GetDoctorDeatils", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@DoctorID", SqlDbType.BigInt).Value = doctorID;
            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    doc = new Doctor
                    {
                        Id = reader.GetInt64(reader.GetOrdinal("Id")),
                        firstName = reader.GetString(reader.GetOrdinal("FirstName")),
                        lastName = reader.IsDBNull(reader.GetOrdinal("LastName")) ? null : reader.GetString(reader.GetOrdinal("LastName")),
                        SpecialtyName = reader.GetString(reader.GetOrdinal("SpecialtyName")),
                        clinicName = reader.GetString(reader.GetOrdinal("CLinicName")),
                        ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? null : reader.GetString(reader.GetOrdinal("ImageUrl")),
                    };
                }

            if (doc != null)
                return Ok(doc);
            else
                return NotFound();
        }
        catch (SqlException ex)
        {
            _logger.LogError(ex, "Database Error retrieving Doctor with id {DoctorId}", doctorID);
            return StatusCode(500, new { message = "An error occurred while retrieving Doctor." });
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error retrieving bookings for Doctor {DoctorId}", doctorID);
            return StatusCode(500, new { message = "An error occurred while retrieving  Doctor." });
        }
    }

    [HttpGet("all/{cl:int}/{sp:int}")]
    [SwaggerOperation(Summary = "Get Related Doctors For Clinic / Specialize")]
    public async Task<IActionResult> GetDoctors(int cl , int sp)
    {
        try
        {
            List<Doctor> doctors = new List<Doctor>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            await using var connection = new SqlConnection(connectionString);
            await using var command = new SqlCommand("dbo.GetDoctors", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@ClinicID", SqlDbType.BigInt).Value = cl;
            command.Parameters.Add("@SpID", SqlDbType.BigInt).Value = sp;
            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                Doctor doc = new Doctor
                {
                    Id = reader.GetInt64(reader.GetOrdinal("Id")),
                    firstName = reader.GetString(reader.GetOrdinal("FirstName")),
                    lastName = reader.IsDBNull(reader.GetOrdinal("LastName"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("LastName")),

                    SpecialtyName = reader.GetString(reader.GetOrdinal("SpecialtyName")),
                    clinicName = reader.GetString(reader.GetOrdinal("CLinicName")),

                    ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("ImageUrl"))
                };

                doctors.Add(doc);
            }
            if (doctors.Count() > 0)
                return Ok(doctors);
            else
                return NotFound();
        }
        catch (SqlException ex)
        {
            _logger.LogError(ex, "Database Error retrieving Doctors with cl {clId} sp {spId}", cl , sp);
            return StatusCode(500, new { message = "An Database error occurred while retrieving Doctors." });
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Database Error retrieving Doctors with cl {clId} sp {spId}", cl, sp);
            return StatusCode(500, new { message = "An error occurred while retrieving Doctors." });
        }
    }
}
