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
    public class UserHabitRepository : IUserHabitRepository
    {
        private readonly HabitPetDbContext _context;

        public UserHabitRepository(HabitPetDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserHabit>> GetByUserIdAsync(int userId)
        {
            return await _context.UserHabits
                .Include(uh => uh.Habit)
                .Include(uh => uh.Streak)
                .Where(uh => uh.UserId == userId && uh.IsActive)
                .ToListAsync();
        }

        public async Task<UserHabit?> GetByIdAsync(int id)
        {
            return await _context.UserHabits
                .Include(uh => uh.Streak)
                .FirstOrDefaultAsync(uh => uh.UserHabitId == id);
        }

        public async Task AddAsync(UserHabit userHabit)
        {
            await _context.UserHabits.AddAsync(userHabit);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(UserHabit userHabit)
        {
            _context.UserHabits.Update(userHabit);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var habit = await _context.UserHabits.FindAsync(id);
            if (habit != null)
            {
                _context.UserHabits.Remove(habit);
                await _context.SaveChangesAsync();
            }
        }
    }
}
