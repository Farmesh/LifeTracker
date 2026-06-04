export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <main className="w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30 sm:p-12">
        <section className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
              Productivity Tracker Project
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Life Dashboard: Track goals, habits, journals, and progress.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              This project is a modern personal productivity app built with Next.js, TypeScript, Tailwind CSS, and a clean mobile-first design. It helps you organize daily habits, plan goals, review analytics, and keep a daily journal — all in one premium dashboard.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold">Features</h2>
              <ul className="mt-4 space-y-3 text-zinc-600 dark:text-zinc-400">
                <li>• Dashboard with progress rings and overview cards</li>
                <li>• Goal management and habit tracking</li>
                <li>• Daily journal and study tracker</li>
                <li>• Analytics, calendar view, and life areas</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold">About the Creator</h2>
              <div className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
                <p><span className="font-medium text-zinc-900 dark:text-zinc-100">Name:</span> Farmesh Thakur</p>
                <p><span className="font-medium text-zinc-900 dark:text-zinc-100">Phone:</span> 7876602243</p>
                <p><span className="font-medium text-zinc-900 dark:text-zinc-100">Email:</span> thakurfarmesh123@okicici</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
