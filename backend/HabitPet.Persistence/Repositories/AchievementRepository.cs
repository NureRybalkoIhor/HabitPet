using HabitPet.Application.Interfaces;
using HabitPet.Domain.Entities;
using HabitPet.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Persistence.Repositories
{
    public class AchievementRepository : IAchievementRepository
    {
        private readonly HabitPetDbContext _context;

        public AchievementRepository(HabitPetDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Achievement>> GetAllAsync()
        {
            return await _context.Achievements.ToListAsync();
        }

        public async Task<IEnumerable<UserAchievement>> GetByUserIdAsync(int userId)
        {
            return await _context.UserAchievements
                .Include(ua => ua.Achievement)
                .Where(ua => ua.UserId == userId)
                .ToListAsync();
        }

        public async Task AddUserAchievementAsync(UserAchievement userAchievement)
        {
            await _context.UserAchievements.AddAsync(userAchievement);
            await _context.SaveChangesAsync();
        }
    }
}
