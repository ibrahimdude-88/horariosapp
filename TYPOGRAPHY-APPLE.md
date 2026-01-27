# 🔤 Tipografía Apple - San Francisco (SF Pro)

## Fuente Implementada

La aplicación ahora usa **San Francisco (SF Pro)**, la tipografía oficial de Apple para todas sus plataformas.

---

## ✨ Sobre San Francisco

### Descripción Oficial (Apple)

> "San Francisco is an Apple designed typeface that provides a consistent, legible, and friendly typographic voice. Across all Apple products, the size-specific outlines and dynamic tracking ensure optimal legibility at every point size and screen resolution."

### Características Principales

- **9 pesos** (weights): De ultralight a black, incluyendo itálicas
- **Legibilidad óptima**: Diseñada específicamente para pantallas
- **Tracking dinámico**: Ajuste automático del espaciado según el tamaño
- **Números proporcionales**: Espaciado natural para interfaces de datos
- **Características avanzadas**: Small caps, fracciones, numerales superiores/inferiores

---

## 📦 Variantes de San Francisco

### SF Pro
- **Uso**: Fuente del sistema para iOS, macOS, tvOS
- **Características**: 9 pesos, tamaños ópticos variables, 4 anchos
- **Idiomas**: Más de 150 idiomas (Latin, Greek, Cyrillic)
- **Variante**: SF Pro Rounded disponible

### SF Compact
- **Uso**: Fuente del sistema para watchOS
- **Características**: Diseño compacto y eficiente
- **Optimizado**: Para tamaños pequeños y columnas estrechas

### SF Mono
- **Uso**: Entornos de código (Xcode)
- **Características**: Monoespaciada, 6 pesos
- **Alineación**: Perfecta entre filas y columnas

### New York
- **Uso**: Tipografía serif complementaria
- **Características**: 6 pesos, tamaños ópticos variables
- **Estilo**: Basada en estilos tipográficos históricos

---

## 🎨 Implementación en la Aplicación

### Pila de Fuentes (Font Stack)

```css
font-family: 
    -apple-system,           /* macOS/iOS San Francisco */
    BlinkMacSystemFont,      /* macOS Chrome */
    "SF Pro Display",        /* Nombre explícito */
    "SF Pro Text",           /* Variante de texto */
    system-ui,               /* Fuente del sistema genérica */
    "Segoe UI",              /* Windows fallback */
    sans-serif;              /* Fallback final */
```

### Explicación de la Pila

1. **`-apple-system`**: Carga SF Pro automáticamente en dispositivos Apple
2. **`BlinkMacSystemFont`**: Soporte para Chrome en macOS
3. **`"SF Pro Display"`**: Nombre explícito de la fuente
4. **`"SF Pro Text"`**: Variante optimizada para texto corrido
5. **`system-ui`**: Fuente del sistema en navegadores modernos
6. **`"Segoe UI"`**: Fuente de sistema de Windows (similar a SF Pro)
7. **`sans-serif`**: Fallback genérico

---

## 🔍 Diferencias: SF Pro Display vs SF Pro Text

### SF Pro Display
- **Uso**: Títulos, encabezados, UI grande (≥20pt)
- **Características**: Espaciado más ajustado, formas más compactas
- **Tracking**: Más cerrado para tamaños grandes

### SF Pro Text
- **Uso**: Texto corrido, UI pequeña (<20pt)
- **Características**: Espaciado más abierto, mejor legibilidad
- **Tracking**: Más abierto para tamaños pequeños

**Nota**: En nuestra implementación, el sistema selecciona automáticamente la variante apropiada según el tamaño.

---

## 📊 Jerarquía Tipográfica

### Tamaños y Pesos Implementados

```css
/* Títulos Principales */
h1 {
    font-size: 1.75rem;      /* 28px */
    font-weight: 800;        /* Heavy */
    letter-spacing: -0.03em; /* Tracking ajustado */
}

/* Subtítulos */
h2 {
    font-size: 1.5rem;       /* 24px */
    font-weight: 800;        /* Heavy */
    letter-spacing: -0.02em;
}

/* Encabezados de Sección */
h3 {
    font-size: 1.3rem;       /* ~21px */
    font-weight: 700;        /* Bold */
    letter-spacing: -0.02em;
}

/* Texto de Cuerpo */
body {
    font-size: 0.95rem;      /* ~15px */
    font-weight: 400;        /* Regular */
}

/* Texto Secundario */
.subtitle {
    font-size: 0.95rem;
    font-weight: 500;        /* Medium */
    color: var(--text-secondary);
}

/* Captions / Labels */
label, .caption {
    font-size: 0.75rem;      /* 12px */
    font-weight: 700;        /* Bold */
    text-transform: uppercase;
    letter-spacing: 0.06em;  /* Tracking expandido */
}

/* Tiempo / Datos */
.time {
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.02em;
}
```

