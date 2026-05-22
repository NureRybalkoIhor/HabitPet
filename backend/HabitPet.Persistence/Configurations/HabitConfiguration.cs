using HabitPet.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Persistence.Configurations
{
    public class HabitConfiguration : IEntityTypeConfiguration<Habit>
    {
        public void Configure(EntityTypeBuilder<Habit> builder)
        {
            builder.HasKey(h => h.HabitId);

            builder.Property(h => h.Title).IsRequired().HasMaxLength(100);
            builder.Property(h => h.Description).HasMaxLength(500);

            builder.HasOne(h => h.Category)
                .WithMany(c => c.Habits)
                .HasForeignKey(h => h.CategoryId);
        }
    }
}
