import Link from 'next/link'
import fs from 'fs/promises'
import path from 'path'

async function getOutputFiles() {
  const outputDir = path.join(process.cwd(), '..', 'output')
  try {
    const files = await fs.readdir(outputDir)
    return files.map(file => ({
      name: file,
      type: path.extname(file).slice(1),
      path: `/api/files/${file}`
    }))
  } catch (error) {
    console.error('Error reading output directory:', error)
    return []
  }
}

export default async function ResultsPage() {
  const files = await getOutputFiles()
  
  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Crawling Results</h1>
        <Link
          href="/"
          className="px-4 py-2 text-blue-600 hover:text-blue-800"
        >
          ← Back to Crawler
        </Link>
      </div>

      <div className="grid gap-4">
        {files.length === 0 ? (
          <p className="text-gray-500">No files have been generated yet.</p>
        ) : (
          files.map((file) => (
            <div
              key={file.name}
              className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-gray-500">Type: {file.type}</p>
              </div>
              <a
                href={file.path}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View File
              </a>
            </div>
          ))
        )}
      </div>
    </main>
  )
} 