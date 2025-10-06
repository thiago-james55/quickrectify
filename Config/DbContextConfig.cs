using Microsoft.EntityFrameworkCore;
using QuickRectify.Models;

namespace QuickRectify.Config
{
    public class DbContextConfig : DbContext
    {

        public static readonly string ConnectionURL = "server=mysql;port=3306;database=quickrectify;user=root;password=root";
     
        public DbSet<Order> Orders { get; set; }
        public DbSet<Consumer> Consumers { get; set; }
        public DbSet<Part> Parts { get; set; }

        public DbContextConfig(DbContextOptions<DbContextConfig> options) : base(options) { 
        
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Part>()
                .HasOne(p => p.Order)
                .WithMany(o => o.Parts)
                .HasForeignKey(p => p.OrderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Consumer)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.ConsumerId)
                .IsRequired();

            modelBuilder.Entity<Consumer>()
                .HasMany(c => c.Orders)
                .WithOne(o => o.Consumer)
                .HasForeignKey(o => o.ConsumerId)
                .OnDelete(DeleteBehavior.Restrict);
        }



    }
}
