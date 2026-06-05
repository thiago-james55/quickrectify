using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuickRectify.Migrations
{
    /// <inheritdoc />
    public partial class AddBalanceOrderRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "Balances",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Balances_OrderId",
                table: "Balances",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Balances_Orders_OrderId",
                table: "Balances",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Balances_Orders_OrderId",
                table: "Balances");

            migrationBuilder.DropIndex(
                name: "IX_Balances_OrderId",
                table: "Balances");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "Balances");
        }
    }
}
