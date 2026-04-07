import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: Request, { params }: { params: { sid: string } }) {
  try {
    const path = join(process.cwd(), 'content', 'qbank', `${params.sid}.json`)
    return NextResponse.json(JSON.parse(readFileSync(path, 'utf8')))
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
