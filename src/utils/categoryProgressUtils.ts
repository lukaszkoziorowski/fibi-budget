export interface CategoryProgressInputs {
  budgeted: number;
  spending: number;
  available: number;
  target?: number;
  upcomingTransaction?: number;
  goal?: number;
  creditSpending?: number;
}

export interface CategoryProgressOutput {
  color: 'green' | 'yellow' | 'red' | 'blue';
  fillPercent: number;
}

/**
 * Determines the progress bar color and fill level for a YNAB-style budget category
 * 
 * @param inputs - The category progress inputs
 * @returns The progress bar color and fill percentage
 */
export const getCategoryProgress = (inputs: CategoryProgressInputs): CategoryProgressOutput => {
  const {
    budgeted,
    spending,
    available,
    target = 0,
    upcomingTransaction = 0,
    goal = 0,
    creditSpending = 0
  } = inputs;

  // Calculate fill percentage based on spending vs budgeted
  let fillPercent = 0;
  
  // If there's a goal, show percentage of goal reached
  if (goal > 0) {
    fillPercent = Math.min(Math.max((spending / goal) * 100, 0), 100);
    return {
      color: 'blue',
      fillPercent
    };
  }
  
  // Otherwise, show percentage of budgeted amount spent
  if (budgeted > 0) {
    // For negative spending (refunds), show 0% progress
    if (spending < 0) {
      fillPercent = 0;
    } else {
      fillPercent = Math.min((spending / budgeted) * 100, 100);
    }
  }

  // Determine color based on rules
  // Red: if spending > available OR (credit_spending > budgeted)
  if (spending > available || creditSpending > budgeted) {
    return {
      color: 'red',
      fillPercent
    };
  }
  
  // Yellow: if budgeted < target OR upcoming transaction > available
  if (budgeted < target || upcomingTransaction > available) {
    return {
      color: 'yellow',
      fillPercent
    };
  }
  
  // Green: if available > 0 and spending <= budgeted
  if (available > 0 && spending <= budgeted) {
    return {
      color: 'green',
      fillPercent
    };
  }
  
  // Default to green if no other conditions are met
  return {
    color: 'green',
    fillPercent
  };
}; 