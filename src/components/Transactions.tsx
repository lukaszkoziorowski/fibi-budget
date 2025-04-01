import TransactionList from './TransactionList';

const Transactions = () => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
        <TransactionList />
      </div>
    </div>
  );
};

export default Transactions; 