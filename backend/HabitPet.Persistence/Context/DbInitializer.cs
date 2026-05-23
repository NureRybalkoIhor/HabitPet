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
