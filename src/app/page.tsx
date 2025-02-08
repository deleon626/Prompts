'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SearchHistory } from './components/SearchHistory'
import { useSearchHistory } from './hooks/useSearchHistory'

interface CrawlOptions {
  urls: string
  browser: string
  timeout: string
  respectRobots: boolean
  waitForSelector?: string
  proxy?: string
  language: string
  crawlSubpages: boolean
  maxDepth: number
}

export default function Home() {
  const { addToHistory } = useSearchHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [options, setOptions] = useState<CrawlOptions>({
    urls: '',
    browser: 'chromium',
    timeout: '30',
    respectRobots: true,
    language: 'en',
    crawlSubpages: false,
    maxDepth: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      })

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
      
      // Add to search history
      const urlList = options.urls.split('\n').map(url => url.trim()).filter(Boolean)
      urlList.forEach(url => {
        addToHistory(url, data.results.find((r: any) => r.url === url)?.success ?? false)
      })
    } catch (error) {
      console.error('Error:', error)
      setResult('Error occurred while crawling')
      
      // Add failed attempt to history
      const urlList = options.urls.split('\n').map(url => url.trim()).filter(Boolean)
      urlList.forEach(url => addToHistory(url, false))
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Web Crawler</h1>
          <Link
            href="/results"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
          >
            View Results
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URLs (one per line)
              </label>
              <textarea
                value={options.urls}
                onChange={(e) => setOptions({ ...options, urls: e.target.value })}
                className="w-full h-32 p-2 border rounded-md bg-white text-gray-800"
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Browser
                </label>
                <select
                  value={options.browser}
                  onChange={(e) => setOptions({ ...options, browser: e.target.value })}
                  className="w-full p-2 border rounded-md bg-white text-gray-800"
                >
                  <option value="chromium">Chromium</option>
                  <option value="firefox">Firefox</option>
                  <option value="webkit">WebKit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  value={options.timeout}
                  onChange={(e) => setOptions({ ...options, timeout: e.target.value })}
                  className="w-full p-2 border rounded-md bg-white text-gray-800"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={options.language}
                  onChange={(e) => setOptions({ ...options, language: e.target.value })}
                  className="w-full p-2 border rounded-md bg-white text-gray-800"
                >
                  <option value="en">English</option>
                  <option value="id">Indonesian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wait for Selector
                </label>
                <input
                  type="text"
                  value={options.waitForSelector || ''}
                  onChange={(e) => setOptions({ ...options, waitForSelector: e.target.value })}
                  className="w-full p-2 border rounded-md bg-white text-gray-800"
                  placeholder="Optional CSS selector"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.respectRobots}
                  onChange={(e) => setOptions({ ...options, respectRobots: e.target.checked })}
                  className="h-4 w-4 text-blue-600 bg-white"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Respect robots.txt
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.crawlSubpages}
                  onChange={(e) => setOptions({ ...options, crawlSubpages: e.target.checked })}
                  className="h-4 w-4 text-blue-600 bg-white"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Crawl Subpages
                </label>
              </div>
            </div>

            {options.crawlSubpages && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Depth
                </label>
                <input
                  type="number"
                  value={options.maxDepth}
                  onChange={(e) => setOptions({ ...options, maxDepth: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md bg-white text-gray-800"
                  min="1"
                  max="5"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Maximum depth for crawling subpages (1-5)
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white shadow-sm ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Crawling...' : 'Start Crawling'}
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Result</h2>
            <pre className="p-4 bg-gray-50 rounded-lg overflow-auto text-gray-800 border">
              {result}
            </pre>
          </div>
        )}

        <SearchHistory />
      </main>
    </div>
  )
}
