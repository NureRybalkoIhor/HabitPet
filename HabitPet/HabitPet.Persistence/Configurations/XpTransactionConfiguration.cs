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
    public class XpTransactionConfiguration : IEntityTypeConfiguration<XpTransaction>
    {
        public void Configure(EntityTypeBuilder<XpTransaction> builder)
        {
            builder.HasKey(x => x.XpTransactionId);

            builder.Property(x => x.XpAmount).IsRequired();
            builder.Property(x => x.TypeReason).IsRequired();
            builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");

            builder.HasOne(x => x.User)
                .WithMany(u => u.XpTransactions)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.UserHabit)
                .WithMany(uh => uh.XpTransactions)
                .HasForeignKey(x => x.UserHabitId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
