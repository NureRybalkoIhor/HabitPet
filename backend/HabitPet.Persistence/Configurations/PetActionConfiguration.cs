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
    public class PetActionConfiguration : IEntityTypeConfiguration<PetAction>
    {
        public void Configure(EntityTypeBuilder<PetAction> builder)
        {
            builder.HasKey(p => p.PetActionId);

            builder.Property(p => p.ActionType).IsRequired();
            builder.Property(p => p.XpSpent).IsRequired();
            builder.Property(p => p.ActionTime).HasDefaultValueSql("GETDATE()");

            builder.HasOne(p => p.Pet)
                .WithMany(p => p.PetActions)
                .HasForeignKey(p => p.PetId);
        }
    }
}
