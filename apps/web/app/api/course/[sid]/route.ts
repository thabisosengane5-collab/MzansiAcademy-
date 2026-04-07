import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest, { params }: { params: { sid: string } }) {
  try {
    const file = join(process.cwd(), 'content', 'courses', `${params.sid}.json`)
    return NextResponse.json(JSON.parse(readFileSync(file, 'utf8')))
  } catch {
    return NextResponse.json(null, { status: 404 })
  }
}
