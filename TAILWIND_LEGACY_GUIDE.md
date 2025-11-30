# Tailwind Legacy Design System Guide

This project uses a custom Tailwind configuration that replicates the legacy bluestockfx.com design system.

## Color Palette

### Primary Colors
- `primary` - #1A5C96 (Main brand blue)
- `primary-light` - #3c74a6 
- `primary-dark` - #154a78
- `heading` - #0c385f (Dark blue for headings)

### Secondary Colors
- `secondary` - #E6ECF2
- `success` - #3BD297 (Green)
- `info` - #05B3D7 (Cyan)
- `warning` - #F2C643 (Yellow)
- `danger` - #EE4F6F (Red)

### Neutral Colors
- `body` - #333333 (Text color)
- `dark` - #323131
- `light` - #F0F0F0
- `light-lighter` - #F5F7F9 (Page background)
- `border` - #e8e8e8

## Typography

### Font Families
- **Headings**: `font-heading` → Merriweather (900 weight)
- **Body**: `font-sans` → Poppins (300, 400, 700 weights)

### Font Sizes
- `text-xs` - 0.75rem (12px) - Used for buttons
- `text-sm` - 0.824rem
- `text-base` - 1rem (16px)
- `text-lg` - 1.25rem (20px)
- `text-xl` - 1.5rem (24px)
- `text-2xl` - 1.75rem (28px)
- `text-3xl` - 2rem (32px)
- `text-4xl` - 2.5rem (40px)

### Heading Styles
All h1-h6 elements automatically get:
- `font-family: 'Merriweather'`
- `font-weight: 900`
- `color: #0c385f`
- `line-height: 1.2`

## Components

### Buttons
```tsx
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-info">Info Button</button>
<button className="btn btn-success">Success Button</button>
<button className="btn btn-warning">Warning Button</button>
<button className="btn btn-danger">Danger Button</button>
<button className="btn btn-link">Link Button</button>
```

**Button Features:**
- Font size: 0.75rem (12px)
- Font weight: 700 (bold)
- Padding: px-5 py-3 (1.3rem × 0.8rem)
- Border radius: 0.7rem
- Box shadow for depth

### Cards
```tsx
<div className="card">Basic Card</div>
<div className="card card-hover">Hover Effect Card</div>
<div className="card card-shadow">Shadow Card</div>
```

**Card Features:**
- Default padding: 1.75rem
- White background
- Border: 1px solid #e8e8e8
- Border radius: 0 (square corners)
- Shadow variant available

### Badges
```tsx
<span className="badge-up">+2.5%</span>
<span className="badge-down">-1.2%</span>
```

## Layout

### Background Colors
- Pages: `bg-light-lighter` (#F5F7F9)
- Cards/Content: `bg-white`
- Footer: `bg-dark` (#323131)
- Header: `bg-white` with `border-b border-border`

### Spacing
- Container: `container mx-auto px-4`
- Section padding: `py-16` or `py-20`

## Border Radius
- `rounded-sm` - 0.35rem
- `rounded` - 0.7rem (default)
- `rounded-lg` - 1.4rem
- `rounded-xl` - 1rem
- `rounded-2xl` - 2rem

## Shadows
- `shadow-card` - 0px 7px 33px rgba(0, 0, 0, 0.05)
- `shadow-btn` - inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 1px rgba(0, 0, 0, 0.075)

## Usage Examples

### Page Layout
```tsx
<div className="min-h-screen flex flex-col bg-light-lighter">
  <Header />
  <main className="flex-grow py-16">
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-heading font-black text-heading mb-6">
        Page Title
      </h1>
      <p className="text-body mb-8">
        Body content with proper color and font.
      </p>
      <div className="card">
        Card content here
      </div>
    </div>
  </main>
  <Footer />
</div>
```

### Hero Section
```tsx
<section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
  <div className="container mx-auto px-4">
    <h1 className="text-4xl font-heading font-black mb-4 text-white">
      Hero Title
    </h1>
    <p className="text-xl opacity-90 mb-6">
      Hero description text
    </p>
    <button className="btn btn-warning">Get Started</button>
  </div>
</section>
```

## Font Files Location
Fonts are served from `/public/fonts/`:
- `merriweather-v30-latin-900.woff2`
- `merriweather-v30-latin-900.woff`
- `poppins-v20-latin-300.woff2`
- `poppins-v20-latin-300.woff`
- `poppins-v20-latin-regular.woff2`
- `poppins-v20-latin-regular.woff`
- `poppins-v20-latin-700.woff2`
- `poppins-v20-latin-700.woff`

## Legacy Assets
Images and icons from the legacy site are available in `/public/`:
- `/img/` - Icons and decorative elements
- `/slider-img/` - Hero and section images
- `/logo/` - Brand logos
- `/other-img/` - Additional imagery

## Notes
- The legacy CSS folder has been removed; all styling is now through Tailwind
- Font faces are loaded in `index.css` using @font-face declarations
- All color values match the original `:root` CSS variables from the legacy site
- Button and card styles replicate the exact Bootstrap-based legacy design
