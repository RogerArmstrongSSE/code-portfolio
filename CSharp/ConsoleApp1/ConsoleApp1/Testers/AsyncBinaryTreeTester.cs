using DataStructureTests.Models;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace DataStructureTests.Testers
{
    public class AsyncBinaryTreeTester
    {
        private AsyncBinaryTree AsyncBinaryTree { get; set; } = new AsyncBinaryTree();

        public AsyncBinaryTreeTester()
        {
        }

        public async Task Run()
        {
            Console.WriteLine("Beginning AsyncBinaryTree Test...");
            await TreeAdder();
            await TreeTraversal();
            Console.WriteLine("Removing some nodes...");
            await TreeRemover();
            await TreeTraversal();
            Console.WriteLine("Finished AsyncBinaryTree Test!");
        }

        public async Task TreeAdder()
        {
            for (int i = 0; i < 10; i++)
            {
                var addedValue = RandomNumberGenerator.GetInt32(100);
                await AsyncBinaryTree.Add(addedValue);
                Console.WriteLine($"Added: {addedValue}");
                Thread.Sleep(100);
            }
        }

        public async Task TreeRemover()
        {
            await Task.WhenAll(
                AsyncBinaryTree.Remove(AsyncBinaryTree.GetRootValue().GetAwaiter().GetResult() ?? 0),
                AsyncBinaryTree.Remove(AsyncBinaryTree.GetMinValue().GetAwaiter().GetResult() ?? 0),
                AsyncBinaryTree.Remove(AsyncBinaryTree.GetMaxValue().GetAwaiter().GetResult() ?? 0)
            );
        }

        public async Task TreeTraversal()
        {
            Console.WriteLine("In-Order Traversal Result:");
            await AsyncBinaryTree.InOrderTraversal(Console.WriteLine);
        }
    }
}
