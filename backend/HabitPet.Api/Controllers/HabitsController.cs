using HabitPet.Application.DTOs;
using HabitPet.Application.Services;
using HabitPet.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace HabitPet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitsController : ControllerBase
    {
        private readonly HabitService _habitService;

        public HabitsController(HabitService habitService)
        {
            _habitService = habitService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserHabits(int userId)
        {
            var habits = await _habitService.GetUserHabitsAsync(userId);
            return Ok(habits);
        }

        [HttpGet("templates")]
        public async Task<IActionResult> GetHabitTemplates()
        {
            var templates = await _habitService.GetTemplatesAsync();
            return Ok(templates);
        }

        [HttpPost]
        public async Task<IActionResult> CreateHabit([FromBody] CreateUserHabitDto dto)
        {
            var userHabit = new UserHabit
            {
                UserId = dto.UserId,
                Title = dto.Title,
                Description = dto.Description,
                IsPositive = dto.IsPositive,
                Difficulty = dto.Difficulty,
                Priority = dto.Priority,
                DayMask = dto.DayMask,
                HourMask = dto.HourMask,
                ReminderTime = dto.ReminderTime,
                HabitId = dto.HabitId
            };

            await _habitService.AddHabitAsync(userHabit);
            return Ok(userHabit);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHabit(int id, [FromBody] UserHabitDto dto)
        {
            var userHabit = new UserHabit
            {
                UserHabitId = id,
                Title = dto.Title,
                Description = dto.Description,
                IsPositive = dto.IsPositive,
                Difficulty = dto.Difficulty,
                Priority = dto.Priority,
                DayMask = dto.DayMask,
                HourMask = dto.HourMask,
                ReminderTime = dto.ReminderTime,
                IsActive = dto.IsActive
            };

            await _habitService.UpdateHabitAsync(userHabit);
            return Ok(userHabit);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabit(int id)
        {
            await _habitService.DeleteHabitAsync(id);
            return NoContent();
        }

        [HttpPost("{userHabitId}/complete/{userId}")]
        public async Task<IActionResult> CompleteHabit(int userHabitId, int userId, [FromQuery] string? note = null)
        {
            await _habitService.CompleteHabitAsync(userHabitId, userId, note);
            return Ok();
        }

        [HttpPost("{userHabitId}/master/{userId}")]
        public async Task<IActionResult> MasterHabit(int userHabitId, int userId)
        {
            await _habitService.MasterHabitAsync(userHabitId, userId);
            return Ok();
        }
    }
}
