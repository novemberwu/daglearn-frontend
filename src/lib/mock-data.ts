import { McqDto } from '@/types';

// Mock data for initial development and testing
export const MOCK_TOPICS = [
  { id: 'T-1', title: 'Arrays', description: 'Contiguous memory collection.', requiredProficiencyScore: 80 },
  { id: 'T-2', title: 'Linked Lists', description: 'Linear collection of nodes.', requiredProficiencyScore: 80 },
  { id: 'T-3', title: 'Trees', description: 'Hierarchical structure.', requiredProficiencyScore: 80 },
];

export const MOCK_MCQS: McqDto[] = [
  {
    id: 'R-1',
    content: 'What happens if you lose the head pointer in a `SinglyLinkedList`?',
    options: [
      'The entire list becomes unreachable (Memory Leak)',
      'Only the head is lost',
      'Nothing happens',
      'The next pointer is updated'
    ]
  },
  {
    id: 'R-2',
    content: 'What is the time complexity to access the i-th element in a Singly Linked List?',
    options: ['`O(1)`', '`O(log n)`', '`O(n)`', '`O(n^2)`']
  },
  {
    id: 'R-3',
    content: 'Consider the following Java method designed to search for a value in a list of nodes:\n\n```java\npublic boolean contains(Node head, int target) {\n    Node current = head;\n    while (current != null) {\n        if (current.data == target) {\n            return true;\n        }\n        current = current.next;\n    }\n    return false;\n}\n```\n\nWhat is the worst-case time complexity of this search method if the list has `n` elements?',
    options: [
      '`O(1)`',
      '`O(log n)`',
      '`O(n)`',
      '`O(n^2)`'
    ]
  }
];

export const MOCK_PROFICIENCIES = [
  { conceptId: 'C-1', conceptName: 'Node Structure', percentage: 95 },
  { conceptId: 'C-2', conceptName: 'Traversal', percentage: 70 },
  { conceptId: 'C-3', conceptName: 'Memory Allocation', percentage: 45 },
];
