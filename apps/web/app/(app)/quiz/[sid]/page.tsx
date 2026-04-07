import { readFileSync } from 'fs'
import { join } from 'path'
import QuizGame from './QuizClient'

export default function Page({ params }: { params: { sid: string } }) {
  let questions: any[] = []
  let label = params.sid
  try { questions = JSON.parse(readFileSync(join(process.cwd(),'content','qbank',`${params.sid}.json`),'utf8')) } catch {}
  try { const s = JSON.parse(readFileSync(join(process.cwd(),'content','subjects.json'),'utf8')); const f = s.find((x:any)=>x.id===params.sid); if(f) label=f.label } catch {}
  return <QuizGame sid={params.sid} questions={questions} label={label} />
}
