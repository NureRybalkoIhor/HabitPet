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
    public class StreakRepository : IStreakRepository
    {
        private readonly HabitPetDbContext _context;

        public StreakRepository(HabitPetDbContext context)
        {
            _context = context;
        }

        public async Task<Streak?> GetByUserHabitIdAsync(int userHabitId)
        {
            return await _context.Streaks
                .FirstOrDefaultAsync(s => s.UserHabitId == userHabitId);
        }

        public async Task AddAsync(Streak streak)
        {
            await _context.Streaks.AddAsync(streak);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Streak streak)
        {
            _context.Streaks.Update(streak);
            await _context.SaveChangesAsync();
        }
    }
}
