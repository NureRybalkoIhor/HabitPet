using HabitPet.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Interfaces
{
    public interface IPetRepository
    {
        Task<Pet?> GetByUserIdAsync(int userId);
        Task AddAsync(Pet pet);
        Task UpdateAsync(Pet pet);
    }
}
