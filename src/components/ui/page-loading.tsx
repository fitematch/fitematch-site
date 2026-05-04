export function PageLoading() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute h-20 w-20 animate-spin rounded-full border-4 border-gray-800 border-t-gray-100" />
          <div className="h-10 w-10 rounded-full bg-gray-100/10" />
        </div>

        <h1 className="mt-8 text-2xl font-bold text-gray-100">
          Carregando
        </h1>

        <p className="mt-3 max-w-sm text-sm text-gray-300">
          Estamos preparando as informações para você.
        </p>
      </div>
    </section>
  );
}
