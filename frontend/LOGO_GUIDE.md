# Logo Setup Guide for Speed-Run Frontend

This guide shows you exactly where and how to add/replace logos in your frontend application.

---

## 📂 Where to Put Your Logo Files

All logo files should go in the `frontend/public/` directory:

```
frontend/public/
├── logo.svg              ← Main logo (full with text) - RECOMMENDED
├── logo.icon.svg         ← Icon/symbol only version
├── logo.png              ← Fallback PNG version
├── logo.icon.png         ← Icon PNG fallback
├── logo-dark.svg         ← Dark mode version (optional)
├── favicon.ico           ← Browser tab icon (32x32 or 48x48)
└── apple-icon.png        ← iOS home screen icon (180x180)
```

### Recommended Logo Specifications

#### 1. Main Logo (logo.svg or logo.png)
- **Format:** SVG (preferred) or PNG
- **Dimensions:** 200-400px width, maintain aspect ratio
- **Use:** Full logo with company name/text
- **Example:** "Julius Baer" text with symbol

#### 2. Icon Logo (logo.icon.svg or logo.icon.png)
- **Format:** SVG (preferred) or PNG
- **Dimensions:** Square - 128x128px or 256x256px
- **Use:** Symbol/icon only, no text
- **Example:** Just the "JB" or company symbol

#### 3. Favicon (favicon.ico)
- **Format:** ICO or PNG
- **Dimensions:** 32x32px or 48x48px
- **Use:** Browser tab icon
- **Tool:** Use https://favicon.io to convert PNG to ICO

#### 4. Apple Touch Icon (apple-icon.png)
- **Format:** PNG
- **Dimensions:** 180x180px
- **Use:** iOS home screen when users save as web app

---

## 🎨 How to Add Your Logo

### Option 1: Quick Replace (Use Existing Component)

The Logo component is already set up at `frontend/components/ui/logo.tsx`.

**Steps:**
1. Add your logo files to `frontend/public/`
2. Edit `frontend/components/ui/logo.tsx`
3. Change line 68 from:
   ```tsx
   return <TextLogo />
   ```
   to:
   ```tsx
   return <ImageLogo />
   ```

**That's it!** Your logo will now appear everywhere the Logo component is used.

---

### Option 2: Manual Replacement (Custom Implementation)

If you want more control, here's how to replace logos in each location:

#### Location 1: Landing Page (Main Entry)

**File:** `frontend/app/page.tsx`

**Current Implementation:**
```tsx
<Logo variant="icon" size="lg" linkToHome={false} />
```

**Custom Replacement:**
```tsx
import Image from 'next/image'

// Replace the Logo component with:
<Image
  src="/logo.icon.png"
  alt="Company Logo"
  width={80}
  height={80}
  priority
/>
```

#### Location 2: Navigation/Header (If you add one)

**Create:** `frontend/components/layout/header.tsx`

```tsx
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Logo variant="full" size="md" />

        {/* Navigation */}
        <nav className="flex gap-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/compliance" className="text-gray-600 hover:text-gray-900">
            Compliance
          </Link>
          <Link href="/rm" className="text-gray-600 hover:text-gray-900">
            RM Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}
```

Then add to your layout:
```tsx
// In frontend/app/layout.tsx
import { Header } from "@/components/layout/header"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
```

#### Location 3: Compliance Page Header

**File:** `frontend/app/compliance/page.tsx`

**Add at the top of the return statement:**
```tsx
return (
  <div className="min-h-screen bg-gray-50 p-6">
    {/* Add Header with Logo */}
    <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
      <Logo variant="full" size="md" />
      <Button variant="outline" onClick={() => router.push("/")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
    </div>

    {/* Rest of your page content */}
    ...
  </div>
)
```

---

## 🔧 Using the Logo Component

The Logo component has been created at `frontend/components/ui/logo.tsx`.

### Basic Usage

```tsx
import { Logo } from "@/components/ui/logo"

// Full logo with default size
<Logo />

// Icon only, large size
<Logo variant="icon" size="lg" />

// Without link to home page
<Logo linkToHome={false} />

// With custom styling
<Logo className="opacity-80 hover:opacity-100 transition" />

// Dark mode version
<Logo darkMode />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'full' \| 'icon'` | `'full'` | Show full logo with text or icon only |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the logo |
| `linkToHome` | `boolean` | `true` | Wrap logo in link to home page |
| `className` | `string` | `''` | Additional CSS classes |
| `darkMode` | `boolean` | `false` | Use dark mode version |

### Size Reference

- **sm:** 80x32px - Small badges, footers
- **md:** 120x48px - Navigation headers
- **lg:** 160x64px - Landing pages
- **xl:** 200x80px - Hero sections

---

## 🌐 Favicon Setup

The favicon has been configured in two places:

### 1. Dynamic Favicon (Current)
**File:** `frontend/app/icon.tsx`

This generates a favicon dynamically with "JB" text.

**To use a custom favicon instead:**
1. Delete `frontend/app/icon.tsx`
2. Add your `favicon.ico` file to `frontend/app/` directory
3. Next.js will automatically use it

### 2. Static Favicon (Alternative)

