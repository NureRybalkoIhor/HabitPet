using HabitPet.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Interfaces
{
    public interface IXpTransactionRepository
    {
        Task<IEnumerable<XpTransaction>> GetByUserIdAsync(int userId);
        Task AddAsync(XpTransaction transaction);
    }
}
