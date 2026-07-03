namespace StomST.Dtos
{
    public sealed record LoginRequestDto(string Username, string Password, bool Remember);

    public sealed record CurrentUserDto(
        string UserName,
        int EmployeeId,
        int DentistryId,
        IReadOnlyList<string> Roles);
}
