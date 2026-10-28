// Centralized sample data for Verdict platform

export const PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    acceptance: 67.3,
    solved: true,
    method: 'twoSum',
    params: ['nums', 'target'],
    compare: 'unordered',
    visibleTests: [
      { id: 1, input: [[2, 7, 11, 15], 9], expected: [0, 1], inputStr: 'nums = [2,7,11,15], target = 9', expectedStr: '[0,1]' },
      { id: 2, input: [[3, 2, 4], 6], expected: [1, 2], inputStr: 'nums = [3,2,4], target = 6', expectedStr: '[1,2]' },
    ],
    hiddenTests: [
      { id: 3, input: [[3, 3], 6], expected: [0, 1], inputStr: 'nums = [3,3], target = 6', expectedStr: '[0,1]' },
      { id: 4, input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], inputStr: 'nums = [-1,-2,-3,-4,-5], target = -8', expectedStr: '[2,4]' },
    ],
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: '',
      },
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
    },
  },
  {
    id: 2,
    title: 'Reverse String',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    acceptance: 80.1,
    solved: true,
    method: 'reverseString',
    params: ['s'],
    compare: 'exact',
    visibleTests: [
      { id: 1, input: [["h","e","l","l","o"]], expected: ["o","l","l","e","h"], inputStr: 's = ["h","e","l","l","o"]', expectedStr: '["o","l","l","e","h"]' },
      { id: 2, input: [["H","a","n","n","a","h"]], expected: ["h","a","n","n","a","H"], inputStr: 's = ["H","a","n","n","a","H"]', expectedStr: '["h","a","n","n","a","H"]' },
    ],
    hiddenTests: [
      { id: 3, input: [["a"]], expected: ["a"], inputStr: 's = ["a"]', expectedStr: '["a"]' },
      { id: 4, input: [["A","b","C","d","E"]], expected: ["E","d","C","b","A"], inputStr: 's = ["A","b","C","d","E"]', expectedStr: '["E","d","C","b","A"]' },
    ],
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explanation: '' },
    ],
    constraints: [
      '1 ≤ s.length ≤ 10⁵',
      's[i] is a printable ASCII character.',
    ],
    starterCode: {
      javascript: `/**
 * @param {character[]} s
 * @return {void}
 */
var reverseString = function(s) {
    
};`,
      python: `class Solution:
    def reverseString(self, s: List[str]) -> None:
        `,
      java: `class Solution {
    public void reverseString(char[] s) {
        
    }
}`,
      cpp: `class Solution {
public:
    void reverseString(vector<char>& s) {
        
    }
};`,
    },
  },
  {
    id: 3,
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    acceptance: 55.2,
    solved: false,
    method: 'isPalindrome',
    params: ['s'],
    compare: 'boolean',
    visibleTests: [
      { id: 1, input: ["A man, a plan, a canal: Panama"], expected: true, inputStr: 's = "A man, a plan, a canal: Panama"', expectedStr: 'true' },
      { id: 2, input: ["race a car"], expected: false, inputStr: 's = "race a car"', expectedStr: 'false' },
    ],
    hiddenTests: [
      { id: 3, input: [" "], expected: true, inputStr: 's = " "', expectedStr: 'true' },
      { id: 4, input: ["0P"], expected: false, inputStr: 's = "0P"', expectedStr: 'false' },
    ],
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
    ],
    constraints: [
      '1 ≤ s.length ≤ 2 × 10⁵',
      's consists only of printable ASCII characters.',
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    
};`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        `,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        
    }
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        
    }
};`,
    },
  },
  {
    id: 4,
    title: 'Add Two Integers',
    difficulty: 'Easy',
    tags: ['Math'],
    acceptance: 88.5,
    solved: true,
    method: 'sum',
    params: ['num1', 'num2'],
    compare: 'number',
    visibleTests: [
      { id: 1, input: [12, 5], expected: 17, inputStr: 'num1 = 12, num2 = 5', expectedStr: '17' },
      { id: 2, input: [-10, 4], expected: -6, inputStr: 'num1 = -10, num2 = 4', expectedStr: '-6' },
    ],
    hiddenTests: [
      { id: 3, input: [0, 0], expected: 0, inputStr: 'num1 = 0, num2 = 0', expectedStr: '0' },
      { id: 4, input: [-100, -200], expected: -300, inputStr: 'num1 = -100, num2 = -200', expectedStr: '-300' },
    ],
    description: `Given two integers num1 and num2, return the sum of the two integers.`,
    examples: [
      { input: 'num1 = 12, num2 = 5', output: '17', explanation: 'num1 + num2 = 17, so we return 17.' },
      { input: 'num1 = -10, num2 = 4', output: '-6', explanation: 'num1 + num2 = -6, so we return -6.' },
    ],
    constraints: [
      '-100 ≤ num1, num2 ≤ 100',
    ],
    starterCode: {
      javascript: `/**
 * @param {number} num1
 * @param {number} num2
 * @return {number}
 */
