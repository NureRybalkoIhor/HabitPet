using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class Achievement
    {
        public int AchievementId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string TypeCondition { get; set; } = string.Empty;
        public int ValueCondition { get; set; }
        public string Icon { get; set; } = string.Empty;
        public int XpReward { get; set; }

        public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
    }
}
