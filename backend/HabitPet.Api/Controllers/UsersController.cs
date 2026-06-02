using HabitPet.Application.Interfaces;
using HabitPet.Application.DTOs;
using HabitPet.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace HabitPet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserHabitRepository _userHabitRepository;
        private readonly IXpTransactionRepository _xpTransactionRepository;
        private readonly IWebHostEnvironment _env;

        public UsersController(
            IUserRepository userRepository, 
            IUserHabitRepository userHabitRepository, 
            IXpTransactionRepository xpTransactionRepository,
            IWebHostEnvironment env)
        {
            _userRepository = userRepository;
            _userHabitRepository = userHabitRepository;
            _xpTransactionRepository = xpTransactionRepository;
            _env = env;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound();

            var habits = await _userHabitRepository.GetByUserIdAsync(userId);
            var totalHabitsDone = habits.Count(h => h.IsMastered == true);

            return Ok(new
            {
                user.UserId,
                user.FullName,
                user.Username,
                user.Email,
                user.AvatarUrl,
                Birthday = user.Birthday.ToString("yyyy-MM-dd"),
                user.Sex,
                Stats = user.Stats != null ? new
                {
                    user.Stats.CurrentXp,
                    user.Stats.TotalXpEarned,
                    user.Stats.CurrentLevel,
                    user.Stats.XpToNextLevel,
                    TotalHabitsDone = totalHabitsDone,
                    user.Stats.TotalDaysActive
                } : null
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

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] UpdateProfileRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound();

            if (!string.Equals(user.Username, request.Username, StringComparison.OrdinalIgnoreCase))
            {
                var existingUser = await _userRepository.GetByUsernameAsync(request.Username);
                if (existingUser != null && existingUser.UserId != userId)
                {
                    return BadRequest("Username is already taken.");
                }
            }

            if (!string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase))
            {
                var existingUser = await _userRepository.GetByEmailAsync(request.Email);
                if (existingUser != null && existingUser.UserId != userId)
                {
                    return BadRequest("Email is already registered.");
                }
            }

            user.FullName = request.FullName;
            user.Username = request.Username;
            user.Email = request.Email;
            user.Sex = request.Sex;
            user.Birthday = request.Birthday;

            await _userRepository.UpdateAsync(user);
            return Ok(new { message = "Profile updated successfully." });
        }

        [HttpPost("{userId}/change-password")]
        public async Task<IActionResult> ChangePassword(int userId, [FromBody] ChangePasswordRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound();

            var currentHash = HashPassword(request.CurrentPassword);
            if (user.PasswordHash != currentHash)
            {
                return BadRequest("Incorrect current password.");
            }

            user.PasswordHash = HashPassword(request.NewPassword);
            await _userRepository.UpdateAsync(user);

            return Ok(new { message = "Password changed successfully." });
        }

        private string HashPassword(string password)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        [HttpGet("{userId}/xp-transactions")]
        public async Task<IActionResult> GetXpTransactions(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound();

            var transactions = await _xpTransactionRepository.GetByUserIdAsync(userId);
            return Ok(transactions.Select(t => new
            {
                t.XpTransactionId,
                t.XpAmount,
                TypeReason = t.TypeReason.ToString(),
                t.CreatedAt,
                HabitTitle = t.UserHabit != null ? t.UserHabit.Title : null
            }));
        }
    }
}
