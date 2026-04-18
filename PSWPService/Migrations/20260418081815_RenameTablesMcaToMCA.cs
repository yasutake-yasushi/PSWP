using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSWPService.Migrations
{
    /// <inheritdoc />
    public partial class RenameTablesMcaToMCA : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Mcas",
                table: "Mcas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_McaPatterns",
                table: "McaPatterns");

            migrationBuilder.RenameTable(
                name: "Mcas",
                newName: "MCAs");

            migrationBuilder.RenameTable(
                name: "McaPatterns",
                newName: "MCAPatterns");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MCAs",
                table: "MCAs",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MCAPatterns",
                table: "MCAPatterns",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MCAs",
                table: "MCAs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MCAPatterns",
                table: "MCAPatterns");

            migrationBuilder.RenameTable(
                name: "MCAs",
                newName: "Mcas");

            migrationBuilder.RenameTable(
                name: "MCAPatterns",
                newName: "McaPatterns");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Mcas",
                table: "Mcas",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_McaPatterns",
                table: "McaPatterns",
                column: "Id");
        }
    }
}
