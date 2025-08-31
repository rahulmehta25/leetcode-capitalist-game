import { CodingProblem } from '../types/leetcode';

export const LEETCODE_PROBLEMS: CodingProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    domain: 'arrays',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      }
    ],
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]' },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    
};`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
    },
    solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    hints: [
      'Try using a hash map to store values you\'ve seen',
      'For each element, check if target - element exists in your hash map',
      'Remember to return the indices, not the values'
    ],
    xpReward: 50,
    moneyReward: 100,
    tags: ['Array', 'Hash Map'],
    multipleChoice: {
      question: `Problem: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Example: nums = [2,7,11,15], target = 9
Output: [0,1] (because nums[0] + nums[1] = 2 + 7 = 9)

Which solution correctly solves this problem with the BEST time complexity?`,
      options: [
        {
          id: 'nested-loops',
          text: 'Solution A: Nested Loop Approach',
          codeSnippet: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
          language: 'javascript',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          explanation: 'This solution works correctly but is inefficient. It checks every possible pair using nested loops, resulting in O(n²) time complexity. For large arrays (n=10,000), this would require up to 100 million operations.'
        },
        {
          id: 'hash-map',
          text: 'Solution B: Hash Map Approach',
          codeSnippet: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
          language: 'javascript',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          explanation: '✅ CORRECT AND OPTIMAL! This solution achieves O(n) time complexity by using a hash map. As we iterate through the array once, we store each number and check if its complement exists. This is the best possible time complexity for this problem.'
        },
        {
          id: 'sort-first',
          text: 'Solution C: Sort First, Then Two Pointers',
          codeSnippet: `function twoSum(nums, target) {
  // Create array with values and original indices
  const indexed = nums.map((val, i) => [val, i]);
  indexed.sort((a, b) => a[0] - b[0]);
  
  let left = 0, right = indexed.length - 1;
  while (left < right) {
    const sum = indexed[left][0] + indexed[right][0];
    if (sum === target) {
      return [indexed[left][1], indexed[right][1]];
    }
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
          language: 'javascript',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(n)',
          explanation: 'This solution works but is suboptimal. Sorting takes O(n log n) time, which is slower than the hash map approach. We need extra space to preserve original indices during sorting.'
        },
        {
          id: 'wrong-logic',
          text: 'Solution D: Single Pass (Incorrect)',
          codeSnippet: `function twoSum(nums, target) {
  // WRONG: Only finds consecutive pairs!
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] + nums[i + 1] === target) {
      return [i, i + 1];
    }
  }
  return [];
}`,
          language: 'javascript',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          explanation: '❌ INCORRECT! This solution has a bug - it only checks consecutive elements. It would fail for nums = [2,7,11,15], target = 13 (should return [0,2] but returns []). Always test your logic thoroughly!'
        }
      ],
      correctOptionId: 'hash-map',
      conceptExplanation: 'The hash map approach is optimal because it allows us to check if we\'ve seen the complement (target - current) in just O(1) time, making the overall solution O(n). This demonstrates the common pattern of trading space for time complexity.'
    },
    fillInBlank: {
      description: 'Complete the Two Sum solution using a hash map approach:',
      segments: [
        { text: 'function twoSum(nums, target) {\n', isBlank: false },
        { text: '    const ', isBlank: false },
        { text: '', isBlank: true, answer: 'map', placeholder: 'data structure' },
        { text: ' = new ', isBlank: false },
        { text: '', isBlank: true, answer: 'Map()', placeholder: 'constructor' },
        { text: ';\n    for (let i = 0; i < nums.length; i++) {\n', isBlank: false },
        { text: '        const complement = ', isBlank: false },
        { text: '', isBlank: true, answer: 'target - nums[i]', placeholder: 'calculation' },
        { text: ';\n        if (', isBlank: false },
        { text: '', isBlank: true, answer: 'map.has(complement)', placeholder: 'check condition' },
        { text: ') {\n            return [', isBlank: false },
        { text: '', isBlank: true, answer: 'map.get(complement)', placeholder: 'first index' },
        { text: ', i];\n        }\n        ', isBlank: false },
        { text: '', isBlank: true, answer: 'map.set(nums[i], i)', placeholder: 'store value' },
        { text: ';\n    }\n    return [];\n}', isBlank: false }
      ],
      hints: [
        'Use a Map to store values you\'ve seen',
        'The complement is what you need to add to current number to get target',
        'Store each number with its index as you iterate'
      ]
    }
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    domain: 'math',
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

