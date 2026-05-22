using HabitPet.Application.Services;
using Microsoft.AspNetCore.Mvc;

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
    }
}
