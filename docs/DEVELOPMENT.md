# Development Guide

## Quick Start for LLMs

### Must-Read Files (in order)

1. `docs/ARCHITECTURE.md` - Core system design and data flow
2. `src/types.ts` - Data structures and interfaces
3. `src/hooks/page.tsx` - Main state management
4. `.cursorrules` - Critical development rules

### Development Setup

```bash
npm install
npm start  # Starts dev server on port 8005
npm test   # Runs test suite
npm run build  # Production build
```

### Key Development Principles

#### State Management

- **Always use hook functions for state changes**
- **Never mutate objects directly**
- **All changes must go through the patch system**

#### Common Modification Patterns

```typescript
// Correct: Modify element field
page_hooks.onChangeElementField(elementId, "data/content", newValue);

// Correct: Create new element
const newId = page_hooks.onCreateElement(widget, parentId, index);

// Correct: Update page properties
page_hooks.onUpdatePage({ title: "New Title" });
```

#### Testing Checklist

- [ ] Undo/redo functionality works
- [ ] Changes are logged in patch system
- [ ] No direct object mutations
- [ ] Component props follow {page_hooks, editor_hooks} pattern

### File Structure Guidelines

```
src/
├── hooks/           # State management - CRITICAL to understand
├── editor/          # Main UI components
├── components/      # Reusable components
├── utils/           # Utilities (especially jsonPatch.ts)
└── types.ts         # Core interfaces - READ FIRST
```

### External Dependencies

- Coralpages Server (cp_url) - Page data and widgets
- Assets Manager (am_url) - File uploads (optional)
- OpenAI API - LLM integration (optional)

### Common Issues

- **Undo/Redo broken**: You bypassed the patch system
- **State not updating**: You mutated objects directly
- **Performance issues**: Check patch batching configuration
