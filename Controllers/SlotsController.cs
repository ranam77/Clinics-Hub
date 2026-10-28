using BookingApi.Data;
using BookingApi.DTOs;
using BookingApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using System.Data;
namespace BookingApi.Controllers;

[Authorize]
[ApiController]
[Route("api/slots")]
public class SlotsController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<ClinicsController> _logger;
    public SlotsController(IConfiguration  configuration, ILogger<ClinicsController> logger)
    {
        _configuration =  configuration;
        _logger = logger;
    }

    [HttpPost("validSlotes")] 
    [SwaggerOperation(Summary = "Get Avaliable Slots")]  
    public async Task<IActionResult> GetAvailableSlots([FromBody] AvaiableSlotsRequest Request)
    {
        var slots = new List<Slots>();
        try
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            await using var connection = new SqlConnection(connectionString);
            await using var command = new SqlCommand("dbo.GetAvailableSlots", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@DoctorID", SqlDbType.BigInt).Value = 
            Request.DoctorId.HasValue && Request.DoctorId.Value != 0? (object)Request.DoctorId.GetValueOrDefault() : DBNull.Value;
            command.Parameters.Add("@Cl_Sp_Id", SqlDbType.Int).Value =
            Request.Cl_Sp_Id.HasValue && Request.Cl_Sp_Id.Value != 0 ? (object)Request.Cl_Sp_Id.GetValueOrDefault() : DBNull.Value;
            command.Parameters.Add("@FromDate", SqlDbType.DateTime2).Value =  Request.FromDate;
            command.Parameters.Add("@ToDate", SqlDbType.DateTime2).Value = Request.ToDate; 
            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var slot = new Slots
                {
                    Id = reader.GetInt64(reader.GetOrdinal("SlotId")),
                    startsAt = reader.GetDateTime(reader.GetOrdinal("StartsAt")),
                    endsAt = reader.GetDateTime(reader.GetOrdinal("EndsAt")) 
                };
                slots.Add(slot);
            }
            return Ok(slots);
        }
        catch (SqlException ex)
        {
            _logger.LogError(ex, "Database error retrieving slots.");
            return StatusCode(500, new { message = "Database error retrieving slots." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving slots.");
            return StatusCode(500, new { message = "Error retrieving slots." });
        }
    }
}