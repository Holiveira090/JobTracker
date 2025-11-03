using AutoMapper;
using JobTracker.Application.Interfaces;
using JobTracker.Domain.Interfaces;

namespace JobTracker.Application.Services
{
    public class Service<TDomain, TDto> : IService<TDto>
        where TDomain : class
        where TDto : class
    {
        protected readonly IRepository<TDomain> _repository;
        protected readonly IMapper _mapper;

        public Service(IRepository<TDomain> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<TDto>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<TDto>>(list);
        }

        public async Task<TDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _mapper.Map<TDto?>(entity);
        }

        public async Task<TDto> AddAsync(TDto dto)
        {
            var entity = _mapper.Map<TDomain>(dto);
            var added = await _repository.AddAsync(entity);
            return _mapper.Map<TDto>(added);
        }

        public async Task<TDto> UpdateAsync(TDto dto)
        {
            var entity = _mapper.Map<TDomain>(dto);
            var updated = await _repository.UpdateAsync(entity);
            return _mapper.Map<TDto>(updated);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity != null)
                await _repository.DeleteAsync(entity);
        }
    }
}
