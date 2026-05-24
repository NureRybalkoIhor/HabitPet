using HabitPet.Application.Services;
using HabitPet.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace HabitPet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PetController : ControllerBase
    {
        private readonly PetService _petService;

        public PetController(PetService petService)
        {
            _petService = petService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetPet(int userId)
        {
            var pet = await _petService.GetPetAsync(userId);
            if (pet == null) return NotFound();
            return Ok(pet);
        }

        [HttpPost("{userId}/feed")]
        public async Task<IActionResult> FeedPet(int userId, [FromQuery] int xpCost = 10)
        {
            await _petService.FeedPetAsync(userId, xpCost);
            return Ok();
        }

        [HttpPost("{userId}/play")]
        public async Task<IActionResult> PlayWithPet(int userId, [FromQuery] int xpCost = 15)
        {
            await _petService.PlayWithPetAsync(userId, xpCost);
            return Ok();
        }

        [HttpGet("{userId}/actions")]
        public async Task<IActionResult> GetPetActions(int userId)
        {
            var actions = await _petService.GetPetActionsAsync(userId);
            var dtos = actions.Select(a => new PetActionDto
            {
                PetActionId = a.PetActionId,
                ActionType = a.ActionType.ToString(),
                XpSpent = a.XpSpent,
                ActionTime = a.ActionTime
            });
            return Ok(dtos);
        }

        [HttpPut("{petId}/name")]
        public async Task<IActionResult> UpdatePetName(int petId, [FromBody] UpdatePetNameRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("Name cannot be empty.");
            }

            var success = await _petService.UpdatePetNameAsync(petId, request.Name);
            if (!success) return NotFound();
            return Ok();
        }
    }

    public class UpdatePetNameRequest
    {
        public string Name { get; set; } = string.Empty;
    }
}
