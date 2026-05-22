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
    public class StreakConfiguration : IEntityTypeConfiguration<Streak>
    {
        public void Configure(EntityTypeBuilder<Streak> builder)
        {
            builder.HasKey(s => s.StreakId);

            builder.Property(s => s.CurrentStreak).HasDefaultValue(0);
            builder.Property(s => s.LongestStreak).HasDefaultValue(0);

            builder.HasOne(s => s.UserHabit)
                .WithOne(uh => uh.Streak)
                .HasForeignKey<Streak>(s => s.UserHabitId);
        }
    }
}
