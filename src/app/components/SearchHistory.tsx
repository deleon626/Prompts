import { useSearchHistory } from '../hooks/useSearchHistory'

export function SearchHistory() {
  const { history, clearHistory } = useSearchHistory()

  if (history.length === 0) {
    return null
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Search History</h2>
        <button
          onClick={clearHistory}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-2">
        {history.map((item, index) => (
          <div
            key={item.timestamp + index}
            className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50 bg-white"
          >
            <div>
              <p className="font-medium text-gray-800">{item.url}</p>
              <p className="text-sm text-gray-600">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                item.success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {item.success ? 'Success' : 'Failed'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 