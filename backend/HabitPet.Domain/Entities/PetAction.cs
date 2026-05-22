using HabitPet.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class PetAction
    {
        public int PetActionId { get; set; }
        public PetActionType ActionType { get; set; }
        public int XpSpent { get; set; }
        public DateTime ActionTime { get; set; }

        public int PetId { get; set; }
        public Pet Pet { get; set; } = null!;
    }
}
