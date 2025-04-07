import { useBudgetStats } from '@/hooks/useBudgetStats';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/utils/formatters';

const BudgetStats = () => {
  const { assignedTotal, totalExpenses, availableToAssign } = useBudgetStats();
  const { currencyFormat } = useCurrency();

  const percentUsed = assignedTotal > 0 ? (totalExpenses / assignedTotal) * 100 : 0;

  const getProgressBarColor = () => {
    if (percentUsed >= 100) return 'danger';
    if (percentUsed >= 80) return 'warning';
    return 'success';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-600">Total Budget</p>
          <p className="text-2xl font-bold">
            {formatCurrency(assignedTotal, currencyFormat)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Total Spent</p>
          <p className="text-2xl font-bold">
            {formatCurrency(totalExpenses, currencyFormat)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Remaining</p>
          <p className="text-2xl font-bold">
            {formatCurrency(availableToAssign, currencyFormat)}
          </p>
        </div>
      </div>
      <div className="relative pt-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gray-200">
              Budget Usage
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block">
              {percentUsed.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            role="progressbar"
            aria-valuenow={percentUsed}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${getProgressBarColor()}-500`}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetStats; 