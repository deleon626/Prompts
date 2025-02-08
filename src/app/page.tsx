import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Web Crawler Interface</h1>
      
      <div className="grid gap-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Add URLs to Crawl</h2>
          <form className="space-y-4" action="/api/crawl" method="POST">
            <div>
              <label htmlFor="urls" className="block text-sm font-medium mb-2">
                Enter URLs (one per line)
              </label>
              <textarea
                id="urls"
                name="urls"
                rows={5}
                className="w-full p-3 border rounded-md"
                placeholder="https://www.example.com"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start Crawling
            </button>
          </form>
        </div>

        <div className="flex justify-end">
          <Link
            href="/results"
            className="px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            View Crawling Results →
          </Link>
        </div>
      </div>
    </main>
  )
}
