using HabitPet.Application.Interfaces;
using HabitPet.Domain.Entities;
using HabitPet.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Services
{
    public class PetService
    {
        private readonly IPetRepository _petRepository;
        private readonly XpService _xpService;

        public PetService(IPetRepository petRepository, XpService xpService)
        {
            _petRepository = petRepository;
            _xpService = xpService;
        }

        public async Task<Pet?> GetPetAsync(int userId)
        {
            return await _petRepository.GetByUserIdAsync(userId);
        }

        public async Task FeedPetAsync(int userId, int xpCost)
        {
            var pet = await _petRepository.GetByUserIdAsync(userId);
            if (pet == null) return;

            pet.Hunger = Math.Max(0, pet.Hunger - 30);
            pet.Happiness = Math.Min(100, pet.Happiness + 10);
            pet.LastFedAt = DateTime.UtcNow;

            pet.PetActions.Add(new PetAction
            {
                ActionType = PetActionType.Feed,
                XpSpent = xpCost,
                ActionTime = DateTime.UtcNow,
                PetId = pet.PetId
            });

            await _petRepository.UpdateAsync(pet);
            await _xpService.AddXpAsync(userId, -xpCost, XpReasonType.HabitDone);
        }

        public async Task PlayWithPetAsync(int userId, int xpCost)
        {
            var pet = await _petRepository.GetByUserIdAsync(userId);
            if (pet == null) return;

            pet.Happiness = Math.Min(100, pet.Happiness + 20);
            pet.Mood = Math.Min(100, pet.Mood + 15);
            pet.LastPlayedAt = DateTime.UtcNow;

            pet.PetActions.Add(new PetAction
            {
                ActionType = PetActionType.Play,
                XpSpent = xpCost,
                ActionTime = DateTime.UtcNow,
                PetId = pet.PetId
            });

            await _petRepository.UpdateAsync(pet);
            await _xpService.AddXpAsync(userId, -xpCost, XpReasonType.HabitDone);
        }

        public async Task DecayPetAsync(int userId)
        {
            var pet = await _petRepository.GetByUserIdAsync(userId);
            if (pet == null) return;

            pet.Hunger = Math.Min(100, pet.Hunger + 2);
            pet.Happiness = Math.Max(0, pet.Happiness - 1);

            if (pet.Hunger > 80)
                pet.Health = Math.Max(0, pet.Health - 5);

            await _petRepository.UpdateAsync(pet);
        }
    }
}
