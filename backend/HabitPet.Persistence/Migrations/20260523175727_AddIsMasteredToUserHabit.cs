using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitPet.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsMasteredToUserHabit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsMastered",
                table: "UserHabits",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMastered",
                table: "UserHabits");
        }
    }
}
