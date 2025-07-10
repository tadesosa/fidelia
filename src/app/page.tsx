import Link from 'next/link'; // Usaremos Link para la navegación

export default function HomePage() {
  return (
    <main className="flex-1">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold" style={{fontFamily: "'Poppins', sans-serif", color: "#1f2937"}}>
            Fidelia MKT
          </h1>
        </div>
      </header>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Convierte Clientes Ocasionales en Fans
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  La plataforma de lealtad diseñada para la gastronomía de Mendoza.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-md bg-purple-700 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  Comenzar
                </Link>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&h=400&fit=crop"
              width="600"
              height="400"
              alt="Interior de un restaurante acogedor con clientes disfrutando"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-lg"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
