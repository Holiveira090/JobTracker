using JobTracker.Domain.Models.Enums;

namespace JobTracker.Domain.Models
{
    public class ApplicationNote
    {
        public int Id { get; private set; }
        public int JobApplicationId { get; private set; }
        public JobApplication? JobApplication { get; private set; }
        public NoteType Type { get; private set; }
        public string? Content { get; private set; }
    }
}
