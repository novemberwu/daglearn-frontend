'use client';

import { MOCK_PROFICIENCIES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { BarChart3, Award } from 'lucide-react';

export default function ProgressPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-serif">My Learning Progress</h1>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 flex items-center gap-6">
        <div className="bg-indigo-600 p-4 rounded-full text-white">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-indigo-900">Keep it up, Rachel!</h2>
          <p className="text-indigo-700">You're making steady progress across 3 concepts.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {MOCK_PROFICIENCIES.map((item) => (
          <div key={item.conceptId} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">{item.conceptName}</h3>
              <span className={cn(
                "text-sm font-bold px-2 py-1 rounded",
                item.percentage >= 90 ? "text-blue-900 bg-blue-100" :
                item.percentage >= 60 ? "text-blue-700 bg-blue-50" : "text-blue-400 bg-blue-50/50"
              )}>
                {item.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={cn(
                  "h-2.5 rounded-full transition-all duration-500",
                  item.percentage >= 90 ? "bg-blue-800" :
                  item.percentage >= 60 ? "bg-blue-500" : "bg-blue-200"
                )} 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
