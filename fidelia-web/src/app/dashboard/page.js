import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=Debes iniciar sesión para acceder a esta página.')
  }

  const userRole = user.user_metadata?.role

  // Variables para guardar los datos
  let clientes = []
  let premios = []
  let misPuntos = []
  let perfilLocal = null
  let historialCliente = []
  let premiosDisponibles = []

  if (userRole === 'local') {
    const clientesData = await supabase.from('clientes').select('*').eq('local_id', user.id).order('nombre', { ascending: true });
    const premiosData = await supabase.from('premios').select('*').eq('local_id', user.id).order('puntos_costo', { ascending: true });
    const perfilData = await supabase.from('profiles').select('dias_dobles').eq('id', user.id).single();
    
    clientes = clientesData.data || []
    premios = premiosData.data || []
    perfilLocal = perfilData.data
  } else if (userRole === 'cliente') {
    const misPuntosData = await supabase.rpc('get_mis_puntos')
    const historialData = await supabase.rpc('get_historial_cliente')
    const premiosData = await supabase.rpc('get_premios_disponibles_cliente')
    
    misPuntos = misPuntosData.data || []
    historialCliente = historialData.data || []
    premiosDisponibles = premiosData.data || []
  }

  // Agrupamos los premios por local para la vista del cliente
  const premiosPorLocal = premiosDisponibles.reduce((acc, premio) => {
    const local = premio.nombre_local || 'Local sin nombre';
    if (!acc[local]) {
      acc[local] = [];
    }
    acc[local].push(premio);
    return acc;
  }, {});

  const signOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/')
  }
  
  const manageClient = async (formData) => {
    'use server'
    const supabase = createClient()
    const action = formData.get('action');

    if (action === 'add_consumo') {
        const cliente_id = formData.get('cliente_id');
        const monto = formData.get('monto');
        if (cliente_id && monto) {
            const { error } = await supabase.rpc('add_consumo_y_puntos', {
                cliente_id_param: parseInt(cliente_id),
                monto_consumido_param: parseFloat(monto)
            });
            if (error) console.error("Error al añadir consumo:", error);
        }
    } else if (action === 'redeem_prize') {
        const cliente_id = formData.get('cliente_id');
        const premio_id = formData.get('premio_id');
        if (cliente_id && premio_id) {
            const { error, data } = await supabase.rpc('canjear_premio', {
                cliente_id_param: parseInt(cliente_id),
                premio_id_param: parseInt(premio_id)
            });
            if (error) console.error("Error al canjear premio:", error);
            console.log(data); 
        }
    }
    revalidatePath('/dashboard');
  }

  const manageSettings = async (formData) => {
    'use server'
    const supabase = createClient()
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const dias_dobles = dias.map(dia => formData.get(dia) === 'on');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { error } = await supabase.from('profiles').update({ dias_dobles }).eq('id', user.id);
        if (error) console.error("Error al guardar días dobles:", error);
    }
    revalidatePath('/dashboard');
  }

  const addClient = async (formData) => {
    'use server'
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { error } = await supabase.from('clientes').insert({ 
            nombre: formData.get('nombre'), 
            email: formData.get('email'), 
            telefono: formData.get('telefono'), 
            local_id: user.id 
        })
        if(error) { console.error('Error al insertar cliente:', error) } 
        else { revalidatePath('/dashboard') }
    }
  }

  const addPrize = async (formData) => {
    'use server'
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const imagen = formData.get('imagen')
        if (imagen && imagen.size > 0) {
            const filePath = `${user.id}/${Date.now()}-${imagen.name}`
            const { error: uploadError } = await supabase.storage.from('imagenes_premios').upload(filePath, imagen)
            if (uploadError) { console.error('Error al subir imagen:', uploadError); return; }

            const { error: insertError } = await supabase.from('premios').insert({ 
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion'),
                puntos_costo: formData.get('puntos_costo'),
                imagen_path: filePath, 
                local_id: user.id 
            })
            if(insertError) { console.error('Error al insertar premio:', insertError) }
            else { revalidatePath('/dashboard') }
        }
    }
  }

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-8">
      <div className="w-full max-w-5xl p-6 sm:p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">¡Bienvenido a Fidelia!</h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600">Sesión iniciada como: <span className="font-semibold">{user.email}</span></p>
            </div>
            <form action={signOut}>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">
                    Cerrar Sesión
                </button>
            </form>
        </div>
        
        {userRole === 'local' && (
          <div className="space-y-12">
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuración</h2>
                <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h3 className="text-xl font-bold text-indigo-800 mb-4">Configurar Puntos Dobles</h3>
                    <form action={manageSettings}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
                            {diasSemana.map((dia, index) => (
                                <div key={dia} className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id={dia.toLowerCase()} 
                                        name={dia.toLowerCase()} 
                                        defaultChecked={perfilLocal?.dias_dobles?.[index]}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={dia.toLowerCase()} className="ml-2 block text-sm text-gray-900">{dia}</label>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Guardar Configuración</button>
                    </form>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestionar Clientes</h2>
                <div className="p-6 bg-gray-50 rounded-lg border">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Mis Clientes</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Puntos</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {clientes.length > 0 ? (
                                    clientes.map(cliente => (
                                        <tr key={cliente.id}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                                                <div className="text-sm text-gray-500">{cliente.email}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-bold text-indigo-600">{cliente.puntos}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <form action={manageClient} className="flex items-center gap-2">
                                                        <input type="hidden" name="action" value="add_consumo" />
                                                        <input type="hidden" name="cliente_id" value={cliente.id} />
                                                        <input type="number" name="monto" placeholder="Monto $" required step="0.01" className="w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"/>
                                                        <button type="submit" className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700" title="Añadir Consumo">+</button>
                                                    </form>
                                                    <form action={manageClient} className="flex items-center gap-2">
                                                        <input type="hidden" name="action" value="redeem_prize" />
                                                        <input type="hidden" name="cliente_id" value={cliente.id} />
                                                        <select name="premio_id" required className="w-32 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm">
                                                            <option value="">Elegir premio...</option>
                                                            {premios.map(premio => (
                                                                <option key={premio.id} value={premio.id} disabled={cliente.puntos < premio.puntos_costo}>
                                                                    {premio.nombre} ({premio.puntos_costo} pts)
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button type="submit" className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700" title="Canjear Premio">Canjear</button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">Aún no has registrado ningún cliente.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                 <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200 mt-8">
                  <h3 className="text-xl font-bold text-indigo-800 mb-4">Registrar Nuevo Cliente</h3>
                  <form action={addClient} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input type="text" name="nombre" id="nombre" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                      <input type="tel" name="telefono" id="telefono" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div className="sm:col-span-2">
                      <button type="submit" className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Agregar Cliente
                      </button>
                    </div>
                  </form>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestionar Premios</h2>
                <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h3 className="text-xl font-bold text-indigo-800 mb-4">Añadir Nuevo Premio</h3>
                    <form action={addPrize} className="space-y-4">
                        <div>
                            <label htmlFor="nombre_premio" className="block text-sm font-medium text-gray-700">Nombre del Premio</label>
                            <input type="text" name="nombre" id="nombre_premio" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea name="descripcion" id="descripcion" rows="2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <div>
                            <label htmlFor="puntos_costo" className="block text-sm font-medium text-gray-700">Puntos necesarios</label>
                            <input type="number" name="puntos_costo" id="puntos_costo" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">Imagen del Premio</label>
                            <input type="file" name="imagen" id="imagen" required accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"/>
                        </div>
                        <button type="submit" className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Añadir Premio</button>
                    </form>
                </div>
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Mis Premios</h3>
                    {premios.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {premios.map(premio => (
                                <div key={premio.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                                    <img 
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagenes_premios/${premio.imagen_path}`} 
                                        alt={premio.nombre}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="text-lg font-bold">{premio.nombre}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{premio.descripcion}</p>
                                        <div className="mt-4 font-bold text-indigo-600 text-lg">{premio.puntos_costo} Puntos</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Aún no has creado ningún premio.</p>
                    )}
                </div>
            </section>
          </div>
        )}

        {userRole === 'cliente' && (
          <div className="space-y-12">
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Puntos</h2>
                {misPuntos.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {misPuntos.map((punto, index) => (
                            <li key={index} className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-700">{punto.nombre_local || 'Local sin nombre'}</span>
                                <span className="text-xl font-bold text-green-600">{punto.puntos} Puntos</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 bg-gray-50 p-6 rounded-lg">Aún no estás registrado en ningún local.</p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Premios Disponibles</h2>
                <div className="space-y-8">
                    {Object.keys(premiosPorLocal).length > 0 ? (
                        Object.entries(premiosPorLocal).map(([local, premios]) => (
                            <div key={local}>
                                <h3 className="text-xl font-semibold text-indigo-700 mb-4 pb-2 border-b-2 border-indigo-200">{local}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {premios.map((premio, index) => (
                                        <div key={index} className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
                                            <img 
                                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagenes_premios/${premio.imagen_path_premio}`} 
                                                alt={premio.nombre_premio}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h4 className="text-lg font-bold">{premio.nombre_premio}</h4>
                                                <p className="text-sm text-gray-600 mt-1 flex-grow">{premio.descripcion_premio}</p>
                                                <div className="mt-4 font-bold text-indigo-600 text-lg">{premio.puntos_costo_premio} Puntos</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 bg-gray-50 p-6 rounded-lg">No hay premios disponibles en los locales donde estás registrado.</p>
                    )}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mi Historial</h2>
                <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Puntos</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {historialCliente.length > 0 ? (
                                historialCliente.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.fecha).toLocaleString('es-AR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nombre_local}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.descripcion}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${item.puntos_cambio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.puntos_cambio > 0 ? `+${item.puntos_cambio}` : item.puntos_cambio}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No hay movimientos en tu historial.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
