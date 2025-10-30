# Toast Notification System - Usage Guide

## Overview

The CENIE Editorial app now uses a toast notification system for non-critical user feedback, replacing browser `alert()` dialogs. The toast component is designed to match the app's design system with proper styling, animations, and accessibility features.

## Components Created

### 1. Toast Component (`src/components/ui/Toast.tsx`)

- Individual toast notification with auto-dismiss functionality
- Supports 4 types: `success`, `error`, `info`, `warning`
- Includes appropriate icons and color coding
- Matches Editorial app's design system (rounded-none, custom colors)
- Accessible with proper ARIA attributes

### 2. ToastProvider & useToast Hook (`src/components/ui/ToastContainer.tsx`)

- Context provider for managing toast notifications
- Fixed positioning at top-right of viewport
- Auto-dismiss with configurable duration
- Stack multiple toasts with proper spacing

## How to Use

### Basic Usage

```tsx
import { useToast } from '@/components/ui/ToastContainer'

function MyComponent() {
  const toast = useToast()

  const handleAction = async () => {
    try {
      // Your logic here
      toast.success('Action completed successfully!')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return <button onClick={handleAction}>Do Something</button>
}
```

### Toast Methods

```tsx
const toast = useToast()

// Success notification (green, with checkmark icon)
toast.success('Book updated successfully!')

// Error notification (red, with alert icon)
toast.error('Failed to save changes')

// Info notification (blue, with info icon)
toast.info('No translation found')

// Warning notification (yellow, with warning icon)
toast.warning('This action cannot be undone')

// Custom duration (in milliseconds, default is 5000ms)
toast.success('Saved!', 3000)
toast.error('Error occurred', 7000)
```

### Toast Types & Styling

| Type      | Icon          | Color Scheme      | Use Case                             |
| --------- | ------------- | ----------------- | ------------------------------------ |
| `success` | CheckCircle   | Green             | Successful operations, confirmations |
| `error`   | AlertCircle   | Red (destructive) | Errors, failed operations            |
| `info`    | Info          | Blue              | Neutral information, status updates  |
| `warning` | AlertTriangle | Yellow            | Warnings, cautions                   |

## Integration

The ToastProvider is already integrated into the dashboard layout at:

```
apps/editorial/src/app/dashboard/layout.tsx
```

All components within the dashboard automatically have access to the `useToast()` hook.

## Examples in Codebase

### Book Detail Page

- **Success toast** when saving book changes
- **Error toast** if save fails
- **Success toast** when translation is found (with confidence score)
- **Info toast** when no translation is found

### Book Search Page

- **Success toast** when a book is added to the database
- **Info toast** when attempting to add a book that already exists
- **Error toast** if adding fails

## Design Considerations

The toast system is designed to:

- ✅ Match the Editorial app's sharp-edged aesthetic (rounded-none)
- ✅ Use the app's color system (CSS variables for primary, destructive, etc.)
- ✅ Support dark mode automatically
- ✅ Be accessible (ARIA labels, keyboard dismissible)
- ✅ Auto-dismiss to avoid cluttering the UI
- ✅ Stack multiple notifications elegantly
- ✅ Use the app's typography system (TYPOGRAPHY constants)
- ✅ Be reusable in public-facing sections of the app

## Extending to Other Apps

To use this toast system in other apps (like `apps/hub`, `apps/agency`, etc.):

1. Copy the toast components to the target app:
   - `src/components/ui/Toast.tsx`
   - `src/components/ui/ToastContainer.tsx`

2. Wrap your app's layout with ToastProvider:

   ```tsx
   import { ToastProvider } from '@/components/ui/ToastContainer'

   export default function Layout({ children }) {
     return <ToastProvider>{/* your layout */}</ToastProvider>
   }
   ```

3. Use the `useToast()` hook in any component within that layout

## Best Practices

✅ **DO:**

- Use toasts for non-critical notifications
- Keep messages concise and actionable
- Use appropriate toast types (success/error/info/warning)
- Set longer durations for important messages

❌ **DON'T:**

- Use toasts for critical information requiring acknowledgment (use modal dialogs)
- Display very long messages (consider using a dedicated notification panel)
- Show too many toasts simultaneously (they stack, but too many is overwhelming)
- Use toasts for information that users need to reference later
