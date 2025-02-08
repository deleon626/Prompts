import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const urls = data.get('urls')?.toString() || ''
    
    if (!urls) {
      return NextResponse.json(
        { error: 'No URLs provided' },
        { status: 400 }
      )
    }

    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url)

    // Execute the Python script for each URL
    const pythonScript = path.join(process.cwd(), '..', 'web_crawler.py')
    
    for (const url of urlList) {
      const python = spawn('python', [pythonScript, url])
      
      python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
      })
      
      python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
      })
    }

    return NextResponse.json({ 
      message: 'Crawling started',
      urls: urlList 
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 