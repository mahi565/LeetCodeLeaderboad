using LeetCodeTracker.API.DTOs;
using LeetCodeTracker.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeetCodeTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeetCodeController : ControllerBase
{
    private readonly ILeetCodeService _leetCodeService;

    public LeetCodeController(ILeetCodeService leetCodeService)
    {
        _leetCodeService = leetCodeService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var userId = GetUserId();
        var stats = await _leetCodeService.UpdateUserStatsAsync(userId);
        
        if (stats == null)
            return BadRequest("Unable to fetch LeetCode stats. Please check your username.");

        return Ok(stats);
    }

    [HttpGet("competitors")]
    public async Task<IActionResult> GetCompetitors()
    {
        var userId = GetUserId();
        var competitors = await _leetCodeService.GetCompetitorsAsync(userId);
        return Ok(competitors);
    }

    [HttpPost("competitors")]
    public async Task<IActionResult> AddCompetitor([FromBody] AddCompetitorRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var competitor = await _leetCodeService.AddCompetitorAsync(userId, request);
        
        if (competitor == null)
            return BadRequest("Competitor already exists or invalid username");

        return Ok(competitor);
    }

    [HttpDelete("competitors/{competitorId}")]
    public async Task<IActionResult> RemoveCompetitor(int competitorId)
    {
        var userId = GetUserId();
        var result = await _leetCodeService.RemoveCompetitorAsync(userId, competitorId);
        
        if (!result)
            return NotFound("Competitor not found");

        return NoContent();
    }

    [HttpGet("leaderboard")]
    public async Task<IActionResult> GetLeaderboard()
    {
        var userId = GetUserId();
        var leaderboard = await _leetCodeService.GetLeaderboardAsync(userId);
        return Ok(leaderboard);
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    }
}