using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSWPService.Migrations
{
    /// <inheritdoc />
    public partial class AddContractItemUpdateUserTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "ContractItems");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "ContractItems",
                newName: "UpdateTime");

            migrationBuilder.AddColumn<string>(
                name: "UpdateUser",
                table: "ContractItems",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdateUser",
                table: "ContractItems");

            migrationBuilder.RenameColumn(
                name: "UpdateTime",
                table: "ContractItems",
                newName: "UpdatedAt");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "ContractItems",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
