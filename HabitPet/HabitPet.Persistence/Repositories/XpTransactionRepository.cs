using HabitPet.Application.Interfaces;
using HabitPet.Domain.Entities;
using HabitPet.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Persistence.Repositories
{
    public class XpTransactionRepository : IXpTransactionRepository
    {
        private readonly HabitPetDbContext _context;

        public XpTransactionRepository(HabitPetDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<XpTransaction>> GetByUserIdAsync(int userId)
        {
            return await _context.XpTransactions
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task AddAsync(XpTransaction transaction)
        {
            await _context.XpTransactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
        }
    }
}
