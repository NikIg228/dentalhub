namespace StomST.Interfaces
{
    public interface IAccountInterface
    {
        int GetEmployeeId(string userName, string password);
        List<string> GetRoles(int employeeId);
        int GetDentistryId(int employeeId);
    }
}
