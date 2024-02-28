using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickRectify.Models
{
    [Index(nameof(Name), IsUnique = true)]
    [Index(nameof(Document), IsUnique = true)]
    public class Consumer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Document { get; set; }
        public string? Address { get; set; }
        [Required]
        public string Phone1 { get; set; }
        public string? Phone2 { get; set; }
        public string? Phone3 { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();

        public Consumer() { }

    }
}