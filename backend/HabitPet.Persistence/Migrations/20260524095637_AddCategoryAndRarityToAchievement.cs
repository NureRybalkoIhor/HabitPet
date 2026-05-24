using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitPet.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryAndRarityToAchievement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Achievements",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Rarity",
                table: "Achievements",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "Rarity",
                table: "Achievements");
        }
    }
}
