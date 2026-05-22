using HabitPet.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Interfaces
{
    public interface IStreakRepository
    {
        Task<Streak?> GetByUserHabitIdAsync(int userHabitId);
        Task AddAsync(Streak streak);
        Task UpdateAsync(Streak streak);
    }
}
