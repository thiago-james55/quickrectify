namespace QuickRectify.Models.Input
{
    public class DateFilterInputString
    {
        public String? Initial { get; set; }
        public String? Final { get; set; }

        public DateFilterInputString() { }

        public DateFilterInput ToDateFilterInput()
        {
            DateFilterInput dateFilterInput = new DateFilterInput();

            dateFilterInput.Initial = Initial != null ? DateTime.Parse(Initial) : null;
            dateFilterInput.Final = Final != null ? DateTime.Parse(Final) : null;

            return dateFilterInput;
        }

    }
}
