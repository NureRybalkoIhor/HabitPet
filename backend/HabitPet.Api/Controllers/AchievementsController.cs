using HabitPet.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HabitPet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AchievementsController : ControllerBase
    {
        private readonly AchievementService _achievementService;

        public AchievementsController(AchievementService achievementService)
        {
            _achievementService = achievementService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var achievements = await _achievementService.GetAllAchievementsAsync();
            return Ok(achievements);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserAchievements(int userId)
        {
            await _achievementService.CheckAndUnlockAllAsync(userId);
            var achievements = await _achievementService.GetUserAchievementsWithProgressAsync(userId);
            return Ok(achievements);
        }

        [HttpPost("{userId}/check")]
        public async Task<IActionResult> CheckAchievements(int userId, [FromQuery] string conditionType, [FromQuery] int currentValue)
        {
            await _achievementService.CheckAndUnlockAsync(userId, conditionType, currentValue);
            return Ok();
        }
    }
}
