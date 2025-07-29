namespace LeetCodeTracker.API.Models;

public class LeetCodeStats
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public int TotalSolved { get; set; }
    public int EasySolved { get; set; }
    public int MediumSolved { get; set; }
    public int HardSolved { get; set; }
    public int AcceptanceRate { get; set; }
    public int Ranking { get; set; }
    public int ContestRating { get; set; }
    public int ContestGlobalRanking { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User User { get; set; } = null!;
}