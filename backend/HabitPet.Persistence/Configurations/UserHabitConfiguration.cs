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
    public class UserHabitConfiguration : IEntityTypeConfiguration<UserHabit>
    {
        public void Configure(EntityTypeBuilder<UserHabit> builder)
        {
            builder.HasKey(uh => uh.UserHabitId);

            builder.Property(uh => uh.Title).IsRequired().HasMaxLength(100);
            builder.Property(uh => uh.Description).HasMaxLength(500);
            builder.Property(uh => uh.IsActive).HasDefaultValue(true);
            builder.Property(uh => uh.IsMastered).HasDefaultValue(false);
            builder.Property(uh => uh.CreatedAt).HasDefaultValueSql("GETDATE()");

            builder.HasOne(uh => uh.User)
                .WithMany(u => u.UserHabits)
                .HasForeignKey(uh => uh.UserId);

            builder.HasOne(uh => uh.Habit)
                .WithMany(h => h.UserHabits)
                .HasForeignKey(uh => uh.HabitId);
        }
    }
}
