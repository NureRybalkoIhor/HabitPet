using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.DTOs
{
    public class CreateUserHabitDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsPositive { get; set; }
        public int Difficulty { get; set; }
        public int Priority { get; set; }
        public int DayMask { get; set; }
        public int HourMask { get; set; }
        public TimeOnly? ReminderTime { get; set; }
        public int HabitId { get; set; }
    }
}
