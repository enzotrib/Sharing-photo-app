# Proyecto Next.js 14 - Galería de Fotos en Tiempo Real

## 📋 Descripción General
Una aplicación web moderna construida con Next.js 14 que permite a los usuarios subir selfies y fotos para eventos en tiempo real. Incluye un carrusel de visualización con efectos visuales y un panel de administración para gestionar el contenido.

## 🏗️ Arquitectura

### Tecnologías Principales
- **Next.js 14** con App Router
- **Supabase** para base de datos y autenticación
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **shadcn/ui** para componentes de UI

### Estructura del Proyecto
```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   └── login/
│   ├── carousel/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── utils/
```

## 🔑 Características Principales

### 1. Sistema de Subida de Fotos
- Captura de fotos con la cámara del dispositivo
- Compresión de imágenes en el cliente
- Comentarios y emojis para cada foto
- Vista previa antes de subir

### 2. Carrusel Interactivo
- Visualización estilo Polaroid
- Efectos visuales:
  - Flash
  - Emojis flotantes
  - Confetti
- Modo pantalla completa
- Actualización en tiempo real

### 3. Panel de Administración
- Autenticación segura
- Gestión de fotos:
  - Aprobación/Rechazo
  - Eliminación
  - Vista previa
- Configuración del carrusel:
  - Intervalos de transición
  - Límite de fotos
  - Efectos visuales

## 💻 Componentes Principales

### `UploadPhoto`
- Maneja la captura y subida de fotos
- Incluye compresión de imágenes
- Selector de emojis integrado
- Validación de archivos

### `PolaroidCarousel`
- Visualización estilo Polaroid
- Transiciones suaves
- Soporte para comentarios
- Decoraciones personalizables


### `CarouselSettings`
- Configuración completa del carrusel
- Controles interactivos
- Guardado automático
- Actualización en tiempo real

## 🔧 Hooks Personalizados

### `useCarouselSettings`
- Gestión del estado del carrusel
- Cache local
- Suscripción a cambios en tiempo real
- Manejo de errores


## 🔐 Seguridad

### Autenticación
- Implementación con Supabase
- Middleware de protección de rutas
- Manejo de sesiones
- Redirecciones seguras

### Gestión de Archivos
- Validación de tipos de archivo
- Límites de tamaño
- Compresión automática
- Almacenamiento seguro

## 🎨 Diseño y UI

### Temas
- Modo oscuro por defecto
- Gradientes y efectos visuales
- Diseño responsive
- Animaciones fluidas

### Componentes UI
- Integración con shadcn/ui
- Personalización de componentes
- Feedback visual
- Accesibilidad

## 🚀 Optimizaciones

### Rendimiento
- Compresión de imágenes
- Lazy loading
- Caché local
- Optimización de componentes

### UX
- Feedback inmediato
- Transiciones suaves
- Indicadores de carga
- Mensajes de error claros


## 🔄 Estado y Datos

### Supabase
- Tablas:
  - `uploads` - Almacena metadatos y URLs de las fotos
  - `carousel_settings` - Configuración del carrusel
- Storage Buckets:
  - `photos` - Almacenamiento de imágenes
    - Límite por archivo: 5MB
    - Formatos permitidos: image/jpeg, image/png, image/webp
    - Nomenclatura: timestamp_filename
- Autenticación:
  - Roles de usuario
  - Políticas de seguridad (RLS)
- Suscripciones en tiempo real:
  - Cambios en fotos
  - Actualizaciones de configuración

### Cliente
- Estado local con React useState
- Cache local para configuraciones
- Manejo de errores y carga
- Actualizaciones en tiempo real vía Supabase Realtime
- Gestión de subida y compresión de imágenes

### Requisitos
```bash
Node.js >= 18
npm o yarn
Cuenta en Supabase
```

### Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar desarrollo
npm run dev
```

## 📖 Uso

### Para Usuarios
1. Acceder a la página principal
2. Capturar foto o seleccionar archivo
3. Agregar comentario (opcional)
4. Compartir foto

### Para Administradores
1. Acceder a /admin
2. Iniciar sesión
3. Gestionar fotos pendientes
4. Configurar carrusel

### Visualización de Fotos
1. Acceder a /carousel para ver todas las fotos aprobadas en modo presentación

## 👥 Contribuidores
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/tomiban">
        <img src="https://github.com/tomiban.png" width="100px;" alt="tomiban"/><br />
        <sub><b>tomiban</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/enzotrib">
        <img src="https://github.com/enzotrib.png" width="100px;" alt="enzotrib"/><br />
        <sub><b>enzotrib</b></sub>
      </a>
    </td>
  </tr>
</table>
