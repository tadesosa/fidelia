import { ShieldCheck, BarChart2, Users, Gift, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Fidelia</h1>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Características</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">¿Cómo funciona?</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Precios</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">Iniciar Sesión</button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-transform hover:scale-105 shadow-sm">
              Registrarse
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Convierte visitantes en clientes <span className="text-indigo-600">leales</span>.
            </h2>
            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-600">
              Fidelia es la plataforma todo-en-uno que te ayuda a premiar a tus clientes y a hacer crecer tu negocio con un sistema de puntos simple y poderoso.
            </p>
            <div className="mt-10 flex justify-center items-center gap-4">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-transform hover:scale-105 shadow-lg flex items-center gap-2">
                Crear cuenta de Local <ArrowRight size={20} />
              </button>
              <button className="text-indigo-600 font-semibold px-6 py-3">
                Ver Demo
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Todo lo que necesitas para fidelizar</h3>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Desde la gestión de clientes hasta premios personalizados.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2">Gestión de Clientes</h4>
                <p className="text-gray-600">Registra a tus clientes en segundos y mantené un historial de sus consumos y puntos acumulados.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Gift size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2">Premios Personalizados</h4>
                <p className="text-gray-600">Creá un catálogo de premios con imágenes y descripciones. Tus clientes canjearán sus puntos por recompensas que les encantarán.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart2 size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2">Analíticas Clave</h4>
                <p className="text-gray-600">Entendé el comportamiento de tus clientes: quiénes son los más leales, qué premios son más populares y mucho más.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
           <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Tan fácil como contar hasta 3</h3>
            </div>
            <div className="relative">
                {/* Linea de puntos */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>
                
                <div className="grid md:grid-cols-3 gap-12 relative">
                    <div className="text-center">
                        <div className="relative">
                            <div className="mx-auto w-20 h-20 flex items-center justify-center bg-white border-4 border-indigo-600 rounded-full text-indigo-600 text-2xl font-bold z-10 relative">1</div>
                        </div>
                        <h4 className="mt-6 text-xl font-bold">Registra tu Local</h4>
                        <p className="mt-2 text-gray-600">Crea tu cuenta en minutos y configura tu programa de lealtad.</p>
                    </div>
                    <div className="text-center">
                         <div className="relative">
                            <div className="mx-auto w-20 h-20 flex items-center justify-center bg-white border-4 border-indigo-600 rounded-full text-indigo-600 text-2xl font-bold z-10 relative">2</div>
                        </div>
                        <h4 className="mt-6 text-xl font-bold">Tus Clientes Suman Puntos</h4>
                        <p className="mt-2 text-gray-600">Cada compra se convierte en puntos. ¡Con puntos dobles automáticos!</p>
                    </div>
                    <div className="text-center">
                         <div className="relative">
                            <div className="mx-auto w-20 h-20 flex items-center justify-center bg-white border-4 border-indigo-600 rounded-full text-indigo-600 text-2xl font-bold z-10 relative">3</div>
                        </div>
                        <h4 className="mt-6 text-xl font-bold">Canjean Premios</h4>
                        <p className="mt-2 text-gray-600">Los clientes felices canjean sus puntos por los premios que vos ofreces.</p>
                    </div>
                </div>
            </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-600 text-white">
          <div className="container mx-auto px-6 py-20 text-center">
            <h3 className="text-3xl md:text-4xl font-bold">¿Listo para empezar a construir lealtad?</h3>
            <p className="mt-4 text-lg text-indigo-200 max-w-2xl mx-auto">
              Únete a la nueva generación de negocios que crecen gracias a sus clientes recurrentes.
            </p>
            <div className="mt-8">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg">
                Crear mi cuenta ahora
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-2xl font-bold">Fidelia</h1>
              <p className="text-gray-400">© {new Date().getFullYear()} Fidelia. Todos los derechos reservados.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
