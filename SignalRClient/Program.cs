using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;

namespace SignalRClient
{
    class Program
    {
        static void Main(string[] args)
        {
            Task.Run(async () =>
            {
                await StartChat();
            }).Wait();
        }

        static async Task StartChat()
        {
             // 進行 SignalR 連線
            var connection = new HubConnectionBuilder()
                .WithUrl("http://localhost:5000/chathub")
                .Build();

            await connection.StartAsync();

            Console.WriteLine("Connected");

            // 監聽 ReceiveMessage 訊息
            connection.On<string, string>(
            "ReceiveMessage", 
            (name, message) =>
            {
                Console.WriteLine($"[Chat] {name}: {message}");
            });

            // 輸入聊天資訊
            Console.WriteLine("Your Name: ");
            var yourname = Console.ReadLine();
            Console.WriteLine($"Hello: {yourname}");

            while(true)
            {
                Console.WriteLine("Type Message: ");
                var message = Console.ReadLine();

                // 送出聊天資訊
                await connection.InvokeAsync("SendMessage", yourname, message);
            }
        }
    }
}
