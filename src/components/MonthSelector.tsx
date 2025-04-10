import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const MonthSelector = () => {
  const dispatch = useDispatch();
  const currentMonth = useSelector((state: RootState) => state.budget.currentMonth);

  const [year, month] = currentMonth.split('-').map(Number);

  const handlePreviousMonth = () => {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() - 1);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    dispatch({ type: 'budget/setCurrentMonth', payload: newMonth });
  };

  const handleNextMonth = () => {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    dispatch({ type: 'budget/setCurrentMonth', payload: newMonth });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    dispatch({ type: 'budget/setCurrentMonth', payload: newMonth });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    const newMonth = `${newYear}-${String(month).padStart(2, '0')}`;
    dispatch({ type: 'budget/setCurrentMonth', payload: newMonth });
  };

  const formatMonth = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const generateMonthOptions = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      const monthStr = String(i).padStart(2, '0');
      months.push(`${year}-${monthStr}`);
    }
    return months;
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handlePreviousMonth}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Previous month"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <div className="flex items-center space-x-2">
        <select
          value={currentMonth}
          onChange={handleMonthChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          aria-label="Select month"
        >
          {generateMonthOptions().map((monthOption) => (
            <option key={monthOption} value={monthOption}>
              {formatMonth(monthOption)}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={handleYearChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          aria-label="Select year"
        >
          {generateYearOptions().map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleNextMonth}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Next month"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <div className="text-lg font-semibold">
        {formatMonth(currentMonth)}
      </div>
    </div>
  );
};

export default MonthSelector; 