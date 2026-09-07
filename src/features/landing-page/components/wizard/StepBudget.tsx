'use client';

import type { BudgetRange } from '@/shared/types/database';

interface StepBudgetProps {
  budgets: BudgetRange[];
  selectedBudgetId: string;
  selectBudget: (budgetId: string) => void;
}

export function StepBudget({
  budgets,
  selectedBudgetId,
  selectBudget,
}: StepBudgetProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-lg md:text-3xl">Price List</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {budgets.map((b) => (
          <button
            key={b.id}
            onClick={() => selectBudget(b.id)}
            className={`p-4 rounded-xl border transition flex flex-col justify-center items-center text-center aspect-square ${
              selectedBudgetId === b.id
                ? 'bg-charcoal-900 text-cream-50 border-charcoal-900 shadow-md'
                : 'bg-white border-cream-300 hover:bg-cream-200'
            }`}
          >
            <div className="font-bold text-sm md:text-base">{b.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
