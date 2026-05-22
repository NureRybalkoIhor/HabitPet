using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class Pet
    {
        public int PetId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Mood { get; set; }
        public int Hunger { get; set; }
        public int Happiness { get; set; }
        public int Health { get; set; }
        public DateTime LastFedAt { get; set; }
        public DateTime LastPlayedAt { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public ICollection<PetAction> PetActions { get; set; } = new List<PetAction>();
    }
}
