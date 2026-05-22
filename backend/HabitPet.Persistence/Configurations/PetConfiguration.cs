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
    public class PetConfiguration : IEntityTypeConfiguration<Pet>
    {
        public void Configure(EntityTypeBuilder<Pet> builder)
        {
            builder.HasKey(p => p.PetId);

            builder.Property(p => p.Name).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Mood).HasDefaultValue(50);
            builder.Property(p => p.Hunger).HasDefaultValue(0);
            builder.Property(p => p.Happiness).HasDefaultValue(50);
            builder.Property(p => p.Health).HasDefaultValue(100);
        }
    }
}
