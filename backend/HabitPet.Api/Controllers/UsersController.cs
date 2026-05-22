using HabitPet.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HabitPet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IWebHostEnvironment _env;

        public UsersController(IUserRepository userRepository, IWebHostEnvironment env)
        {
            _userRepository = userRepository;
            _env = env;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.UserId,
                user.FullName,
                user.Username,
                user.Email,
                user.AvatarUrl
            });
        }

        [HttpPost("{userId}/avatar")]
        public async Task<IActionResult> UploadAvatar(int userId, IFormFile file)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound();

            if (file == null || file.Length == 0)
                return BadRequest("No file provided.");

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType))
                return BadRequest("Only JPEG, PNG, WebP allowed.");

            var uploadsFolder = Path.Combine(_env.WebRootPath, "avatars");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.AvatarUrl = $"/avatars/{fileName}";
            await _userRepository.UpdateAsync(user);

            return Ok(new { avatarUrl = user.AvatarUrl });
        }
    }
}
