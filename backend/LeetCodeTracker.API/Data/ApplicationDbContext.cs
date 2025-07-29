using LeetCodeTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LeetCodeTracker.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<LeetCodeStats> LeetCodeStats { get; set; }
    public DbSet<Competitor> Competitors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.LeetCodeUsername).HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.LeetCodeUsername).IsUnique();
        });

        // LeetCodeStats entity
        modelBuilder.Entity<LeetCodeStats>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Username).IsUnique();
            
            entity.HasOne(e => e.User)
                  .WithOne(u => u.LeetCodeStats)
                  .HasForeignKey<LeetCodeStats>(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Competitor entity
        modelBuilder.Entity<Competitor>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.LeetCodeUsername).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Competitors)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.UserId, e.LeetCodeUsername }).IsUnique();
        });
    }
}