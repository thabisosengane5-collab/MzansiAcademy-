import AmahleChat from "@/components/AmahleChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-emerald-400 mb-2">MzansiAcademy</h1>
        <p className="text-gray-400">Free gamified learning for SA Grade 8-12 learners</p>
      </div>
      <AmahleChat />
    </main>
  );
}
