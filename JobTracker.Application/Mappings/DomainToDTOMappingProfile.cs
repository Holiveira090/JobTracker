using AutoMapper;
using JobTracker.Application.DTOs;
using JobTracker.Domain.Models;
using JobTracker.Domain.Models.Enums;

namespace JobTracker.Application.Mappings
{
    public class DomainToDTOMappingProfile : Profile
    {
        public DomainToDTOMappingProfile()
        {
            CreateMap<ApplicationNote, ApplicationNoteDTO>().ReverseMap();
            CreateMap<Company, CompanyDTO>().ReverseMap();
            CreateMap<Contact, ContactDTO>().ReverseMap();
            CreateMap<JobApplication, JobApplicationDTO>().ReverseMap();

            CreateMap<Role, RoleDTO>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Users != null ? src.Users.Select(u => u.Id) : new List<int>()))
                .ReverseMap()
                .ForMember(dest => dest.Users, opt => opt.Ignore());

            CreateMap<UserRegisterDTO, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.AuthProvider, opt => opt.MapFrom(src => AuthProvider.Credentials));
        }
    }
}