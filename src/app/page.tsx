import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Student Dropout Risk Detector Expert System
          </h1>
        <p className="max-w-2xl text-base font-medium leading-relaxed text-slate-900">
          This system helps advisors and administrators assess student dropout risk 
          by analyzing key student information. Enter at least three facts about a 
          student to receive a risk assessment and recommended actions.
        </p>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            How it works
          </h2>
          <ol className="space-y-3 text-base font-medium text-slate-900">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                1
              </span>
              <span>
                <Link href="/login" className="font-bold text-blue-700 hover:text-blue-800 cursor-pointer">
                  Log in
                </Link>{" "}
                to access the system
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                2
              </span>
              <span>
                Go to the{" "}
                <Link href="/risk-detector" className="font-bold text-blue-700 hover:text-blue-800 cursor-pointer">
                  Risk Detector
                </Link>{" "}
                and enter at least three facts about a student
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                3
              </span>
              <span>
                Review the dropout risk assessment and recommended actions
              </span>
            </li>
          </ol>
        </div>
      </section>
      <section className="space-y-4">
        <div className="rounded-2xl border bg-gradient-to-br from-blue-600 to-sky-500 p-6 text-white shadow-md">
          <h2 className="mb-2 text-lg font-bold">
            Knowledge Base
          </h2>
          <p className="mb-4 text-sm font-medium text-blue-50">
            Learn about the facts the expert system uses to evaluate dropout risk.
          </p>
          <Link
            href="/knowledge-base"
            className="inline-flex items-center justify-center rounded-lg bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30 cursor-pointer"
          >
            View Knowledge Base Facts
          </Link>
        </div>
      </section>
    </div>
  );
}
