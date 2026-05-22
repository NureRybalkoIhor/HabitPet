using HabitPet.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Persistence.Context
{
    public class HabitPetDbContext : DbContext
    {
        public HabitPetDbContext(DbContextOptions<HabitPetDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserStats> UserStats { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<UserHabit> UserHabits { get; set; }
        public DbSet<HabitHistory> HabitHistories { get; set; }
        public DbSet<Streak> Streaks { get; set; }
        public DbSet<XpTransaction> XpTransactions { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<PetAction> PetActions { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<UserAchievement> UserAchievements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(HabitPetDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}
