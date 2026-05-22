using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class Streak
    {
        public int StreakId { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public DateOnly? LastCompletedDate { get; set; }

        public int UserHabitId { get; set; }
        public UserHabit UserHabit { get; set; } = null!;
    }
}
