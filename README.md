# Control Plane - Groovy Music Store

## Link al deploy de producción
El proyecto está desplegado y disponible en el siguiente enlace:
[https://etapa-3-control-plane-groovy-music.vercel.app](https://etapa-3-control-plane-groovy-music.vercel.app)

---

## Listado de usuarios disponibles para realizar pruebas
Para probar las funcionalidades de la plataforma con el rol de superadministrador, usar las siguientes credenciales:

* **Usuario / Email:** superadmin+clerk_test@iaw.com
* **Contraseña:** iawuser#

---

## Instrucciones para utilizar o evaluar la aplicación

1. **Acceso e inicio de sesión:** Ingresar al enlace de producción e iniciar sesión usando las credenciales de superadministrador compartidas arriba.
2. **Dashboard global:** Una vez adentro, se puede ver el estado operativo en tiempo real y una vista consolidada de los 4 microservicios principales (Envíos, Compradores, Productos y Transacciones).
3. **Navegación de detalles:** Cada tarjeta informativa tiene un botón de "Ver detalle". Al hacer clic, redirige a la vista detallada de esa sección específica dentro de esta misma aplicación.
4. **Acceso a paneles externos:** Dentro de la vista detallada de cada app, hay un enlace directo para entrar al panel de administrador nativo de ese microservicio. Para acceder, simplemente usar el mismo usuario y contraseña mencionados en la sección de pruebas.
5. **Simulación de errores y recarga:** Si alguna de las APIs externas experimenta lentitud o fallos de conexión, la tarjeta afectada va a mostrar un estado de error visual. Se puede usar el enlace "Forzar recarga" dentro de la misma tarjeta para reintentar la comunicación de manera individual.

---

## Breve descripción del proyecto

Control Plane es una webapp desarrollada de forma colaborativa que funciona como el panel de administración global e integrado para todo el ecosistema de Groovy Music Store. La idea principal es centralizar las operaciones de alto nivel, dejando que un superadministrador pueda supervisar y gestionar varios microservicios desde un solo lugar.

El panel ofrece una visión consolidada de las entidades más importantes de cada app del ecosistema: los envíos pendientes (Shipping App), los usuarios compradores registrados (Buyer App), el catálogo global de productos (Seller App) y el flujo de transacciones (Payments App). Cabe aclarar que esto no reemplaza los paneles de administración individuales, sino que los complementa dando una perspectiva de mayor nivel.

A nivel técnico, la aplicación está construida con Next.js, aprovechando el renderizado moderno y la integración de datos. El sistema se comunica directamente con las APIs de cada webapp individual mediante un cliente unificado, asegurando una experiencia fluida, reactiva y adaptada a dispositivos móviles.

---

## Notas o comentarios para la corrección

* **Integración de paneles nativos:** Armamos un flujo de navegación que conecta este panel global con las administraciones individuales. Desde la vista detallada, se puede saltar directamente a las apps externas usando un enlace dedicado, y se mantienen las mismas credenciales de superadministrador para facilitar las pruebas.
* **Carga eficiente (UX):** Implementamos un esquema de carga asíncrona usando Server Components combinados con Suspense de React. Cada tarjeta de métricas se renderiza por separado y muestra un estado de carga (CardSkeleton) mientras busca sus datos. Así evitamos que la lentitud de una API bloquee toda la pantalla.
* **Tolerancia a fallos:** Las consultas a las APIs externas (fetchShipping, fetchBuyer, etc.) tienen validación estricta. Si un microservicio responde mal o está caído, se captura el error de forma aislada mostrando una ErrorCard. Esto mantiene el resto del panel funcionando y da la opción de forzar la reconexión.
* **Diseño visual:** La interfaz sigue un estilo moderno y limpio con Tailwind CSS. 