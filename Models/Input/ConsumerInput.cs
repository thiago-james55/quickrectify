using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuickRectify.Models
{

    public class ConsumerInput
    {

        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Document { get; set; }
        public string Address { get; set; }
        [Required]
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string Phone3 { get; set; }

        public ConsumerInput() { }

    }
}