using LeetCodeTracker.API.Data;
using LeetCodeTracker.API.DTOs;
using LeetCodeTracker.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LeetCodeTracker.API.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return null;

        if (!string.IsNullOrEmpty(request.LeetCodeUsername) && 
            await _context.Users.AnyAsync(u => u.LeetCodeUsername == request.LeetCodeUsername))
            return null;

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            LeetCodeUsername = request.LeetCodeUsername
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            Token = GenerateJwtToken(user),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                LeetCodeUsername = user.LeetCodeUsername
            }
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        return new AuthResponse
        {
            Token = GenerateJwtToken(user),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                LeetCodeUsername = user.LeetCodeUsername
            }
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        return user == null ? null : new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            LeetCodeUsername = user.LeetCodeUsername
        };
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var secret = _configuration["JwtSettings:SecretKey"];
        var expiryStr = _configuration["JwtSettings:ExpiryInHours"];

        if (string.IsNullOrEmpty(secret))
            throw new Exception("JWT SecretKey missing in appsettings.json");

        if (string.IsNullOrEmpty(expiryStr))
            throw new Exception("JWT ExpiryInHours missing in appsettings.json");

        var key = Encoding.ASCII.GetBytes(secret);
        var expiry = double.Parse(expiryStr);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddHours(expiry),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
