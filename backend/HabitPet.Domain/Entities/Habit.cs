using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class Habit
    {
        public int HabitId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsPositive { get; set; }
        public int Difficulty { get; set; }
        public int DefaultDayMask { get; set; }
        public int DefaultHourMask { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<UserHabit> UserHabits { get; set; } = new List<UserHabit>();
    }
}
