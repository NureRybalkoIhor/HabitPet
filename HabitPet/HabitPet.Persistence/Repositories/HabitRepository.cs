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
    public class HabitRepository : IHabitRepository
    {
        private readonly HabitPetDbContext _context;

        public HabitRepository(HabitPetDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Habit>> GetAllAsync()
        {
            return await _context.Habits
                .Include(h => h.Category)
                .ToListAsync();
        }

        public async Task<Habit?> GetByIdAsync(int id)
        {
            return await _context.Habits
                .Include(h => h.Category)
                .FirstOrDefaultAsync(h => h.HabitId == id);
        }

        public async Task AddAsync(Habit habit)
        {
            await _context.Habits.AddAsync(habit);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Habit habit)
        {
            _context.Habits.Update(habit);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var habit = await _context.Habits.FindAsync(id);
            if (habit != null)
            {
                _context.Habits.Remove(habit);
                await _context.SaveChangesAsync();
            }
        }
    }
}