var sum = function(num1, num2) {
    
};`,
      python: `class Solution:
    def sum(self, num1: int, num2: int) -> int:
        `,
      java: `class Solution {
    public int sum(int num1, int num2) {
        
    }
}`,
      cpp: `class Solution {
public:
    int sum(int num1, int num2) {
        
    }
};`,
    },
  },
  {
    id: 5,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    acceptance: 38.5,
    solved: false,
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
    ],
    constraints: [
      '0 ≤ s.length ≤ 5 × 10⁴',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      javascript: `var lengthOfLongestSubstring = function(s) {
    
};`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        `,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        
    }
};`,
    },
  },
  {
    id: 6,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptance: 37.2,
    solved: false,
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'merged array = [1,2,3] and median is 2.' },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 ≤ m ≤ 1000',
      '0 ≤ n ≤ 1000',
    ],
    starterCode: {
      javascript: `var findMedianSortedArrays = function(nums1, nums2) {
    
};`,
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        `,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        
    }
}`,
      cpp: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        
    }
};`,
    },
  },
  {
    id: 7,
    title: 'N-Queens',
    difficulty: 'Hard',
    tags: ['Array', 'Backtracking'],
    acceptance: 72.9,
    solved: false,
    description: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.

Given an integer n, return all distinct solutions to the n-queens puzzle.`,
    examples: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', explanation: 'There exist two distinct solutions to the 4-queens puzzle.' },
    ],
    constraints: ['1 ≤ n ≤ 9'],
    starterCode: {
      javascript: `var solveNQueens = function(n) {
    
};`,
      python: `class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        `,
      java: `class Solution {
    public List<List<String>> solveNQueens(int n) {
        
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        
    }
};`,
    },
  },
];

export const SUBMISSIONS = [
  {
    id: 'sub_001',
    problemId: 1,
    problemTitle: 'Two Sum',
    status: 'Accepted',
    language: 'JavaScript',
    runtime: '0.12s',
    memory: '12.4 MB',
    submittedAt: '2 mins ago',
    timestamp: new Date(Date.now() - 2 * 60000),
  },
  {
    id: 'sub_002',
    problemId: 2,
    problemTitle: 'Reverse String',
    status: 'Accepted',
    language: 'Python',
    runtime: '0.08s',
    memory: '10.2 MB',
    submittedAt: '25 mins ago',
    timestamp: new Date(Date.now() - 25 * 60000),
  },
  {
    id: 'sub_003',
    problemId: 3,
    problemTitle: 'Valid Palindrome',
    status: 'Wrong Answer',
    language: 'Java',
    runtime: '0.31s',
    memory: '18.7 MB',
    submittedAt: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60000),
  },
  {
    id: 'sub_004',
    problemId: 4,
    problemTitle: 'Add Two Numbers',
    status: 'Accepted',
    language: 'C++',
    runtime: '0.15s',
    memory: '14.3 MB',
    submittedAt: '2 hours ago',
    timestamp: new Date(Date.now() - 120 * 60000),
  },
  {
    id: 'sub_005',
    problemId: 1,
    problemTitle: 'Two Sum',
    status: 'Time Limit Exceeded',
    language: 'JavaScript',
    runtime: '2.00s',
    memory: '12.6 MB',
    submittedAt: '3 hours ago',
    timestamp: new Date(Date.now() - 180 * 60000),
  },
  {
    id: 'sub_006',
    problemId: 2,
    problemTitle: 'Reverse String',
    status: 'Accepted',
    language: 'Java',
    runtime: '0.18s',
    memory: '16.1 MB',
    submittedAt: '5 hours ago',
    timestamp: new Date(Date.now() - 300 * 60000),
  },
  {
    id: 'sub_007',
    problemId: 5,
    problemTitle: 'Longest Substring Without Repeating Characters',
    status: 'Runtime Error',
    language: 'Python',
    runtime: 'N/A',
    memory: 'N/A',
    submittedAt: '1 day ago',
    timestamp: new Date(Date.now() - 24 * 3600000),
  },
  {
    id: 'sub_008',
    problemId: 4,
    problemTitle: 'Add Two Numbers',
    status: 'Accepted',
    language: 'Python',
    runtime: '0.22s',
    memory: '11.9 MB',
    submittedAt: '2 days ago',
    timestamp: new Date(Date.now() - 48 * 3600000),
  },
];

export const STATS = {
  totalProblems: 247,
  totalUsers: 12800,
  submissions: 98400,
  languages: 4,
};

export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', version: 'ES2024', icon: '🟨' },
  { id: 'python', label: 'Python', version: 'Python 3.11', icon: '🐍' },
  { id: 'java', label: 'Java', version: 'Java 21', icon: '☕' },
  { id: 'cpp', label: 'C++', version: 'C++17', icon: '⚙️' },
];

export const DIFFICULTY_COLORS = {
  Easy: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
  Medium: {
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    dot: 'bg-amber-400',
  },
  Hard: {
    text: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/30',
    dot: 'bg-rose-400',
  },
};

export const STATUS_CONFIG = {
  Accepted: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    label: 'Accepted',
  },
  'Wrong Answer': {
    text: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/30',
    label: 'Wrong Answer',
  },
  'Time Limit Exceeded': {
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    label: 'TLE',
  },
  'Runtime Error': {
    text: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/30',
    label: 'Runtime Error',
  },
  'Compile Error': {
    text: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/30',
    label: 'Compile Error',
  },
};
