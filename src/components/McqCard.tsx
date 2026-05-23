'use client';

import { useState } from 'react';
import { McqDto, AttemptResult } from '@/types';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';

interface McqCardProps {
  mcq: McqDto;
  userId: string;
  token?: string;
  onResult: (result: AttemptResult) => void;
}

export default function McqCard({ mcq, userId, token, onResult }: McqCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);

  const handleSubmit = async () => {
    if (!selectedOption || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await apiService.submitAnswer(userId, mcq.id, selectedOption, token);
      setResult(response);
      onResult(response);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{mcq.content}</h3>
      <div className="space-y-3">
        {mcq.options.map((option) => (
          <button
            key={option}
            disabled={isSubmitting || result !== null}
            onClick={() => setSelectedOption(option)}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-all",
              selectedOption === option 
                ? result 
                  ? result.correct ? "border-green-600 bg-green-50 ring-1 ring-green-600" : "border-red-600 bg-red-50 ring-1 ring-red-600"
                  : "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" 
                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50",
              (isSubmitting || result !== null) && "cursor-not-allowed"
            )}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end items-center gap-4">
        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Answer
          </button>
        ) : (
          <div className={cn(
            "flex items-center gap-2 font-medium px-4 py-2 rounded-lg",
            result.correct ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
          )}>
            {result.correct ? (
              <><CheckCircle2 className="w-5 h-5" /> Correct! Concept Mastery: {result.newProficiencyPercentage}%</>
            ) : (
              <><XCircle className="w-5 h-5" /> Incorrect. Try reviewing the concept.</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
