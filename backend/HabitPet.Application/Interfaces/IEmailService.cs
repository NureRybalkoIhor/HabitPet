using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendOtpAsync(string toEmail, string code);
    }
}
