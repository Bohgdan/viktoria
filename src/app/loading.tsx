export default function Loading() {
  return (
    <div className="min-h-screen relative z-10 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--color-text-secondary)]">Завантаження...</p>
      </div>
    </div>
  );
}
