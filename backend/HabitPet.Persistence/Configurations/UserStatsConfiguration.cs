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
    public class UserStatsConfiguration : IEntityTypeConfiguration<UserStats>
    {
        public void Configure(EntityTypeBuilder<UserStats> builder)
        {
            builder.HasKey(s => s.UserStatId);

            builder.Property(s => s.CurrentXp).HasDefaultValue(0);
            builder.Property(s => s.TotalXpEarned).HasDefaultValue(0);
            builder.Property(s => s.CurrentLevel).HasDefaultValue(1);
            builder.Property(s => s.XpToNextLevel).HasDefaultValue(100);
            builder.Property(s => s.TotalHabitsDone).HasDefaultValue(0);
            builder.Property(s => s.TotalDaysActive).HasDefaultValue(0);
        }
    }
}
