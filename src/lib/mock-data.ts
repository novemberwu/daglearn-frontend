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
    content: 'What happens if you lose the head pointer?',
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
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)']
  }
];

export const MOCK_PROFICIENCIES = [
  { conceptId: 'C-1', conceptName: 'Node Structure', percentage: 95 },
  { conceptId: 'C-2', conceptName: 'Traversal', percentage: 70 },
  { conceptId: 'C-3', conceptName: 'Memory Allocation', percentage: 45 },
];
