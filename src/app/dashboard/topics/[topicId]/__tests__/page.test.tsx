import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import TopicModulePage from '../page';
import { apiService } from '@/services/api';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: { user: { id: 'test-user', name: 'Rachel Wu' }, accessToken: 'test-token' },
    status: 'authenticated',
  })),
}));

// Mock the API service
vi.mock('@/services/api', () => ({
  apiService: {
    getUnlockedTopics: vi.fn(),
    getTopics: vi.fn(),
    getConceptsByTopic: vi.fn(),
    getDocumentsByConcept: vi.fn(),
    getMcqsByConcept: vi.fn(),
  },
}));

// Spy on React.use to bypass suspension in tests
vi.spyOn(React, 'use').mockImplementation(<T,>(): T => {
  return { topicId: 'T-1' } as unknown as T;
});

const mockTopic = {
  id: 'T-1',
  title: 'Linked Lists',
  description: 'Contiguous list of nodes.',
  requiredProficiencyScore: 80,
  prerequisites: []
};

const mockConcepts = [
  { id: 'C-1', name: 'Node Structure', description: 'Understanding memory pointers.' },
  { id: 'C-2', name: 'Traversal', description: 'Iterating through list elements.' }
];

const mockDocs = [
  { id: 'D-1', title: 'Intro to Nodes', content: 'A node contains data and a next reference.' }
];

const mockMcqs = [
  {
    id: 'R-1',
    content: 'What happens if you lose the head pointer?',
    options: ['Memory Leak', 'List is fine']
  }
];

test('TopicModulePage loads topic, concepts, and auto-selects first concept content', async () => {
  // GIVEN: API responses are mocked for unlocked topics, concepts, documents and MCQs
  vi.mocked(apiService.getUnlockedTopics).mockResolvedValue([mockTopic]);
  vi.mocked(apiService.getConceptsByTopic).mockResolvedValue(mockConcepts);
  vi.mocked(apiService.getDocumentsByConcept).mockResolvedValue(mockDocs);
  vi.mocked(apiService.getMcqsByConcept).mockResolvedValue(mockMcqs);

  const paramsPromise = Promise.resolve({ topicId: 'T-1' });

  // WHEN: Rendering the topic module page
  render(<TopicModulePage params={paramsPromise} />);

  // THEN: Topic and concepts loader should run and then display content
  await waitFor(() => {
    expect(screen.getByText('Linked Lists')).toBeDefined();
    expect(screen.getAllByText('Node Structure')[0]).toBeDefined();
    expect(screen.getByText('Traversal')).toBeDefined();
  });

  // THEN: First concept should be auto-selected, triggering parallel fetches for docs and mcqs
  await waitFor(() => {
    expect(apiService.getDocumentsByConcept).toHaveBeenCalledWith('C-1', 'test-token');
    expect(apiService.getMcqsByConcept).toHaveBeenCalledWith('C-1', 'test-token');
    
    // Check that document content is displayed
    expect(screen.getByText('Intro to Nodes')).toBeDefined();
    expect(screen.getByText(/A node contains data/)).toBeDefined();
    
    // Check that MCQ card question content is displayed
    expect(screen.getByText(/What happens if you lose the head pointer/)).toBeDefined();
  });
});

test('TopicModulePage handles switching selected concept and loading its content', async () => {
  // GIVEN: API responses are mocked
  vi.mocked(apiService.getUnlockedTopics).mockResolvedValue([mockTopic]);
  vi.mocked(apiService.getConceptsByTopic).mockResolvedValue(mockConcepts);
  vi.mocked(apiService.getDocumentsByConcept).mockResolvedValue(mockDocs);
  vi.mocked(apiService.getMcqsByConcept).mockResolvedValue(mockMcqs);

  const paramsPromise = Promise.resolve({ topicId: 'T-1' });

  // WHEN: Rendering the page
  render(<TopicModulePage params={paramsPromise} />);

  // Wait for initial load
  await waitFor(() => {
    expect(screen.getByText('Linked Lists')).toBeDefined();
  });

  // Setup mock for second concept fetch
  const mockSecondConceptDocs = [
    { id: 'D-2', title: 'Iteration Basics', content: 'Traversal is O(n).' }
  ];
  const mockSecondConceptMcqs = [
    { id: 'R-2', content: 'What is traversal complexity?', options: ['O(n)', 'O(1)'] }
  ];
  vi.mocked(apiService.getDocumentsByConcept).mockResolvedValue(mockSecondConceptDocs);
  vi.mocked(apiService.getMcqsByConcept).mockResolvedValue(mockSecondConceptMcqs);

  // WHEN: Clicking on the second concept button in the sidebar list
  const traversalBtn = screen.getByRole('button', { name: /Traversal/ });
  fireEvent.click(traversalBtn);

  // THEN: It should trigger fetch with C-2 and display its resources
  await waitFor(() => {
    expect(apiService.getDocumentsByConcept).toHaveBeenCalledWith('C-2', 'test-token');
    expect(apiService.getMcqsByConcept).toHaveBeenCalledWith('C-2', 'test-token');
    expect(screen.getByText('Iteration Basics')).toBeDefined();
    expect(screen.getByText(/Traversal is O\(n\)/)).toBeDefined();
    expect(screen.getByText(/What is traversal complexity/)).toBeDefined();
  });
});
