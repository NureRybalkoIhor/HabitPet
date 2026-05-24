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
    public class PetRepository : IPetRepository
    {
        private readonly HabitPetDbContext _context;

        public PetRepository(HabitPetDbContext context)
        {
            _context = context;
        }

        public async Task<Pet?> GetByUserIdAsync(int userId)
        {
            return await _context.Pets
                .Include(p => p.PetActions)
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public async Task<Pet?> GetByIdAsync(int petId)
        {
            return await _context.Pets
                .Include(p => p.PetActions)
                .FirstOrDefaultAsync(p => p.PetId == petId);
        }

        public async Task AddAsync(Pet pet)
        {
            await _context.Pets.AddAsync(pet);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Pet pet)
        {
            _context.Pets.Update(pet);
            await _context.SaveChangesAsync();
        }
    }
}
