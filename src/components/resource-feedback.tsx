interface ResourceFeedbackProps {
  title: string;
  detail: string;
}

export function ResourceFeedback({ title, detail }: ResourceFeedbackProps) {
  return (
    <main className="flex w-full flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 xl:px-7">
      <section className="w-full rounded-[2rem] border border-white/10 bg-black/20 p-8">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-mist)]">
          {detail}
        </p>
      </section>
    </main>
  );
}
