using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class UserStats
    {
        public int UserStatId { get; set; }
        public int CurrentXp { get; set; }
        public int TotalXpEarned { get; set; }
        public int CurrentLevel { get; set; }
        public int XpToNextLevel { get; set; }
        public int TotalHabitsDone { get; set; }
        public int TotalDaysActive { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
