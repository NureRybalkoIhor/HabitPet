using System;

namespace HabitPet.Application.DTOs
{
    public class PetActionDto
    {
        public int PetActionId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public int XpSpent { get; set; }
        public DateTime ActionTime { get; set; }
    }
}
