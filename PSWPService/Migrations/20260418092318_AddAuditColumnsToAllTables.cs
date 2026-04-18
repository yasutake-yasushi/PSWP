using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSWPService.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditColumnsToAllTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateTime",
                table: "SystemSettings",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdateUser",
                table: "SystemSettings",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateTime",
                table: "Strategies",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdateUser",
                table: "Strategies",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateTime",
                table: "MCAPatterns",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdateUser",
                table: "MCAPatterns",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateTime",
                table: "MCA",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdateUser",
                table: "MCA",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateTime",
                table: "MailSettings",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdateUser",
                table: "MailSettings",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdateTime",
                table: "SystemSettings");

            migrationBuilder.DropColumn(
                name: "UpdateUser",
                table: "SystemSettings");

            migrationBuilder.DropColumn(
                name: "UpdateTime",
                table: "Strategies");

            migrationBuilder.DropColumn(
                name: "UpdateUser",
                table: "Strategies");

            migrationBuilder.DropColumn(
                name: "UpdateTime",
                table: "MCAPatterns");

            migrationBuilder.DropColumn(
                name: "UpdateUser",
                table: "MCAPatterns");

            migrationBuilder.DropColumn(
                name: "UpdateTime",
                table: "MCA");

            migrationBuilder.DropColumn(
                name: "UpdateUser",
                table: "MCA");

            migrationBuilder.DropColumn(
                name: "UpdateTime",
                table: "MailSettings");

            migrationBuilder.DropColumn(
                name: "UpdateUser",
                table: "MailSettings");
        }
    }
}
