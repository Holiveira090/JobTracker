namespace JobTracker.Application.Interfaces
{
    public interface IService<T> where T : class
    {
        Task<T> AddAsync(T dto);
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> UpdateAsync(T dto);
        Task DeleteAsync(int id);
    }
}
