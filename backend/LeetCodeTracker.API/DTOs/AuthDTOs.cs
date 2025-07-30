using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LeetCodeTracker.API.DTOs
{
    public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("leetCodeUsername")]
    public string LeetCodeUsername { get; set; } = string.Empty;
}

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;

        [JsonPropertyName("user")]
        public UserDto User { get; set; } = null!;
    }

    public class UserDto
    {
        public int Id { get; set; }

        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("leetcodeUsername")]
        public string? LeetCodeUsername { get; set; }
    }
}
