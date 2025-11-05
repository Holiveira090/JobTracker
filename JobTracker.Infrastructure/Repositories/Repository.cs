using JobTracker.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task<T?> GetByIdAsync(int id) =>
            await _dbSet.FindAsync(id);

        public virtual async Task<IEnumerable<T>> GetAllAsync() =>
            await _dbSet.ToListAsync();

        public virtual async Task<T> UpdateAsync(T entity)
        {
            var entry = _context.Entry(entity);

            if (entry.State == EntityState.Detached)
            {
                var keyProperty = typeof(T).GetProperty("Id");
                if (keyProperty != null)
                {
                    var id = (int)keyProperty.GetValue(entity)!;

                    var existingEntity = await _dbSet.FindAsync(id);
                    if (existingEntity != null)
                    {
                        _context.Entry(existingEntity).State = EntityState.Detached;
                    }
                }

                _context.Attach(entity);
            }

            _context.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }


        public virtual async Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
