using HabitPet.Application.Interfaces;
using HabitPet.Identity.Services;
using HabitPet.Infrastructure.Services;
using HabitPet.Identity.Models;
using Microsoft.AspNetCore.Mvc;

namespace HabitPet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly OtpService _otpService;
        private readonly IEmailService _emailService;

        public AuthController(AuthService authService, OtpService otpService, IEmailService emailService)
        {
            _authService = authService;
            _otpService = otpService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);
            if (result == null)
                return BadRequest("Користувач з таким email вже існує.");
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            if (result == null)
                return Unauthorized("Невірний email або пароль.");
            return Ok(result);
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            var code = _otpService.GenerateAndStore(request.Email);
            await _emailService.SendOtpAsync(request.Email, code);
            return Ok();
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var isValid = _otpService.Verify(request.Email, request.Code);
            if (!isValid) return BadRequest("Invalid or expired code.");
            return Ok();
        }
    }
}
