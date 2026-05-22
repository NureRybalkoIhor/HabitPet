using HabitPet.Application.Interfaces;
using HabitPet.Domain.Entities;
using HabitPet.Identity.Models;
using System.Security.Cryptography;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Identity.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;

        public AuthService(IUserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null) return null;

            var hash = HashPassword(request.Password);
            if (user.PasswordHash != hash) return null;

            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            var token = _jwtService.GenerateToken(user.UserId, user.Email, user.Username);

            return new AuthResponse
            {
                Token = token,
                Expires = DateTime.UtcNow.AddHours(24),
                UserId = user.UserId,
                Username = user.Username
            };
        }

        public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
        {
            var existing = await _userRepository.GetByEmailAsync(request.Email);
            if (existing != null) return null;

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Username = request.Username,
                PasswordHash = HashPassword(request.Password),
                Birthday = request.Birthday,
                Sex = request.Sex,
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow,
                Stats = new UserStats
                {
                    CurrentXp = 0,
                    TotalXpEarned = 0,
                    CurrentLevel = 1,
                    XpToNextLevel = 100,
                    TotalHabitsDone = 0,
                    TotalDaysActive = 0
                },
                Pet = new Pet
                {
                    Name = "HabitPet",
                    Mood = 50,
                    Hunger = 0,
                    Happiness = 50,
                    Health = 100
                }
            };

            await _userRepository.AddAsync(user);

            var token = _jwtService.GenerateToken(user.UserId, user.Email, user.Username);

            return new AuthResponse
            {
                Token = token,
                Expires = DateTime.UtcNow.AddHours(24),
                UserId = user.UserId,
                Username = user.Username
            };
        }

        private string HashPassword(string password)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
