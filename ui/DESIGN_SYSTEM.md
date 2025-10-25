# AthliFi Design System Reference

## Color Palette

### Primary Colors
```css
Background:      rgb(242, 242, 242)  /* Light gray - main background */
Text Primary:    rgb(0, 0, 0)        /* Black - body text */
Brand Primary:   rgb(255, 255, 255)  /* White - cards, surfaces */
```

### Accent Colors
```css
Accent Cyan:     rgb(7, 191, 217)    /* Primary CTA, active states */
Accent Blue:     rgb(17, 40, 186)    /* Links, secondary actions */
Accent Orange:   rgb(234, 67, 29)    /* Errors, warnings */
Accent Pink:     rgb(236, 15, 235)   /* Highlights, special features */
Accent Tan:      rgb(205, 185, 174)  /* Subtle accents (unused currently) */
```

### CSS Variables
Use these in your components:
```css
var(--color-bg-base)          /* Background */
var(--color-text-primary)     /* Text */
var(--color-brand-primary)    /* Cards/surfaces */
var(--color-accent-cyan)      /* Primary CTA */
var(--color-accent-blue)      /* Links */
var(--color-accent-orange)    /* Errors */
var(--color-accent-pink)      /* Highlights */
```

## Typography

### Font Sizes
```css
--font-size-xs: 12px    /* Small labels, captions */
--font-size-s:  12px    /* Body small */
--font-size-m:  12px    /* Body text */
--font-size-l:  14px    /* Body large, inputs */
```

### Font Weights
```css
--font-weight-normal: 400    /* Regular text */
500                          /* Medium - labels */
600                          /* Semi-bold - buttons */
700                          /* Bold - headings */
```

### Font Family
```css
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

## Spacing Scale

```css
--spacing-xs:  8px     /* Tight spacing, gaps */
--spacing-s:   10px    /* Small padding */
--spacing-m:   19px    /* Medium padding */
--spacing-l:   20px    /* Large padding */
--spacing-xl:  24px    /* Extra large padding */
--spacing-xxl: 34px    /* Section spacing */
```

### Usage Examples
```jsx
// Tight gap between label and input
gap: 'var(--spacing-xs)'

// Button padding
padding: 'var(--spacing-s) var(--spacing-xl)'

// Card padding
padding: 'var(--spacing-xl)'

// Section spacing
margin: 'var(--spacing-xxl) 0'
```

## Border Radius

```css
--radius-base: 16px    /* All cards, buttons, inputs */
```

Use consistently across all interactive elements and containers.

## Sizing Scale

```css
--size-xs:   23px     /* Small icons */
--size-s:    111px    /* Small containers */
--size-m:    197px    /* Medium containers */
--size-l:    304px    /* Large containers */
--size-xl:   408px    /* Extra large */
--size-xxl:  486px    /* XXL containers */
```

## Component Patterns

### Buttons

**Primary Button** (Black background)
```jsx
<Button variant="primary">Submit</Button>
```
Use for: Main actions, form submissions

**Accent Button** (Cyan background)
```jsx
<Button variant="accent">Get Started</Button>
```
Use for: Important CTAs, feature highlights

**Secondary Button** (Outline)
```jsx
<Button variant="secondary">Cancel</Button>
```
Use for: Secondary actions, cancel buttons

### Cards

**Basic Card**
```jsx
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>
```
- White background
- 16px border radius
- Subtle shadow
- 24px padding

### Input Fields

**Standard Input**
```jsx
<Input
  label="Username"
  placeholder="Enter username"
  value={value}
  onChange={handleChange}
/>
```

**With Error**
```jsx
<Input
  label="Email"
  error="Invalid email address"
  value={value}
  onChange={handleChange}
/>
```

### Color Usage Guidelines

#### Do's ✅
- Use cyan for primary CTAs and active tab indicators
- Use blue for links and navigation
- Use orange for errors and important warnings
- Use white cards on gray background for visual hierarchy
- Maintain high contrast for text (black on white)

#### Don'ts ❌
- Don't use more than 2 accent colors per screen
- Don't use pink except for special highlights/badges
- Don't use dark text on dark backgrounds
- Don't mix border radius values (always 16px)
- Don't use custom spacing values (use scale)

## Accessibility

### Contrast Ratios
- Black text on white: 21:1 (AAA)
- White text on cyan: 4.7:1 (AA)
- White text on blue: 10:1 (AAA)

### Focus States
All interactive elements should have visible focus states:
```jsx
style={{
  outline: 'none',
  boxShadow: '0 0 0 3px rgba(7, 191, 217, 0.3)'
}}
```

### Labels
Always include labels for form inputs:
```jsx
<Input label="Username" />  // ✅ Good
<Input placeholder="Username" />  // ❌ Bad (no label)
```

## Layout Patterns

### Max Width Containers
```jsx
// For forms and narrow content
style={{ maxWidth: '600px' }}

// For main content
style={{ maxWidth: '1200px', margin: '0 auto' }}
```

### Card Grid
```jsx
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: 'var(--spacing-m)'
}}
```

### Flexbox Layouts
```jsx
// Column with spacing
style={{
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-xl)'
}}

// Row with spacing
style={{
  display: 'flex',
  gap: 'var(--spacing-s)',
  alignItems: 'center'
}}
```

## Animation & Transitions

Keep transitions subtle and fast:
```css
transition: all 0.2s ease;
```

Use for:
- Button hover states
- Tab active states
- Border color changes
- Opacity changes

Don't overuse animations - prefer instant feedback for user actions.

## Responsive Design

### Breakpoints (to be implemented)
```css
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px
```

### Grid Responsiveness
```jsx
gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
```
This automatically adjusts column count based on screen size.

## Best Practices

1. **Consistency**: Always use CSS variables, never hardcode values
2. **Spacing**: Use the spacing scale, don't create custom values
3. **Colors**: Stick to the defined palette
4. **Typography**: Use the font size scale
5. **Border Radius**: Always 16px, no exceptions
6. **Shadows**: Use subtle shadows (0 2px 8px rgba(0,0,0,0.08))

## Future Enhancements

- Dark mode toggle (Phase 2)
- More button variants for different contexts
- Loading skeleton components
- Toast notification system
- Modal component
- Dropdown component
- Avatar component

## Quick Reference

Copy-paste this for new components:

```tsx
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function MyComponent() {
  return (
    <Card>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--spacing-xl)' 
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700' }}>
          Title
        </h2>
        
        <Input
          label="Label"
          placeholder="Enter value"
          value={value}
          onChange={handleChange}
        />
        
        <Button variant="accent" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Card>
  );
}
```

