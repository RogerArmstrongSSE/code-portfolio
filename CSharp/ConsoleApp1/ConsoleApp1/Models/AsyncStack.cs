using System;
using System.Collections.Generic;
using System.Text;

namespace DataStructureTests.Models
{
    public class AsyncStack
    {
        private List<object> StackList;

        public AsyncStack()
        {
            StackList = new List<object>();
        }

        public async Task Push(object item)
        {
            lock (this)
            {
                StackList.Add(item);
            }
        }

        public async Task<object> Pop()
        {
            lock (this)
            {
                if (StackList.Count > 0)
                {
                    var item = StackList[StackList.Count - 1];
                    StackList.RemoveAt(StackList.Count - 1);
                    return item;
                }
                else
                {
                    throw new InvalidOperationException("Stack is empty.");
                }
            }
        }

        public async Task<int> Count()
        {
            lock (this)
            {
                return StackList.Count;
            }
        }

        public async Task<object> Peek()
        {
            lock (this)
            {
                if (StackList.Count > 0)
                {
                    return StackList[StackList.Count - 1];
                }
                else
                {
                    throw new InvalidOperationException("Stack is empty.");
                }
            }
        }
    }
}