**Steps:**
1. Create your favicon using https://favicon.io or https://realfavicongenerator.net
2. Download the generated files
3. Place in `frontend/public/`:
   ```
   frontend/public/
   ├── favicon.ico
   ├── favicon-16x16.png
   ├── favicon-32x32.png
   ├── apple-touch-icon.png
   └── site.webmanifest (optional)
   ```
4. Update `frontend/app/layout.tsx` metadata:
   ```tsx
   export const metadata: Metadata = {
     icons: {
       icon: [
         { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
         { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
       ],
       apple: '/apple-touch-icon.png',
     },
   }
   ```

---

## 🎯 Complete Setup Checklist

Use this checklist to ensure all logos are properly set up:

### Preparation
- [ ] Prepare logo in SVG format (recommended)
- [ ] Prepare logo in PNG format (fallback)
- [ ] Create icon-only version (square)
- [ ] Create favicon (32x32 or 48x48)
- [ ] Create Apple touch icon (180x180)

### File Placement
- [ ] Add `logo.svg` to `frontend/public/`
- [ ] Add `logo.icon.svg` to `frontend/public/`
- [ ] Add `logo.png` to `frontend/public/` (fallback)
- [ ] Add `logo.icon.png` to `frontend/public/` (fallback)
- [ ] Add `favicon.ico` to `frontend/app/` or `frontend/public/`
- [ ] Add `apple-icon.png` to `frontend/public/`

### Component Updates
- [ ] Update `frontend/components/ui/logo.tsx` to use ImageLogo
- [ ] Verify logo appears on landing page
- [ ] Add logo to navigation header (if needed)
- [ ] Update page titles and metadata
- [ ] Test dark mode logo (if applicable)

### Testing
- [ ] View logo on landing page (http://localhost:3000)
- [ ] Check favicon in browser tab
- [ ] Test logo on mobile devices (responsive)
- [ ] Verify logo in dark mode (if applicable)
- [ ] Test Apple touch icon (add to home screen on iOS)
- [ ] Check logo loads without errors (no 404s)

---

## 📸 Logo Examples

### Text-Based Logo (Current)
```tsx
<div className="flex items-center gap-3">
  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
    <span className="text-white font-bold text-xl">JB</span>
  </div>
  <div className="flex flex-col">
    <span className="text-xl font-bold text-gray-900">Julius Baer</span>
    <span className="text-xs text-gray-600">AML Platform</span>
  </div>
</div>
```

### Image-Based Logo (After Setup)
```tsx
<Image
  src="/logo.svg"
  alt="Julius Baer Logo"
  width={150}
  height={60}
  priority
/>
```

---

## 🔄 Migration Path

If you currently have logos elsewhere, here's how to migrate:

### From `/public/images/logo.png`
**Old:**
```tsx
<img src="/images/logo.png" alt="Logo" />
```

**New:**
```tsx
import { Logo } from "@/components/ui/logo"
<Logo variant="full" size="md" />
```

### From External URL
**Old:**
```tsx
<img src="https://example.com/logo.png" alt="Logo" />
```

**New:**
1. Download the logo
2. Add to `frontend/public/logo.png`
3. Use Logo component as shown above

---

## 🎨 Customization Tips

### Add Animation
```tsx
<Logo className="animate-pulse" /> // Pulse effect
<Logo className="hover:scale-110 transition-transform" /> // Hover zoom
```

### Add Loading State
```tsx
<Logo className="opacity-50 animate-spin" /> // Loading spinner
```

### Responsive Sizing
```tsx
<Logo
  size="sm"
  className="md:hidden" // Small on mobile
/>
<Logo
  size="lg"
  className="hidden md:block" // Large on desktop
/>
```

---

## 🐛 Troubleshooting

### Logo Not Showing
1. Check file exists in `frontend/public/`
2. Verify file name matches exactly (case-sensitive)
3. Check browser console for 404 errors
4. Clear Next.js cache: `rm -rf .next && npm run dev`

### Logo Appears Blurry
1. Use SVG instead of PNG for crisp rendering
2. For PNG, use 2x or 3x resolution (e.g., 240x96 for 120x48 display)
3. Set `quality={100}` on Image component

### Logo Not Updating
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Restart dev server
4. Check file was saved correctly

### Favicon Not Changing
1. Clear browser cache completely
2. Close and reopen browser
3. Try incognito/private mode
4. Check `frontend/app/icon.tsx` isn't overriding

---

## 📚 Resources

- **Favicon Generator:** https://favicon.io
- **Logo Design:** https://canva.com
- **SVG Optimizer:** https://jakearchibald.github.io/svgomg/
- **Next.js Images:** https://nextjs.org/docs/app/api-reference/components/image
- **Next.js Metadata:** https://nextjs.org/docs/app/api-reference/functions/generate-metadata

---

## ✅ Quick Start

**Fastest way to add your logo:**

1. **Add logo file:**
   ```bash
   cp /path/to/your/logo.svg frontend/public/logo.icon.svg
   ```

2. **Update Logo component:**
   Edit `frontend/components/ui/logo.tsx` line 68:
   ```tsx
   // Change from:
   return <TextLogo />
   // To:
   return <ImageLogo />
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **View changes:**
   Open http://localhost:3000

Done! Your logo is now live across the entire application.
