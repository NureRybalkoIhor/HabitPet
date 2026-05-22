using HabitPet.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Interfaces
{
    public interface IUserHabitRepository
    {
        Task<IEnumerable<UserHabit>> GetByUserIdAsync(int userId);
        Task<UserHabit?> GetByIdAsync(int id);
        Task AddAsync(UserHabit userHabit);
        Task UpdateAsync(UserHabit userHabit);
        Task DeleteAsync(int id);
    }
}
