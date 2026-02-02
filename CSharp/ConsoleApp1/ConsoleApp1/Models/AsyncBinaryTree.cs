using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Text;

namespace DataStructureTests.Models
{
    public class TreeNode <T> where T : IComparable<T>
    {
        public T Value { get; set; }
        public bool Deleted { get; set; } = false;
        public TreeNode<T> Left { get; set; }
        public TreeNode<T> Right { get; set; }
        public TreeNode(T value)
        {
            Value = value;            
        }
        public void AddValue(T value)
        {
            if (value.CompareTo(Value) < 0)
            {
                if (Left == null)
                {
                    Left = new TreeNode<T>(value);
                }
                else
                {
                    Left.AddValue(value);
                }
            }
            else
            {
                if (Right == null)
                {
                    Right = new TreeNode<T>(value);
                }
                else
                {
                    Right.AddValue(value);
                }
            }
        }
    }

    public class AsyncBinaryTree
    {
        private TreeNode<int> Root;
        public AsyncBinaryTree()
        {
            Root = null;
        }

        public async Task<int?> GetRootValue() => Root?.Value;

        public async Task<int?> GetMinValue()
        {
            if (Root == null)
            {
                return null;
            }
            var current = Root;
            while (current.Left != null)
            {
                current = current.Left;
            }
            return current.Value;
        }

        public async Task<int?> GetMaxValue()
        {
            if (Root == null)
            {
                return null;
            }
            var current = Root;
            while (current.Right != null)
            {
                current = current.Right;
            }
            return current.Value;
        }

        public async Task Add(int value)
        {
            if (Root == null)
            {
                Root = new TreeNode<int>(value);
            }
            else
            {
                Root.AddValue(value);
            }
        }

        public async Task Remove(int value)
        {
            await RemoveRecursive(Root, value);
        }
        private async Task RemoveRecursive(TreeNode<int> node, int value)
        {
            if (node == null)
            {
                return;
            }
            if (node.Value == value)
            {
                node.Deleted = true;
            }
            else if (value < node.Value)
            {
                await RemoveRecursive(node.Left, value);
            }
            else
            {
                await RemoveRecursive(node.Right, value);
            }
        }

        public async Task<bool> Contains(int value)
        {
            return await ContainsRecursive(Root, value);
        }

        private async Task<bool> ContainsRecursive(TreeNode<int> node, int value)
        {
            if (node == null)
            {
                return false;
            }
            if (node.Value == value)
            {
                return true;
            }
            else if (value < node.Value)
            {
                return await ContainsRecursive(node.Left, value);
            }
            else
            {
                return await ContainsRecursive(node.Right, value);
            }
        }

        public async Task InOrderTraversal(Action<int> action)
        {
            await InOrderTraversalRecursive(Root, action);
        }

        private async Task InOrderTraversalRecursive(TreeNode<int> node, Action<int> action)
        {
            if (node == null)
            {
                return;
            }
            await InOrderTraversalRecursive(node.Left, action);
            if (!node.Deleted)
            {
                action(node.Value);
            }
            await InOrderTraversalRecursive(node.Right, action);
        }
    }
}
