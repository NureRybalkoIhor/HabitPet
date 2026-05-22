using HabitPet.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class HabitHistory
    {
        public int HabitHistoryId { get; set; }
        public DateOnly ActionDate { get; set; }
        public HabitStatus HabitStatus { get; set; }
        public string? UserNote { get; set; }
        public DateTime MarkedAt { get; set; }

        public int UserHabitId { get; set; }
        public UserHabit UserHabit { get; set; } = null!;
    }
}
