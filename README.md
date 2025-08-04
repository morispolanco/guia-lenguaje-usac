# Lenguaje USAC - Plataforma Educativa

Plataforma educativa interactiva para la preparación del examen de lenguaje de la Universidad de San Carlos de Guatemala, basada en la Guía Temática oficial.

## 🎯 Características

- **6 Módulos Educativos** basados en la Guía Temática oficial de la USAC
- **Sistema de Gamificación** con puntos, progreso y insignias
- **Contenido Generado por IA** utilizando Google Gemini
- **Autenticación Segura** con Supabase
- **Pagos de Una Sola Vez** con Stripe ($19 USD)
- **Diseño Responsivo** optimizado para dispositivos móviles

## 🚀 Desarrollo Local

### Prerrequisitos
- Node.js 18+ (solo para comandos de Vercel)
- Navegador web moderno

### Inicio Rápido
```bash
# Opción 1: Servidor web simple
npm run serve

# Opción 2: Abrir directamente en navegador
open index.html
```

### Desarrollo con Vercel
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo de Vercel
npm run dev

# Vista previa de despliegue
npm run preview

# Despliegue a producción
npm run deploy
```

## 📁 Estructura del Proyecto

```
/
├── index.html          # Punto de entrada principal
├── app.js             # Lógica de la aplicación
├── styles.css         # Estilos principales
├── yw_manifest.json   # Configuración de IA
├── vercel.json        # Configuración de Vercel
├── package.json       # Configuración del proyecto
└── YOUWARE.md         # Documentación técnica
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Supabase (Database, Auth)
- **Pagos**: Stripe Checkout
- **IA**: Google Gemini via Youware AI SDK
- **Hosting**: Vercel

## 🔧 Configuración

### Variables de Entorno
Las siguientes variables están configuradas en `vercel.json`:

- `SUPABASE_URL` - URL del proyecto Supabase
- `SUPABASE_ANON_KEY` - Clave pública de Supabase
- `STRIPE_PUBLISHABLE_KEY` - Clave pública de Stripe
- `STRIPE_PRICE_ID` - ID del precio de Stripe ($19 USD)
- `GEMINI_API_KEY` - Clave API de Google Gemini

### Base de Datos (Supabase)
- **Proyecto**: "Lenguaje" (ID: augrzzbvroycxdosamom)
- **Región**: us-east-1
- **Estado**: ACTIVE_HEALTHY

## 📚 Módulos Educativos

1. **Comunicación** - Elementos, funciones del lenguaje, argumentación
2. **Lenguaje** - Signo lingüístico, tipos, disciplinas
3. **Ortografía** - Reglas, acentuación, puntuación
4. **Gramática y Vocabulario** - Análisis, categorías, formación
5. **Exposición Oral y Escrita** - Redacción, tipos de texto
6. **Comprensión Lectora** - Estrategias, figuras literarias

## 🔐 Seguridad

- RLS (Row Level Security) habilitado en Supabase
- Validación de entrada en frontend
- Autenticación JWT con Supabase
- Headers de seguridad configurados en Vercel

## 📱 Compatibilidad

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Dispositivos móviles iOS y Android

## 🚀 Despliegue

La aplicación está configurada para despliegue automático en Vercel:

1. Conectar repositorio a Vercel
2. Las variables de entorno se configuran automáticamente desde `vercel.json`
3. Despliegue automático en cada push a main

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📞 Soporte

- Email: soporte@lenguajeusac.com
- Discord: https://discord.com/invite/youware
- Documentación: Ver YOUWARE.md para detalles técnicos