---

## 🎯 Características Especiales de SF Pro

### 1. Tracking Dinámico
SF Pro ajusta automáticamente el espaciado entre letras según el tamaño:
- **Tamaños grandes**: Tracking más cerrado
- **Tamaños pequeños**: Tracking más abierto

### 2. Números Proporcionales
Los números tienen anchos proporcionales por defecto, ideal para:
- Relojes y temporizadores
- Datos financieros
- Interfaces centradas en datos

### 3. Formas Contextuales
- **Dos puntos (:)**: Se centra verticalmente al indicar tiempo
- **Slash (/)**: Se ajusta según el contexto
- **Caracteres especiales**: Optimizados para UI

### 4. Características OpenType
- Small caps
- Fracciones
- Numerales superiores/inferiores
- Índices
- Flechas
- Y más...

---

## 🌐 Compatibilidad

### Dispositivos Apple
✅ **macOS**: SF Pro se carga automáticamente
✅ **iOS/iPadOS**: SF Pro se carga automáticamente
✅ **watchOS**: SF Compact se carga automáticamente
✅ **tvOS**: SF Pro se carga automáticamente

### Otros Dispositivos
✅ **Windows**: Usa Segoe UI (similar a SF Pro)
✅ **Android**: Usa Roboto (system-ui)
✅ **Linux**: Usa fuente del sistema

---

## 💡 Optimizaciones Aplicadas

### Anti-aliasing
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```
- Mejora la renderización en pantallas Retina
- Hace el texto más nítido y legible

### Letter-spacing
- **Títulos grandes**: Negativo (-0.03em a -0.02em)
- **Texto normal**: Por defecto (0)
- **Captions/Labels**: Positivo (+0.06em)

### Line-height
- **Títulos**: 1.2 (más compacto)
- **Texto corrido**: 1.5-1.8 (más espaciado)

---

## 📥 Descargar SF Pro (Opcional)

Si deseas instalar SF Pro en tu sistema:

1. **SF Pro**: [Descargar](https://devimages-cdn.apple.com/design/resources/download/SF-Pro.dmg)
2. **SF Compact**: [Descargar](https://devimages-cdn.apple.com/design/resources/download/SF-Compact.dmg)
3. **SF Mono**: [Descargar](https://devimages-cdn.apple.com/design/resources/download/SF-Mono.dmg)
4. **New York**: [Descargar](https://devimages-cdn.apple.com/design/resources/download/NY.dmg)

**Nota**: No es necesario descargar las fuentes para que la aplicación funcione. El sistema las carga automáticamente en dispositivos Apple.

---

## 🔗 Referencias

- [Apple Fonts](https://developer.apple.com/fonts/)
- [SF Pro Download](https://developer.apple.com/fonts/)
- [Human Interface Guidelines - Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [San Francisco Font Family](https://en.wikipedia.org/wiki/San_Francisco_(sans-serif_typeface))

---

## ✅ Cambios Realizados

### Archivos Modificados

**`styles.css`**:
- Línea 3: Eliminado import de Google Fonts (Inter)
- Línea 117: Actualizado font-family del body
- Línea 755: Actualizado font-family de .time

### Antes
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:...');
font-family: -apple-system, ..., "Inter", "Helvetica Neue", sans-serif;
```

### Después
```css
/* Typography: San Francisco (SF Pro) - Apple's official typeface */
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, "Segoe UI", sans-serif;
```

---

## 🎨 Resultado Visual

### En Dispositivos Apple
- Renderiza con **SF Pro** nativa
- Tracking dinámico automático
- Características OpenType completas
- Legibilidad óptima

### En Otros Dispositivos
- Windows: **Segoe UI** (muy similar)
- Android: **Roboto** (fuente del sistema)
- Linux: Fuente sans-serif del sistema

---

## 💡 Consejos de Uso

1. **No uses pesos extremos en texto pequeño**: Usa Regular (400) o Medium (500)
2. **Usa Bold (700) o Heavy (800) para títulos**: Mayor impacto visual
3. **Ajusta letter-spacing en títulos grandes**: Negativo para compactar
4. **Usa uppercase con letter-spacing positivo**: Para labels y captions
5. **Respeta la jerarquía**: No uses demasiados tamaños diferentes

---

**La aplicación ahora usa la misma tipografía que iOS, macOS, watchOS y tvOS** ✨

---

*Última actualización: 27 de enero de 2026*
