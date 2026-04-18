using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSWPService.Migrations
{
    /// <inheritdoc />
    public partial class RenameTableMCAsToMCA : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MCAs",
                table: "MCAs");

            migrationBuilder.RenameTable(
                name: "MCAs",
                newName: "MCA");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MCA",
                table: "MCA",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MCA",
                table: "MCA");

            migrationBuilder.RenameTable(
                name: "MCA",
                newName: "MCAs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MCAs",
                table: "MCAs",
                column: "Id");
        }
    }
}