An integer is a palindrome when it reads the same backward as forward.

For example, 121 is a palindrome while 123 is not.`,
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.'
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-.'
      },
      {
        input: 'x = 10',
        output: 'false',
        explanation: 'Reads 01 from right to left.'
      }
    ],
    testCases: [
      { input: '121', expectedOutput: 'true' },
      { input: '-121', expectedOutput: 'false' },
      { input: '10', expectedOutput: 'false' },
      { input: '0', expectedOutput: 'true' },
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
    // Write your solution here
    
};`,
      python: `def isPalindrome(x):
    # Write your solution here
    pass`,
    },
    solution: `function isPalindrome(x) {
    if (x < 0) return false;
    const str = x.toString();
    let left = 0;
    let right = str.length - 1;
    while (left < right) {
        if (str[left] !== str[right]) return false;
        left++;
        right--;
    }
    return true;
}`,
    hints: [
      'Negative numbers cannot be palindromes',
      'You could convert the number to a string',
      'Try using two pointers from both ends'
    ],
    xpReward: 30,
    moneyReward: 75,
    tags: ['Math', 'Two Pointers'],
    multipleChoice: {
      question: `Problem: Given an integer x, return true if x is a palindrome (reads the same forward and backward).

Examples:
• x = 121 → true (121 reads same both ways)
• x = -121 → false (becomes 121- when reversed)
• x = 10 → false (becomes 01 when reversed)

Which solution correctly and efficiently solves this problem?`,
      options: [
        {
          id: 'string-convert',
          text: 'Solution A: Convert to String',
          codeSnippet: `function isPalindrome(x) {
  if (x < 0) return false;
  const str = x.toString();
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}`,
          language: 'javascript',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          explanation: '✅ CORRECT! This is the simplest and most readable solution. Converts number to string and checks if it equals its reverse. Negative numbers are handled first.'
        },
        {
          id: 'math-reverse',
          text: 'Solution B: Mathematical Reversal',
          codeSnippet: `function isPalindrome(x) {
  if (x < 0) return false;
  let original = x;
  let reversed = 0;
  while (x > 0) {
    reversed = reversed * 10 + x % 10;
    x = Math.floor(x / 10);
  }
  return original === reversed;
}`,
          language: 'javascript',
          timeComplexity: 'O(log n)',
          spaceComplexity: 'O(1)',
          explanation: 'Also correct and more memory-efficient! This reverses the number mathematically without string conversion. Good for when memory is constrained.'
        },
        {
          id: 'wrong-negative',
          text: 'Solution C: Incorrect Negative Handling',
          codeSnippet: `function isPalindrome(x) {
  // WRONG: Doesn't handle negatives!
  const str = x.toString();
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}`,
          language: 'javascript',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          explanation: '❌ INCORRECT! This fails for negative numbers. -121 would incorrectly return false because "-121" ≠ "121-". Always handle edge cases!'
        },
        {
          id: 'inefficient',
          text: 'Solution D: Inefficient String Building',
          codeSnippet: `function isPalindrome(x) {
  if (x < 0) return false;
  const str = x.toString();
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed = reversed + str[i]; // String concatenation in loop
  }
  return str === reversed;
}`,
          language: 'javascript',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(n)',
          explanation: 'Works but inefficient. String concatenation in a loop can be O(n²) in some languages due to string immutability. Use array methods or StringBuilder instead.'
        }
      ],
      correctOptionId: 'string-convert',
      conceptExplanation: 'For palindrome checking, the string conversion approach is most intuitive and readable. The mathematical approach is also valid and more memory-efficient, making it ideal for systems with memory constraints.'
    },
    fillInBlank: {
      description: 'Complete the palindrome checker using the two-pointer approach:',
      segments: [
        { text: 'function isPalindrome(x) {\n', isBlank: false },
        { text: '    if (x < ', isBlank: false },
        { text: '', isBlank: true, answer: '0', placeholder: 'edge case' },
        { text: ') return false;\n    const str = x.', isBlank: false },
        { text: '', isBlank: true, answer: 'toString()', placeholder: 'convert method' },
        { text: ';\n    let left = ', isBlank: false },
        { text: '', isBlank: true, answer: '0', placeholder: 'start index' },
        { text: ';\n    let right = str.length - ', isBlank: false },
        { text: '', isBlank: true, answer: '1', placeholder: 'end index' },
        { text: ';\n    while (left < right) {\n        if (str[left] !== str[', isBlank: false },
        { text: '', isBlank: true, answer: 'right', placeholder: 'pointer' },
        { text: ']) return ', isBlank: false },
        { text: '', isBlank: true, answer: 'false', placeholder: 'not palindrome' },
        { text: ';\n        left++;\n        right--;\n    }\n    return ', isBlank: false },
        { text: '', isBlank: true, answer: 'true', placeholder: 'is palindrome' },
        { text: ';\n}', isBlank: false }
      ],
      hints: [
        'Negative numbers cannot be palindromes because of the minus sign',
        'Use two pointers starting from both ends of the string',
        'Move pointers inward and compare characters at each step'
      ]
    }
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    domain: 'strings',
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      }
    ],
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' },
    ],
    starterCode: {
      javascript: `function reverseString(s) {
    // Write your solution here
    // Modify s in-place
    
};`,
    },
    solution: `function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
}`,
    hints: [
      'Use two pointers approach',
      'Swap characters from both ends',
      'Move pointers towards the center'
    ],
    xpReward: 25,
    moneyReward: 50,
    tags: ['String', 'Two Pointers'],
    multipleChoice: {
      question: `Problem: Reverse a string array in-place using O(1) extra memory.

Example: ["h","e","l","l","o"] → ["o","l","l","e","h"]

Which solution correctly reverses the array in-place?`,
      options: [
        {
          id: 'two-pointers',
          text: 'Solution A: Two Pointers with Swap',
          codeSnippet: `function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}`,
          language: 'javascript',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          explanation: '✅ CORRECT AND OPTIMAL! Uses two pointers to swap elements from both ends, modifying the array in-place with O(1) extra space.'
        },
        {
          id: 'wrong-reverse',
          text: 'Solution B: Built-in Reverse (Not In-Place)',
          codeSnippet: `function reverseString(s) {
  // WRONG: Creates new array, not in-place!
  return s.reverse();
}`,
          language: 'javascript',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          explanation: 'Technically works but misses the point. The problem asks you to implement the reversal logic yourself, not use built-in methods.'
        },
        {
          id: 'new-array',
          text: 'Solution C: Create New Array',
          codeSnippet: `function reverseString(s) {
  // WRONG: Not in-place!
  const result = [];
  for (let i = s.length - 1; i >= 0; i--) {
    result.push(s[i]);
  }
  return result;
}`,
          language: 'javascript',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          explanation: '❌ INCORRECT! This creates a new array instead of modifying the input array in-place. Uses O(n) extra space, violating the constraint.'
        },
        {
          id: 'half-loop',
          text: 'Solution D: Incorrect Loop Bounds',
          codeSnippet: `function reverseString(s) {
  // WRONG: Loop goes too far!
  for (let i = 0; i < s.length; i++) {
    const temp = s[i];
    s[i] = s[s.length - 1 - i];
    s[s.length - 1 - i] = temp;
  }
}`,
          language: 'javascript',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          explanation: '❌ INCORRECT! This reverses the array twice (back to original). The loop should stop at the middle, not go through the entire array.'
        }
      ],
      correctOptionId: 'two-pointers',
      conceptExplanation: 'The two-pointer technique is perfect for in-place array operations. Start from both ends and swap elements while moving pointers toward the center.'
    },
    fillInBlank: {
      description: 'Complete the in-place string reversal:',
      segments: [
        { text: 'function reverseString(s) {\n    let left = ', isBlank: false },
        { text: '', isBlank: true, answer: '0', placeholder: 'start' },
        { text: ';\n    let right = s.length - ', isBlank: false },
        { text: '', isBlank: true, answer: '1', placeholder: 'end' },
        { text: ';\n    while (left ', isBlank: false },
        { text: '', isBlank: true, answer: '<', placeholder: 'condition' },
        { text: ' right) {\n        // Swap elements\n        [s[', isBlank: false },
        { text: '', isBlank: true, answer: 'left', placeholder: 'index' },
        { text: '], s[', isBlank: false },
        { text: '', isBlank: true, answer: 'right', placeholder: 'index' },
        { text: ']] = [s[right], s[left]];\n        left', isBlank: false },
        { text: '', isBlank: true, answer: '++', placeholder: 'increment' },
        { text: ';\n        right', isBlank: false },
        { text: '', isBlank: true, answer: '--', placeholder: 'decrement' },
        { text: ';\n    }\n}', isBlank: false }
      ],
      hints: [
        'Start with pointers at opposite ends of the array',
        'Swap elements at the two pointer positions',
        'Move pointers toward each other until they meet'
      ]
    }
  },
  {
    id: 'fizzbuzz',
    title: 'Fizz Buzz',
    difficulty: 'Easy',
    domain: 'math',
    description: `Given an integer n, return a string array answer (1-indexed) where:

- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
- answer[i] == "Fizz" if i is divisible by 3.
- answer[i] == "Buzz" if i is divisible by 5.
- answer[i] == i (as a string) if none of the above conditions are true.`,
    examples: [
      {
        input: 'n = 3',
        output: '["1","2","Fizz"]',
      },
      {
        input: 'n = 5',
        output: '["1","2","Fizz","4","Buzz"]',
      },
      {
        input: 'n = 15',
        output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
      }
    ],
    testCases: [
      { input: '3', expectedOutput: '["1","2","Fizz"]' },
      { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]' },
      { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    starterCode: {
      javascript: `function fizzBuzz(n) {
    // Write your solution here
    
};`,
    },
    solution: `function fizzBuzz(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) {
            result.push("FizzBuzz");
        } else if (i % 3 === 0) {
            result.push("Fizz");
        } else if (i % 5 === 0) {
            result.push("Buzz");
        } else {
            result.push(i.toString());
        }
    }
    return result;
}`,
    hints: [
      'Check divisibility by 15 first (both 3 and 5)',
      'Use the modulo operator %',
      'Build an array with the results'
    ],
    xpReward: 20,
    moneyReward: 40,
    tags: ['Math', 'String']
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    domain: 'stacks',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      }
    ],
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
      { input: '"([)]"', expectedOutput: 'false' },
      { input: '"{[]}"', expectedOutput: 'true' },
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Write your solution here
    
};`,
    },
    solution: `function isValid(s) {
    const stack = [];
    const pairs = {
        '(': ')',
        '{': '}',
        '[': ']'
    };
    
    for (let char of s) {
        if (char in pairs) {
            stack.push(char);
        } else {
            if (stack.length === 0) return false;
            const last = stack.pop();
            if (pairs[last] !== char) return false;
        }
    }
    
    return stack.length === 0;
}`,
    hints: [
      'Use a stack data structure',
      'Push opening brackets, pop when you see closing brackets',
      'Check if the popped bracket matches the closing bracket'
    ],
    xpReward: 40,
    moneyReward: 80,
    tags: ['Stack', 'String']
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    domain: 'binary-search',
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4'
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1'
      }
    ],
    testCases: [
      { input: '[-1,0,3,5,9,12]\n9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12]\n2', expectedOutput: '-1' },
      { input: '[5]\n5', expectedOutput: '0' },
    ],
    starterCode: {
      javascript: `function search(nums, target) {
    // Write your solution here
    
};`,
    },
    solution: `function search(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`,
    hints: [
      'Use two pointers: left and right',
      'Calculate the middle index',
      'Adjust the search space based on comparison with target'
    ],
    xpReward: 45,
    moneyReward: 90,
    tags: ['Binary Search', 'Array']
  },
  {
    id: 'merge-sorted-array',
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    domain: 'arrays',
    description: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.

The final sorted array should be stored inside the array nums1.`,
    examples: [
      {
        input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
        output: '[1,2,2,3,5,6]',
      },
      {
        input: 'nums1 = [1], m = 1, nums2 = [], n = 0',
        output: '[1]',
      }
    ],
    testCases: [
      { input: '[1,2,3,0,0,0]\n3\n[2,5,6]\n3', expectedOutput: '[1,2,2,3,5,6]' },
      { input: '[1]\n1\n[]\n0', expectedOutput: '[1]' },
    ],
    starterCode: {
      javascript: `function merge(nums1, m, nums2, n) {
    // Write your solution here
    // Modify nums1 in-place
    
};`,
    },
    solution: `function merge(nums1, m, nums2, n) {
    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1;
    
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k] = nums1[i];
            i--;
        } else {
            nums1[k] = nums2[j];
            j--;
        }
        k--;
    }
    
    while (j >= 0) {
        nums1[k] = nums2[j];
        j--;
        k--;
    }
}`,
    hints: [
      'Start from the end of both arrays',
      'Compare and place the larger element at the end',
      'Work backwards to avoid overwriting'
    ],
    xpReward: 60,
    moneyReward: 120,
    tags: ['Array', 'Two Pointers', 'Sorting']
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    domain: 'dynamic-programming',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
        explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.'
      }
    ],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' },
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
    // Write your solution here
    
};`,
    },
    solution: `function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
    hints: [
      'Use Kadane\'s algorithm',
      'Keep track of the current sum and maximum sum',
      'Reset current sum when it becomes negative'
    ],
    xpReward: 100,
    moneyReward: 200,
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer']
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    domain: 'dynamic-programming',
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step'
      }
    ],
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '4', expectedOutput: '5' },
      { input: '5', expectedOutput: '8' },
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
    // Write your solution here
    
};`,
    },
    solution: `function climbStairs(n) {
    if (n <= 2) return n;
    
    let prev2 = 1;
    let prev1 = 2;
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}`,
    hints: [
      'This is similar to the Fibonacci sequence',
      'The number of ways to reach step n = ways to reach (n-1) + ways to reach (n-2)',
      'Use dynamic programming to avoid recalculation'
    ],
    xpReward: 55,
    moneyReward: 110,
    tags: ['Dynamic Programming', 'Math', 'Memoization']
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    domain: 'arrays',
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'No transactions are done and the max profit = 0.'
      }
    ],
    testCases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0' },
      { input: '[2,4,1]', expectedOutput: '2' },
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
    // Write your solution here
    
};`,
    },
    solution: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (let price of prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    
    return maxProfit;
}`,
    hints: [
      'Keep track of the minimum price seen so far',
      'Calculate profit at each day',
      'Update maximum profit as you go'
    ],
    xpReward: 65,
    moneyReward: 130,
    tags: ['Array', 'Dynamic Programming']
  }
];