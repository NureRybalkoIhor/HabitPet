using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.DTOs
{
    public class AchievementDto
    {
        public int AchievementId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Rarity { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public int XpReward { get; set; }
        public int ValueCondition { get; set; }
        public bool IsUnlocked { get; set; }
        public DateTime? UnlockedAt { get; set; }
        public int CurrentProgress { get; set; }
    }
}
