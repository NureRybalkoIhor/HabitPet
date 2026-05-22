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
    public class HabitHistoryConfiguration : IEntityTypeConfiguration<HabitHistory>
    {
        public void Configure(EntityTypeBuilder<HabitHistory> builder)
        {
            builder.HasKey(h => h.HabitHistoryId);

            builder.Property(h => h.HabitStatus).IsRequired();
            builder.Property(h => h.UserNote).HasMaxLength(300);
            builder.Property(h => h.MarkedAt).HasDefaultValueSql("GETDATE()");

            builder.HasOne(h => h.UserHabit)
                .WithMany(uh => uh.History)
                .HasForeignKey(h => h.UserHabitId);
        }
    }
}
