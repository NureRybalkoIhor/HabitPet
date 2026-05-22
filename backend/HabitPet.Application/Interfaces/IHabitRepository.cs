using HabitPet.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Interfaces
{
    public interface IHabitRepository
    {
        Task<IEnumerable<Habit>> GetAllAsync();
        Task<Habit?> GetByIdAsync(int id);
        Task AddAsync(Habit habit);
        Task UpdateAsync(Habit habit);
        Task DeleteAsync(int id);
    }
}
