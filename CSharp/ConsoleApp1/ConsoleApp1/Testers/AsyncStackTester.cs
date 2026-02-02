using DataStructureTests.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataStructureTests.Testers
{
    public class AsyncStackTester
    {
        private AsyncStack AsyncStack { get; set; } = new AsyncStack();

        public AsyncStackTester()
        {
        }

        public async Task Run()
        {
            Console.WriteLine("Beginning AsyncStack Test...");
            var pusher = StackPusher();
            var popper = StackPopper();
            await Task.WhenAll(pusher, popper);
            Console.WriteLine("Finished AsyncStack Test!");
        }

        public async Task StackPusher()
        {
            for (int i = 0; i < 10; i++)
            {
                await AsyncStack.Push(i);
                Console.WriteLine($"Pushed: {i}");
                Thread.Sleep(100);
            }
        }

        public async Task StackPopper()
        {
            while (true)
            {
                var item = await AsyncStack.Pop();
                Console.WriteLine($"Popped: {item}");
                if (AsyncStack.Count().Result == 0)
                {
                    break;
                }
                Thread.Sleep(150);
            }
        }
    }
}
