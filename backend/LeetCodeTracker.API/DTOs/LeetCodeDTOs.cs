namespace LeetCodeTracker.API.DTOs;

public class LeetCodeStatsDto
{
    public string Username { get; set; } = string.Empty;

    public int TotalSolved { get; set; }
    public int TotalSubmissions { get; set; }

    public int EasySolved { get; set; }
    public int MediumSolved { get; set; }
    public int HardSolved { get; set; }

    public int TotalEasy { get; set; }
    public int TotalMedium { get; set; }
    public int TotalHard { get; set; }

    public int EasySubmissions { get; set; }
    public int MediumSubmissions { get; set; }
    public int HardSubmissions { get; set; }

    public int AcceptanceRate { get; set; }
    public int Ranking { get; set; }
    public int ContestRating { get; set; }
    public int ContestGlobalRanking { get; set; }

    public int ContributionPoints { get; set; }
    public int Reputation { get; set; }

    public DateTime LastUpdated { get; set; }

    public List<RecentSubmissionDto> RecentSubmissions { get; set; } = new();
    public Dictionary<long, int> SubmissionCalendar { get; set; } = new();
}

public class RecentSubmissionDto
{
    public string Title { get; set; } = string.Empty;
    public string TitleSlug { get; set; } = string.Empty;
    public string StatusDisplay { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public long Timestamp { get; set; }
}

public class CompetitorDto
{
    public int Id { get; set; }
    public string LeetCodeUsername { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public DateTime AddedAt { get; set; }
}

public class AddCompetitorRequest
{
    public string LeetCodeUsername { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
}

public class LeaderboardEntry
{
    public string Username { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public int TotalSolved { get; set; }
    public int ContestRating { get; set; }
    public int Ranking { get; set; }
    public bool IsCurrentUser { get; set; }
}
