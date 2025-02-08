import { useState, useEffect } from 'react'

interface SearchHistoryItem {
  url: string
  timestamp: number
  success: boolean
}

const HISTORY_KEY = 'crawl_search_history'
const MAX_HISTORY_ITEMS = 50

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])

  useEffect(() => {
    // Load history from localStorage on component mount
    const savedHistory = localStorage.getItem(HISTORY_KEY)
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const addToHistory = (url: string, success: boolean) => {
    const newItem: SearchHistoryItem = {
      url,
      timestamp: Date.now(),
      success
    }

    setHistory(prevHistory => {
      const newHistory = [newItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY)
    setHistory([])
  }

  return {
    history,
    addToHistory,
    clearHistory
  }
} 