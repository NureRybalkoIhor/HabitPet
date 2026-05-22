using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class UserAchievement
    {
        public int UserAchievementId { get; set; }
        public DateTime UnlockedAt { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int AchievementId { get; set; }
        public Achievement Achievement { get; set; } = null!;
    }
}
