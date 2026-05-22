using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;

namespace HabitPet.Infrastructure.Services
{
    public class OtpService
    {
        private readonly IMemoryCache _cache;

        public OtpService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public string GenerateAndStore(string email)
        {
            var code = new Random().Next(1000, 9999).ToString();
            _cache.Set($"otp_{email}", code, TimeSpan.FromMinutes(5));
            return code;
        }

        public bool Verify(string email, string code)
        {
            var key = $"otp_{email}";
            if (_cache.TryGetValue(key, out string? stored) && stored == code)
            {
                _cache.Remove(key);
                return true;
            }
            return false;
        }
    }
}
