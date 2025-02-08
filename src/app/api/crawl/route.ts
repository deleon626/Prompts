import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

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

export async function POST(request: Request) {
  try {
    const data: CrawlOptions = await request.json()
    
    if (!data.urls) {
      return NextResponse.json(
        { error: 'No URLs provided' },
        { status: 400 }
      )
    }

    const urlList = data.urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url)

    // Execute the Python script for each URL
    const crawlerDir = path.join(process.cwd(), '..', 'crawler')
    const pythonPath = process.platform === 'win32' ? 'python' : 'python3'
    
    const results = await Promise.all(
      urlList.map(async (url) => {
        return new Promise((resolve) => {
          // Build command line arguments
          const args = [
            '-m', 'src.crawl_subpages',  // Run as module
            url,
            '--timeout', data.timeout,
          ]

          if (data.crawlSubpages) {
            args.push('--max-depth', data.maxDepth.toString())
          }

          const python = spawn(pythonPath, args, {
            cwd: crawlerDir  // Set working directory to crawler directory
          })
          
          let output = ''
          let errorOutput = ''
          
          python.stdout.on('data', (data) => {
            output += data.toString()
            console.log(`stdout: ${data}`)
          })
          
          python.stderr.on('data', (data) => {
            errorOutput += data.toString()
            console.error(`stderr: ${data}`)
          })

          python.on('close', (code) => {
            resolve({
              url,
              success: code === 0,
              output: output || errorOutput
            })
          })
        })
      })
    )

    return NextResponse.json({ 
      message: 'Crawling completed',
      results
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 