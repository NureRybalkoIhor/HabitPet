using HabitPet.Application.Interfaces;
using HabitPet.Domain.Entities;
using HabitPet.Identity.Models;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Json;
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
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(
            IUserRepository userRepository, 
            JwtService jwtService,
            IConfiguration configuration,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _configuration = configuration;
            _emailService = emailService;
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

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null) return true;

            var token = _jwtService.GenerateResetToken(user.Email);
            var frontendUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:3000";
            var resetLink = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(token)}";

            await _emailService.SendPasswordResetEmailAsync(user.Email, resetLink);
            return true;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var email = _jwtService.ValidateResetToken(request.Token);
            if (string.IsNullOrEmpty(email)) return false;

            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return false;

            user.PasswordHash = HashPassword(request.NewPassword);
            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<AuthResponse?> GoogleLoginAsync(GoogleLoginRequest request)
        {
            using var httpClient = new HttpClient();
            var response = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v3/userinfo?access_token={request.AccessToken}");
            if (!response.IsSuccessStatusCode) return null;

            var googleUser = await response.Content.ReadFromJsonAsync<GoogleUserInfo>();
            if (googleUser == null || string.IsNullOrEmpty(googleUser.Email)) return null;

            var user = await _userRepository.GetByEmailAsync(googleUser.Email);
            if (user == null)
            {
                var baseUsername = googleUser.Email.Split('@')[0];
                var username = baseUsername;
                int suffix = 1;
                while (await _userRepository.GetByUsernameAsync(username) != null)
                {
                    username = $"{baseUsername}{suffix++}";
                }

                user = new User
                {
                    FullName = googleUser.Name,
                    Email = googleUser.Email,
                    Username = username,
                    PasswordHash = "",
                    Birthday = DateTime.MinValue,
                    Sex = "",
                    AvatarUrl = googleUser.Picture,
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
            }
            else
            {
                user.LastLoginAt = DateTime.UtcNow;
                if (string.IsNullOrEmpty(user.AvatarUrl) && !string.IsNullOrEmpty(googleUser.Picture))
                {
                    user.AvatarUrl = googleUser.Picture;
                }
                await _userRepository.UpdateAsync(user);
            }

            var token = _jwtService.GenerateToken(user.UserId, user.Email, user.Username);

            return new AuthResponse
            {
                Token = token,
                Expires = DateTime.UtcNow.AddHours(24),
                UserId = user.UserId,
                Username = user.Username
            };
        }
    }
}
