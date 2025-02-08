import Link from 'next/link'
import fs from 'fs/promises'
import path from 'path'

async function getOutputFiles() {
  try {
    // Look for files in the frontend/output directory
    const outputDir = path.join(process.cwd(), 'output')
    const files = await fs.readdir(outputDir)
    
    // Get file stats to sort by modification time
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(outputDir, file)
        const stats = await fs.stat(filePath)
        return {
          name: file,
          type: path.extname(file).slice(1),
          path: `/api/files/${file}`,
          modifiedAt: stats.mtime
        }
      })
    )

    // Sort files by modification time, newest first
    return fileStats.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
  } catch (error) {
    console.error('Error reading output directory:', error)
    return []
  }
}

export default async function ResultsPage() {
  const files = await getOutputFiles()
  
  return (
    <main className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Crawling Results</h1>
        <Link
          href="/"
          className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Crawler
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {files.length === 0 ? (
          <p className="text-gray-600">No files have been generated yet.</p>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 bg-white"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{file.name}</h3>
                  <p className="text-sm text-gray-600">
                    Type: {file.type} • Modified: {file.modifiedAt.toLocaleString()}
                  </p>
                </div>
                <a
                  href={file.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
                >
                  View File
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 