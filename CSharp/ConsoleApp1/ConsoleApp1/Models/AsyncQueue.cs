using System;
using System.Collections.Generic;
using System.Text;

namespace DataStructureTests.Models
{
    public class AsyncQueue
    {
        private List<object> QueueList;
        public AsyncQueue()
        {
            QueueList = new List<object>();
        }
        public async Task Enqueue(object item)
        {
            lock (this)
            {
                QueueList.Add(item);
            }
        }
        public async Task<object> Dequeue()
        {
            lock (this)
            {
                if (QueueList.Count > 0)
                {
                    var item = QueueList[0];
                    QueueList.RemoveAt(0);
                    return item;
                }
                else
                {
                    throw new InvalidOperationException("Queue is empty.");
                }
            }
        }
        public async Task<int> Count()
        {
            lock (this)
            {
                return QueueList.Count;
            }
        }
        public async Task<object> Peek()
        {
            lock (this)
            {
                if (QueueList.Count > 0)
                {
                    return QueueList[0];
                }
                else
                {
                    throw new InvalidOperationException("Queue is empty.");
                }
            }
        }
    }
}
