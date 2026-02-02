using DataStructureTests.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataStructureTests.Testers
{
    public class AsyncQueueTester
    {
        private AsyncQueue AsyncQueue { get; set; } = new AsyncQueue();

        public AsyncQueueTester()
        {
        }

        public async Task Run()
        {
            Console.WriteLine("Beginning AsyncQueue Test...");
            var adder = QueueAdder();
            var remover = QueueRemover();
            await Task.WhenAll(adder, remover);
            Console.WriteLine("Finished AsyncQueue Test!");
        }
        public async Task QueueAdder()
        {
            for (int i = 0; i < 10; i++)
            {
                await AsyncQueue.Enqueue(i);
                Console.WriteLine($"Enqueued: {i}");
                Thread.Sleep(100);
            }
        }

        public async Task QueueRemover()
        {
            while (true)
            {
                var item = await AsyncQueue.Dequeue();
                Console.WriteLine($"Dequeued: {item}");
                if (AsyncQueue.Count().Result == 0)
                {
                    break;
                }
                Thread.Sleep(150);
            }
        }
    }
}
