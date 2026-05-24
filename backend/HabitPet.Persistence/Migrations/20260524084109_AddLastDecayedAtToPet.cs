using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitPet.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLastDecayedAtToPet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsMastered",
                table: "UserHabits",
                type: "bit",
                nullable: true,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastDecayedAt",
                table: "Pets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastDecayedAt",
                table: "Pets");

            migrationBuilder.AlterColumn<bool>(
                name: "IsMastered",
                table: "UserHabits",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: false);
        }
    }
}
