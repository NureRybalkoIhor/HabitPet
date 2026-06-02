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
        private readonly AchievementService _achievementService;

        public PetService(
            IPetRepository petRepository,
            XpService xpService,
            AchievementService achievementService)
        {
            _petRepository = petRepository;
            _xpService = xpService;
            _achievementService = achievementService;
        }

        public async Task<Pet?> GetPetAsync(int userId)
        {
            var pet = await _petRepository.GetByUserIdAsync(userId);
            if (pet == null) return null;

            await CatchUpDecayAsync(pet);
            return pet;
        }

        public async Task FeedPetAsync(int userId, int xpCost)
        {
            var pet = await _petRepository.GetByUserIdAsync(userId);
            if (pet == null) return;

            await CatchUpDecayAsync(pet);

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
            await _xpService.AddXpAsync(userId, -xpCost, XpReasonType.PetFeed);
            await _achievementService.CheckAndUnlockAllAsync(userId);
        }

        public async Task PlayWithPetAsync(int userId, int xpCost)
        {
            var pet = await _petRepository.GetByUserIdAsync(userId);
            if (pet == null) return;

            await CatchUpDecayAsync(pet);

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
            await _xpService.AddXpAsync(userId, -xpCost, XpReasonType.PetPlay);
            await _achievementService.CheckAndUnlockAllAsync(userId);
        }

        public async Task DecayPetAsync(int userId)
        {
            var pet = await _petRepository.GetByUserIdAsync(userId);
            if (pet == null) return;

            pet.Hunger = Math.Min(100, pet.Hunger + 2);
            pet.Happiness = Math.Max(0, pet.Happiness - 1);
            pet.LastDecayedAt = DateTime.UtcNow;

            if (pet.Hunger > 80)
                pet.Health = Math.Max(0, pet.Health - 5);

            await _petRepository.UpdateAsync(pet);
        }

        public async Task CatchUpDecayAsync(Pet pet)
        {
            var now = DateTime.UtcNow;

            if (pet.LastDecayedAt == DateTime.MinValue || pet.LastDecayedAt > now)
            {
                pet.LastDecayedAt = now;
                await _petRepository.UpdateAsync(pet);
                return;
            }

            var elapsed = now - pet.LastDecayedAt;
            var elapsedHours = (int)elapsed.TotalHours;

            if (elapsedHours >= 1)
            {
                for (int i = 0; i < elapsedHours; i++)
                {
                    pet.Hunger = Math.Min(100, pet.Hunger + 2);
                    pet.Happiness = Math.Max(0, pet.Happiness - 1);

                    if (pet.Hunger > 80)
                    {
                        pet.Health = Math.Max(0, pet.Health - 5);
                    }
                }

                pet.LastDecayedAt = pet.LastDecayedAt.AddHours(elapsedHours);
                await _petRepository.UpdateAsync(pet);
            }
        }

        public async Task<IEnumerable<PetAction>> GetPetActionsAsync(int userId)
        {
            var pet = await _petRepository.GetByUserIdAsync(userId);
            if (pet == null) return Enumerable.Empty<PetAction>();
            return pet.PetActions.OrderByDescending(pa => pa.ActionTime).ToList();
        }

        public async Task<bool> UpdatePetNameAsync(int petId, string newName)
        {
            var pet = await _petRepository.GetByIdAsync(petId);
            if (pet == null) return false;

            pet.Name = newName;
            await _petRepository.UpdateAsync(pet);
            return true;
        }
    }
}
