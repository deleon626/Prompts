import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = await params;
    // Look for files in the frontend/output directory
    const outputDir = path.join(process.cwd(), 'output')
    const filePath = path.join(outputDir, filename)

    // Verify the file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Read file contents
    const content = await fs.readFile(filePath, 'utf-8')

    // Determine content type based on file extension
    const ext = path.extname(filename)
    const contentType = ext === '.md' 
      ? 'text/markdown'
      : ext === '.html'
      ? 'text/html'
      : 'text/plain'

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        // Add cache control to prevent caching
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 