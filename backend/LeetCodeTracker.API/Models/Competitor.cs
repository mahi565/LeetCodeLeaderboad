namespace LeetCodeTracker.API.Models;

public class Competitor
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string LeetCodeUsername { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User User { get; set; } = null!;
}