import Link from "next/link";
import subjectData from "@/data/subjects.json";

export default function SubjectsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-emerald-400 mb-2 text-center">Choose Your Subject</h1>
      <p className="text-gray-400 text-center mb-8">Grade 8 · CAPS Aligned</p>
      <div className="max-w-2xl mx-auto grid gap-4">
        {subjectData.subjects.map(s => (
          <Link key={s.id} href={`/subjects/${s.id}`} className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-emerald-500 transition">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <h2 className="font-bold text-lg">{s.name}</h2>
              <p className="text-gray-400 text-sm">{s.topics["8"]?.length || 0} topics</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
