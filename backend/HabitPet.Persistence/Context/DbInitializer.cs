using HabitPet.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace HabitPet.Persistence.Context
{
    public static class DbInitializer
    {
        public static void Initialize(HabitPetDbContext context)
        {
            context.Database.Migrate();

            var health = EnsureCategory(context, "Health & Fitness", "#ff8624");
            var mind = EnsureCategory(context, "Mind & Focus", "#4A6070");
            var prod = EnsureCategory(context, "Productivity", "#437F70");
            var finance = EnsureCategory(context, "Finance", "#2e7d32");
            var social = EnsureCategory(context, "Social & Family", "#c2185b");
            var selfCare = EnsureCategory(context, "Self-Care", "#7b1fa2");
            var learning = EnsureCategory(context, "Learning & Skills", "#0288d1");
            var hobbies = EnsureCategory(context, "Hobbies & Creative", "#f57c00");
            var home = EnsureCategory(context, "Home & Organization", "#607d8b");
            var gen = EnsureCategory(context, "General", "#111111");

            if (!context.Habits.Any())
            {
                var habits = new[]
                {
                    new Habit { Title = "Drink Water", Description = "Hydrate your body, keep active.", IsPositive = true, Difficulty = 1, DefaultDayMask = 127, CategoryId = health.CategoryId },
                    new Habit { Title = "Morning Meditation", Description = "Breathe in peace, exhale tension.", IsPositive = true, Difficulty = 2, DefaultDayMask = 127, CategoryId = mind.CategoryId },
                    new Habit { Title = "Organize Workspace", Description = "Clear space leads to clear focus.", IsPositive = true, Difficulty = 1, DefaultDayMask = 127, CategoryId = prod.CategoryId },
                    new Habit { Title = "Track Budget", Description = "Log daily expenses to build wealth.", IsPositive = true, Difficulty = 2, DefaultDayMask = 127, CategoryId = finance.CategoryId },
                    new Habit { Title = "Call Family", Description = "Connect with loved ones regularly.", IsPositive = true, Difficulty = 1, DefaultDayMask = 127, CategoryId = social.CategoryId },
                    new Habit { Title = "Skin Care Routine", Description = "Nourish your skin morning and night.", IsPositive = true, Difficulty = 1, DefaultDayMask = 127, CategoryId = selfCare.CategoryId },
                    new Habit { Title = "Read 10 Pages", Description = "Nourish your mind with a good book.", IsPositive = true, Difficulty = 2, DefaultDayMask = 127, CategoryId = learning.CategoryId },
                    new Habit { Title = "Creative Drawing", Description = "Express yourself through art.", IsPositive = true, Difficulty = 2, DefaultDayMask = 127, CategoryId = hobbies.CategoryId },
                    new Habit { Title = "Clean Room", Description = "A tidy space brings a calm mind.", IsPositive = true, Difficulty = 1, DefaultDayMask = 127, CategoryId = home.CategoryId },
                    new Habit { Title = "Custom Practice", Description = "Define your own daily ritual.", IsPositive = true, Difficulty = 2, DefaultDayMask = 127, CategoryId = gen.CategoryId }
                };

                context.Habits.AddRange(habits);
                context.SaveChanges();
            }

            if (!context.Achievements.Any())
            {
                context.Achievements.AddRange(new[]
                {
                    // Rituals Category
                    new Achievement { Title = "First Breath", Description = "Complete your first habit.", TypeCondition = "TotalHabitsDone", ValueCondition = 1, Icon = "spa", XpReward = 30, Category = "Ritual", Rarity = "Very Easy" },
                    new Achievement { Title = "Daily Path", Description = "Complete 10 habits.", TypeCondition = "TotalHabitsDone", ValueCondition = 10, Icon = "directions_walk", XpReward = 75, Category = "Ritual", Rarity = "Easy" },
                    new Achievement { Title = "Deep Ritual", Description = "Complete 50 habits.", TypeCondition = "TotalHabitsDone", ValueCondition = 50, Icon = "self_improvement", XpReward = 200, Category = "Ritual", Rarity = "Medium" },
                    new Achievement { Title = "Way of the Sage", Description = "Complete 150 habits.", TypeCondition = "TotalHabitsDone", ValueCondition = 150, Icon = "psychology", XpReward = 400, Category = "Ritual", Rarity = "Hard" },
                    new Achievement { Title = "Infinite Stream", Description = "Complete 500 habits.", TypeCondition = "TotalHabitsDone", ValueCondition = 500, Icon = "all_inclusive", XpReward = 1000, Category = "Ritual", Rarity = "Super Hard" },
                    new Achievement { Title = "Inner Peace", Description = "Successfully avoid a negative habit for the first time.", TypeCondition = "AvoidHabitsDone", ValueCondition = 1, Icon = "shield", XpReward = 50, Category = "Ritual", Rarity = "Very Easy" },
                    new Achievement { Title = "Shield of Will", Description = "Successfully avoid negative habits 15 times.", TypeCondition = "AvoidHabitsDone", ValueCondition = 15, Icon = "security", XpReward = 250, Category = "Ritual", Rarity = "Medium" },
                    new Achievement { Title = "First Awakening", Description = "Master your first habit.", TypeCondition = "TotalHabitsMastered", ValueCondition = 1, Icon = "brightness_5", XpReward = 150, Category = "Ritual", Rarity = "Easy" },
                    new Achievement { Title = "Zen Master", Description = "Master 5 habits.", TypeCondition = "TotalHabitsMastered", ValueCondition = 5, Icon = "workspace_premium", XpReward = 500, Category = "Ritual", Rarity = "Hard" },
                    new Achievement { Title = "Mountain Stability", Description = "Master 10 habits.", TypeCondition = "TotalHabitsMastered", ValueCondition = 10, Icon = "filter_hdr", XpReward = 1000, Category = "Ritual", Rarity = "Super Hard" },

                    // Companion Category
                    new Achievement { Title = "Kind Heart", Description = "Feed your companion hamster 5 times.", TypeCondition = "TotalTimesFed", ValueCondition = 5, Icon = "restaurant", XpReward = 30, Category = "Companion", Rarity = "Very Easy" },
                    new Achievement { Title = "Generous Provider", Description = "Feed your companion hamster 30 times.", TypeCondition = "TotalTimesFed", ValueCondition = 30, Icon = "local_dining", XpReward = 200, Category = "Companion", Rarity = "Medium" },
                    new Achievement { Title = "Playful Spirit", Description = "Play with your companion hamster 5 times.", TypeCondition = "TotalTimesPlayed", ValueCondition = 5, Icon = "sports_esports", XpReward = 30, Category = "Companion", Rarity = "Very Easy" },
                    new Achievement { Title = "Soul Connection", Description = "Play with your companion hamster 30 times.", TypeCondition = "TotalTimesPlayed", ValueCondition = 30, Icon = "favorite", XpReward = 200, Category = "Companion", Rarity = "Medium" },
                    new Achievement { Title = "Pure Harmony", Description = "Reach a Pet Care Score of 100%.", TypeCondition = "CareScore", ValueCondition = 100, Icon = "favorite_border", XpReward = 300, Category = "Companion", Rarity = "Hard" },

                    // Journey Category
                    new Achievement { Title = "Quiet Steps", Description = "Stay active on the platform for 3 days.", TypeCondition = "TotalDaysActive", ValueCondition = 3, Icon = "calendar_today", XpReward = 30, Category = "Journey", Rarity = "Very Easy" },
                    new Achievement { Title = "Habitual Flow", Description = "Stay active on the platform for 10 days.", TypeCondition = "TotalDaysActive", ValueCondition = 10, Icon = "date_range", XpReward = 100, Category = "Journey", Rarity = "Easy" },
                    new Achievement { Title = "Dedicated Disciple", Description = "Stay active on the platform for 30 days.", TypeCondition = "TotalDaysActive", ValueCondition = 30, Icon = "event_available", XpReward = 300, Category = "Journey", Rarity = "Medium" },
                    new Achievement { Title = "Ascended Traveler", Description = "Reach Level 10.", TypeCondition = "CurrentLevel", ValueCondition = 10, Icon = "trending_up", XpReward = 400, Category = "Journey", Rarity = "Hard" },
                    new Achievement { Title = "Enlightened Spirit", Description = "Earn 10,000 total lifetime XP.", TypeCondition = "TotalXpEarned", ValueCondition = 10000, Icon = "auto_awesome", XpReward = 1000, Category = "Journey", Rarity = "Super Hard" }
                });
                context.SaveChanges();
            }
        }

        private static Category EnsureCategory(HabitPetDbContext context, string name, string color)
        {
            var cat = context.Categories.FirstOrDefault(c => c.Name == name);
            if (cat == null)
            {
                cat = new Category { Name = name, Color = color };
                context.Categories.Add(cat);
                context.SaveChanges();
            }
            return cat;
        }
    }
}
