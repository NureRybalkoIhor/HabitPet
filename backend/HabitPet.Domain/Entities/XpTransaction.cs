using HabitPet.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Domain.Entities
{
    public class XpTransaction
    {
        public int XpTransactionId { get; set; }
        public int XpAmount { get; set; }
        public XpReasonType TypeReason { get; set; }
        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int? UserHabitId { get; set; }
        public UserHabit? UserHabit { get; set; }
    }
}
