using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class UserHabit
    {
        public int UserHabitId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsPositive { get; set; }
        public bool IsActive { get; set; }
        public bool? IsMastered { get; set; }
        public int Difficulty { get; set; }
        public int Priority { get; set; }
        public int DayMask { get; set; }
        public int HourMask { get; set; }
        public TimeOnly? ReminderTime { get; set; }
        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int HabitId { get; set; }
        public Habit Habit { get; set; } = null!;

        public Streak? Streak { get; set; }
        public ICollection<HabitHistory> History { get; set; } = new List<HabitHistory>();
        public ICollection<XpTransaction> XpTransactions { get; set; } = new List<XpTransaction>();
    }
}
