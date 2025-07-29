using LeetCodeTracker.API.Data;
using LeetCodeTracker.API.DTOs;
using LeetCodeTracker.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace LeetCodeTracker.API.Services;

public class LeetCodeService : ILeetCodeService
{
    private readonly ApplicationDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public LeetCodeService(ApplicationDbContext context, HttpClient httpClient, IConfiguration configuration)
    {
        _context = context;
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<LeetCodeStatsDto?> GetUserStatsAsync(string username)
    {
        try
        {
            var baseUrl = _configuration["LeetCodeAPI:BaseUrl"];
            var response = await _httpClient.GetAsync($"{baseUrl}/{username}");

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<LeetCodeApiResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (apiResponse == null)
                return null;

            var stats = new LeetCodeStatsDto
            {
                Username = username,
                TotalSolved = apiResponse.TotalSolved,
                EasySolved = apiResponse.EasySolved,
                MediumSolved = apiResponse.MediumSolved,
                HardSolved = apiResponse.HardSolved,
                TotalEasy = apiResponse.TotalEasy,
                TotalMedium = apiResponse.TotalMedium,
                TotalHard = apiResponse.TotalHard,
                AcceptanceRate = (int)(apiResponse.AcceptanceRate),
                Ranking = apiResponse.Ranking,
                ContestRating = (int)(apiResponse.ContestRating ?? 0),
                ContestGlobalRanking = apiResponse.ContestGlobalRanking ?? 0,
                ContributionPoints = apiResponse.ContributionPoint,
                Reputation = apiResponse.Reputation,
                TotalSubmissions = apiResponse.TotalSubmissions.FirstOrDefault(x => x.Difficulty == "All")?.Submissions ?? 0,
                EasySubmissions = apiResponse.TotalSubmissions.FirstOrDefault(x => x.Difficulty == "Easy")?.Submissions ?? 0,
                MediumSubmissions = apiResponse.TotalSubmissions.FirstOrDefault(x => x.Difficulty == "Medium")?.Submissions ?? 0,
                HardSubmissions = apiResponse.TotalSubmissions.FirstOrDefault(x => x.Difficulty == "Hard")?.Submissions ?? 0,
                RecentSubmissions = apiResponse.RecentSubmissions.Select(s => new RecentSubmissionDto
                {
                    Title = s.Title,
                    TitleSlug = s.TitleSlug,
                    Language = s.Lang,
                    StatusDisplay = s.StatusDisplay,
                    Timestamp = long.TryParse(s.Timestamp, out var ts) ? ts : 0
                }).ToList(),
                SubmissionCalendar = apiResponse.SubmissionCalendar,
                LastUpdated = DateTime.UtcNow
            };

            return stats;
        }
        catch
        {
            return null;
        }
    }

    public async Task<LeetCodeStatsDto?> UpdateUserStatsAsync(int userId)
    {
        var user = await _context.Users.Include(u => u.LeetCodeStats).FirstOrDefaultAsync(u => u.Id == userId);
        if (user?.LeetCodeUsername == null)
            return null;

        var stats = await GetUserStatsAsync(user.LeetCodeUsername);
        if (stats == null)
            return null;

        if (user.LeetCodeStats == null)
        {
            user.LeetCodeStats = new LeetCodeStats { UserId = userId };
            _context.LeetCodeStats.Add(user.LeetCodeStats);
        }

        user.LeetCodeStats.Username = stats.Username;
        user.LeetCodeStats.TotalSolved = stats.TotalSolved;
        user.LeetCodeStats.EasySolved = stats.EasySolved;
        user.LeetCodeStats.MediumSolved = stats.MediumSolved;
        user.LeetCodeStats.HardSolved = stats.HardSolved;
        user.LeetCodeStats.AcceptanceRate = stats.AcceptanceRate;
        user.LeetCodeStats.Ranking = stats.Ranking;
        user.LeetCodeStats.ContestRating = stats.ContestRating;
        user.LeetCodeStats.ContestGlobalRanking = stats.ContestGlobalRanking;
        user.LeetCodeStats.LastUpdated = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return stats;
    }

    public async Task<List<CompetitorDto>> GetCompetitorsAsync(int userId)
    {
        return await _context.Competitors
            .Where(c => c.UserId == userId)
            .Select(c => new CompetitorDto
            {
                Id = c.Id,
                LeetCodeUsername = c.LeetCodeUsername,
                DisplayName = c.DisplayName,
                AddedAt = c.AddedAt
            })
            .ToListAsync();
    }

    public async Task<CompetitorDto?> AddCompetitorAsync(int userId, AddCompetitorRequest request)
    {
        if (await _context.Competitors.AnyAsync(c => c.UserId == userId && c.LeetCodeUsername == request.LeetCodeUsername))
            return null;

        var competitor = new Competitor
        {
            UserId = userId,
            LeetCodeUsername = request.LeetCodeUsername,
            DisplayName = request.DisplayName
        };

        _context.Competitors.Add(competitor);
        await _context.SaveChangesAsync();

        return new CompetitorDto
        {
            Id = competitor.Id,
            LeetCodeUsername = competitor.LeetCodeUsername,
            DisplayName = competitor.DisplayName,
            AddedAt = competitor.AddedAt
        };
    }

    public async Task<bool> RemoveCompetitorAsync(int userId, int competitorId)
    {
        var competitor = await _context.Competitors.FirstOrDefaultAsync(c => c.Id == competitorId && c.UserId == userId);
        if (competitor == null)
            return false;

        _context.Competitors.Remove(competitor);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<LeaderboardEntry>> GetLeaderboardAsync(int userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        var leaderboard = new List<LeaderboardEntry>();

        if (user != null && !string.IsNullOrEmpty(user.LeetCodeUsername))
        {
            var updatedStats = await UpdateUserStatsAsync(userId);

            if (updatedStats != null)
            {
                leaderboard.Add(new LeaderboardEntry
                {
                    Username = updatedStats.Username,
                    DisplayName = user.Email,
                    TotalSolved = updatedStats.TotalSolved,
                    ContestRating = updatedStats.ContestRating,
                    Ranking = updatedStats.Ranking,
                    IsCurrentUser = true
                });
            }
        }

        var competitors = await _context.Competitors.Where(c => c.UserId == userId).ToListAsync();

        foreach (var competitor in competitors)
        {
            var stats = await GetUserStatsAsync(competitor.LeetCodeUsername);
            if (stats != null)
            {
                leaderboard.Add(new LeaderboardEntry
                {
                    Username = stats.Username,
                    DisplayName = competitor.DisplayName ?? competitor.LeetCodeUsername,
                    TotalSolved = stats.TotalSolved,
                    ContestRating = stats.ContestRating,
                    Ranking = stats.Ranking,
                    IsCurrentUser = false
                });
            }
        }

        return leaderboard.OrderByDescending(l => l.TotalSolved).ToList();
    }

    private class LeetCodeApiResponse
    {
        public int TotalSolved { get; set; }
        public int EasySolved { get; set; }
        public int MediumSolved { get; set; }
        public int HardSolved { get; set; }

        public int TotalEasy { get; set; }
        public int TotalMedium { get; set; }
        public int TotalHard { get; set; }

        public int ContributionPoint { get; set; }
        public int Reputation { get; set; }
        public double AcceptanceRate { get; set; }
        public int Ranking { get; set; }
        public double? ContestRating { get; set; }
        public int? ContestGlobalRanking { get; set; }

        public List<SubmissionCount> TotalSubmissions { get; set; } = new();
        public List<RecentSubmission> RecentSubmissions { get; set; } = new();
        public Dictionary<long, int> SubmissionCalendar { get; set; } = new();
    }

    private class SubmissionCount
    {
        public string Difficulty { get; set; } = string.Empty;
        public int Count { get; set; }
        public int Submissions { get; set; }
    }

    private class RecentSubmission
    {
        public string Title { get; set; } = string.Empty;
        public string TitleSlug { get; set; } = string.Empty;
        public string StatusDisplay { get; set; } = string.Empty;
        public string Lang { get; set; } = string.Empty;
        public string Timestamp { get; set; } = "0";
    }
}
