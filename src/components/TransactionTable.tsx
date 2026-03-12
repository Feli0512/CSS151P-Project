import { Transaction } from '../types';
import { StatusBadge } from './StatusBadge';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
interface TransactionTableProps {
  transactions: Transaction[];
}
export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

              Equipment
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

              Department
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) =>
          <tr
            key={transaction.id}
            className="hover:bg-gray-50 transition-colors">

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                  className={`p-1.5 rounded-full mr-3 ${transaction.type === 'Borrow' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>

                    {transaction.type === 'Borrow' ?
                  <ArrowRightIcon size={14} /> :

                  <ArrowLeftIcon size={14} />
                  }
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {transaction.type}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {transaction.equipmentName}
                </div>
                <div className="text-xs text-gray-500">{transaction.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">
                  {transaction.department}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={transaction.status} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {transactions.length === 0 &&
      <div className="text-center py-8 text-gray-500">
          No recent transactions found.
        </div>
      }
    </div>);

}