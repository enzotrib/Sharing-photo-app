import os
from pathlib import Path

def collect_nextjs_files(
    root_dir: str,
    extensions: list[str] = ['.tsx', '.jsx', '.ts', '.js'],
    special_files: list[str] = ['page.tsx', 'layout.tsx', 'loading.tsx', 'error.tsx', 'route.ts'],
    exclude_dirs: list[str] = [
        'node_modules', '.git', 'dist', '.next', 'build', 
        'coverage', 'public', '.github'
    ],
    exclude_files: list[str] = ['next-env.d.ts', '.eslintrc.js'],
    base_prompt: str = """Instrucciones Base:
- Este es un proyecto Next.js 14 con App Router
- Analiza la estructura de carpetas y archivos especiales (page, layout, loading, etc.)
- Presta atención a los Server y Client Components
- Identifica el manejo de estado y patrones de datos
"""
) -> None:
    """
    Recorre un directorio Next.js 14 y combina los archivos relevantes.
    """
    
    root_path = Path(root_dir)
    output_file = root_path / 'nextjs_codebase.txt'
    
    # Estructura para organizar archivos
    file_categories = {
        'app_structure': [],     # Layouts, pages, etc.
        'components': [],        # Components
        'lib': [],              # Utilities and libraries
        'hooks': [],            # Custom hooks
        'api': [],              # API routes
        'styles': [],           # CSS/styling files
        'config': [],           # Configuration files
        'types': [],            # TypeScript types
        'other': []             # Other files
    }
    
    # Estadísticas
    stats = {
        'pages': 0,
        'layouts': 0,
        'components': 0,
        'api_routes': 0,
        'hooks': 0,
        'server_components': 0,
        'client_components': 0,
        'total_files': 0
    }
    
    def categorize_file(file_path: Path) -> str:
        """Categoriza el archivo basado en su ubicación y nombre"""
        path_str = str(file_path).lower()
        name = file_path.name
        
        # Detectar si es un Server o Client Component
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'use client' in content.lower():
                    stats['client_components'] += 1
                else:
                    stats['server_components'] += 1
        except:
            pass
        
        # Categorizar el archivo
        if name in special_files:
            if name == 'page.tsx':
                stats['pages'] += 1
            elif name == 'layout.tsx':
                stats['layouts'] += 1
            return 'app_structure'
        elif 'components' in path_str:
            stats['components'] += 1
            return 'components'
        elif 'hooks' in path_str or name.startswith('use'):
            stats['hooks'] += 1
            return 'hooks'
        elif 'api' in path_str or name == 'route.ts':
            stats['api_routes'] += 1
            return 'api'
        elif 'lib' in path_str or 'utils' in path_str:
            return 'lib'
        elif file_path.suffix in ['.css', '.scss', '.sass']:
            return 'styles'
        elif name.endswith('.d.ts') or 'types' in path_str:
            return 'types'
        elif name in ['next.config.js', 'middleware.ts', 'tsconfig.json']:
            return 'config'
        return 'other'

    def should_include_file(file_path: Path) -> bool:
        return (
            (file_path.suffix in extensions or file_path.name in special_files) and
            file_path.name not in exclude_files and
            not any(excluded in str(file_path) for excluded in exclude_dirs)
        )
    
    # Recolectar y categorizar archivos
    for file_path in root_path.rglob('*'):
        if file_path.is_file() and should_include_file(file_path):
            category = categorize_file(file_path)
            file_categories[category].append(file_path)
            stats['total_files'] += 1
    
    # Escribir el archivo de salida
    with open(output_file, 'w', encoding='utf-8') as output:
        # Escribir el prompt base
        output.write(base_prompt + "\n\n")
        output.write("="*80 + "\n")
        output.write("ESTRUCTURA DEL PROYECTO NEXT.JS 14\n")
        output.write("="*80 + "\n\n")
        
        # Procesar cada categoría
        for category, files in file_categories.items():
            if files:
                output.write(f"\n\n{'='*80}\n")
                output.write(f"SECCIÓN: {category.upper().replace('_', ' ')}\n")
                output.write(f"{'='*80}\n\n")
                
                # Ordenar archivos por profundidad de ruta y nombre
                files.sort(key=lambda x: (len(str(x.relative_to(root_path)).split(os.sep)), str(x)))
                
                for file_path in files:
                    try:
                        with open(file_path, 'r', encoding='utf-8') as source_file:
                            content = source_file.read()
                        
                        relative_path = file_path.relative_to(root_path)
                        output.write(f"\n### Archivo: {relative_path} ###\n")
                        
                        # Detectar si es Client Component
                        if 'use client' in content.lower():
                            output.write("# Client Component\n")
                        
                        output.write("-"*80 + "\n")
                        output.write(content)
                        output.write("\n" + "-"*80 + "\n")
                        
                        print(f"Procesado: {relative_path}")
                    
                    except Exception as e:
                        print(f"Error al procesar {file_path}: {str(e)}")
        
        # Escribir resumen
        output.write("\n\n" + "="*80 + "\n")
        output.write("RESUMEN DEL PROYECTO NEXT.JS 14\n")
        output.write("="*80 + "\n")
        output.write(f"\nTotal de archivos: {stats['total_files']}\n")
        output.write(f"Pages: {stats['pages']}\n")
        output.write(f"Layouts: {stats['layouts']}\n")
        output.write(f"Components: {stats['components']}\n")
        output.write(f"API Routes: {stats['api_routes']}\n")
        output.write(f"Hooks: {stats['hooks']}\n")
        output.write(f"Server Components: {stats['server_components']}\n")
        output.write(f"Client Components: {stats['client_components']}\n")

if __name__ == "__main__":
    # Configuración
    PROJECT_DIR = "."  # Directorio actual
    
    # Prompt específico para Next.js 14
    BASE_PROMPT = """Instrucciones para el Análisis del Proyecto Next.js 14:

1. Este es un proyecto Next.js 14 que utiliza el App Router
2. Aspectos clave a considerar:
   - Estructura de carpetas app/
   - Server y Client Components
   - Archivos especiales (page, layout, loading, error)
   - API Routes y manejo de datos
   - Patrones de optimización y renderizado
3. La aplicación utiliza:
   - Server Components por defecto
   - TypeScript
   - Estructuras de datos y estado
4. Usa este contexto para responder preguntas sobre la aplicación
"""
    
    # Ejecutar el script
    collect_nextjs_files(
        root_dir=PROJECT_DIR,
        base_prompt=BASE_PROMPT
    )
    
    print("\n¡Proceso completado! El archivo nextjs_codebase.txt ha sido generado.")