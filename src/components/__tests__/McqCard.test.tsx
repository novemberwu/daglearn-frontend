import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import McqCard from '../McqCard';
import { MOCK_MCQS } from '@/lib/mock-data';
import { apiService } from '@/services/api';

// Mock the API service
vi.mock('@/services/api', () => ({
  apiService: {
    submitAnswer: vi.fn(),
  },
}));

test('McqCard renders question and handles submission', async () => {
  const mockResult = { correct: true, conceptId: 'C-1', newProficiencyPercentage: 100 };
  vi.mocked(apiService.submitAnswer).mockResolvedValue(mockResult);

  const onResult = vi.fn();
  render(<McqCard mcq={MOCK_MCQS[0]} userId="test-user" onResult={onResult} />);

  expect(screen.getByText(MOCK_MCQS[0].content)).toBeDefined();
  
  // Select an option
  const option = screen.getByText(MOCK_MCQS[0].options[0]);
  fireEvent.click(option);

  // Submit
  const submitBtn = screen.getByText('Submit Answer');
  fireEvent.click(submitBtn);

  await waitFor(() => {
    expect(apiService.submitAnswer).toHaveBeenCalledWith("test-user", MOCK_MCQS[0].id, MOCK_MCQS[0].options[0]);
    expect(onResult).toHaveBeenCalledWith(mockResult);
    expect(screen.getByText(/Correct! Concept Mastery: 100%/)).toBeDefined();
  });
});
