using HabitPet.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Interfaces
{
    public interface IAchievementRepository
    {
        Task<IEnumerable<Achievement>> GetAllAsync();
        Task<IEnumerable<UserAchievement>> GetByUserIdAsync(int userId);
        Task AddUserAchievementAsync(UserAchievement userAchievement);
    }
}
