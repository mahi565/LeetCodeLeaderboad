using LeetCodeTracker.API.DTOs;

namespace LeetCodeTracker.API.Services;

public interface ILeetCodeService
{
    Task<LeetCodeStatsDto?> GetUserStatsAsync(string username);
    Task<LeetCodeStatsDto?> UpdateUserStatsAsync(int userId);
    Task<List<CompetitorDto>> GetCompetitorsAsync(int userId);
    Task<CompetitorDto?> AddCompetitorAsync(int userId, AddCompetitorRequest request);
    Task<bool> RemoveCompetitorAsync(int userId, int competitorId);
    Task<List<LeaderboardEntry>> GetLeaderboardAsync(int userId);
}