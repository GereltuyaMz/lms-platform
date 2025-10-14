# shadcn/ui Integration Summary

## Theming

### Light Mode Colors

- Background: White (`hsl(0 0% 100%)`)
- Foreground: Dark gray (`hsl(0 0% 3.9%)`)
- Primary: Nearly black (`hsl(0 0% 9%)`)

### Dark Mode Colors

- Background: Nearly black (`hsl(0 0% 3.9%)`)
- Foreground: Nearly white (`hsl(0 0% 98%)`)
- Primary: Nearly white (`hsl(0 0% 98%)`)

### Customizing Colors

Edit `src/app/globals.css` to change theme colors:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Change to your brand color */
}
```

## Best Practices

1. **Composition**: Combine components to create complex UIs
2. **Variants**: Use built-in variants before creating custom styles
3. **Accessibility**: Components are ARIA-compliant by default
4. **Customization**: Edit component files directly - they're yours!
5. **Consistency**: Use the same spacing scale throughout (`space-y-4`, `gap-2`)
