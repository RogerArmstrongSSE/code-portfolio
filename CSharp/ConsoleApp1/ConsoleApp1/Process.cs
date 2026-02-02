using DataStructureTests.Testers;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataStructureTests
{
    public class Process
    {
        public Process()
        {
        }

        public async Task Run()
        {
            var asyncStackTester = new AsyncStackTester();
            var asyncQueueTester = new AsyncQueueTester();
            var asyncBinaryTreeTester = new AsyncBinaryTreeTester();

            await Task.WhenAll(asyncStackTester.Run(), asyncQueueTester.Run(), asyncBinaryTreeTester.Run());
        }
    }
}
