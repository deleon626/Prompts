import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename
    const outputDir = path.join(process.cwd(), '..', 'output')
    const filePath = path.join(outputDir, filename)

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
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    )
  }
} 