# Coralpages Editor Architecture

## Overview

The Coralpages Editor is a React-based visual page editor that operates as part of a microservices architecture. It provides a sophisticated interface for editing structured documents with a complete undo/redo system based on JSON Patch operations.

## Core Architecture Principles

### 1. Immutable State with Patch-Based Modifications

**CRITICAL FOR LLM MODIFICATIONS**: All state changes MUST go through the patch system to maintain undo/redo functionality.

- Every modification creates a JSON Patch operation
- State is never mutated directly
- All changes are logged for undo/redo functionality
- Patches are applied atomically

### 2. Centralized State Management

The application uses a custom hook-based state management system centered around:

- `usePage()` - Main page state and operations
- `useEditor()` - Editor UI state and selections
- Component-specific hooks for specialized functionality

## Data Flow Architecture

```
User Action → Hook Function → Patch Creation → Patch Logger → State Update → Re-render
     ↓                                            ↓
Components ←── React State ←── JSON Patch ←── PatchLogger
```

### Critical Data Flow Rules

1. **ALL state modifications MUST use the patch system**
2. **NEVER modify page state directly**
3. **Always use provided hook functions for state changes**
4. **Batch operations when possible for better UX**

## Core Components Structure

### Application Entry Points

1. **Standalone App** (`src/index.tsx` → `src/App.tsx`)

   - Main React application
   - Routing between PageList and Editor
   - Global dialog and message stacks

2. **Web Component** (`src/webcomponent/editor.tsx`)
   - Custom HTML element `<page-editor>`
   - Shadow DOM isolation
   - Embeddable in external applications
   - Attribute-driven configuration

### Main Editor Structure

```
Editor (src/editor/Editor.tsx)
├── TopBar - Page actions, save, preview
├── SideBarLeft - Element editing interface
│   ├── Add Tab - Element selector
│   ├── Edit Tab - Element/Document properties
│   └── Style Tab - CSS styling
├── MainContent - Page preview and element interaction
└── SideBarRight - Document layout tree
```

## State Management Details

### Page State (`src/hooks/page.tsx`)

**Core Interface:**

```typescript
interface PageHooks {
  page?: Page;
  page_gen: number;

  // Element Operations (ALL go through patch system)
  onChangeElement: (element: Element) => void;
  onChangeElementField: (
    element_id: string,
    field: string,
    value: any,
    can_batch_merge?: boolean
  ) => void;
  onMoveElement: (element_id: string, parent_id: string, idx: number) => void;
  onCreateElement: (
    element_definition: Widget,
    parent_id: string,
    idx: number
  ) => void;
  onDeleteElement: (element_id: string) => void;

  // Page Operations
  onUpdatePage: (page: Partial<Page>) => void;
  onPatchPage: (
    op: "add" | "replace" | "remove",
    path: string,
    value: any
  ) => void;

  // Undo/Redo System
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Persistence
  savePage: () => Promise<void>;
  need_save: boolean;
}
```

**Critical Implementation Details:**

1. **Base Page Reference**: Maintains `basePageRef` as the original state
2. **Current Page Reference**: Tracks current state in `currentPageRef`
3. **Patch Logger**: Records all changes for undo/redo
4. **Atomic Operations**: Each user action creates a complete patch

### Editor State (`src/hooks/editor.tsx`)

Manages UI-specific state:

- Selected/hovered element IDs
- Active sidebar tab
- Viewport width
- Element definitions from API
- Clipboard operations

### Undo/Redo System (`src/hooks/actions.tsx`)

**PatchLogger Class Features:**

- Maintains operation history
- Smart batching of rapid changes (30-second window)
- Position-based undo/redo navigation
- Automatic operation merging for related changes

**Batching Rules:**

- Same element field modifications within 30 seconds
- Maximum 10 operations per batch
- Same operation type only
- Excludes "add" operations (always separate)

## Data Models

### Core Types (`src/types.ts`)

```typescript
interface Page {
  id?: string;
  url: string;
  title: string;
  template?: string;
  children: Element[];
  head?: {
    link?: LinkRef[];
    meta?: MetaRef[];
    raw?: string;
  };
}

interface Element {
  id: string;
  widget: string;
  data?: any;
  style?: Record<string, string>;
  classes?: string[];
  children?: Element[];
}

interface Widget {
  name: string;
  description?: string;
  store: string;
  data: Record<string, any>;
  style: Record<string, any>;
  icon: string;
  editor: FieldDefinition[] | string;
}
```

## JSON Patch System (`src/utils/jsonPatch.ts`)

Implements RFC 6902 JSON Patch specification with operations:

- `add` - Insert new values
- `remove` - Delete values
- `replace` - Update existing values
- `move` - Relocate values
- `copy` - Duplicate values
- `test` - Validate values

**Path Format**: JSON Pointer format (`/children/0/data/content`)

## External Dependencies

### API Endpoints (configured in `src/settings.tsx`)

1. **Coralpages Server** (`cp_url`)

   - `GET /page/{path}` - Load page
   - `POST /page/{path}` - Save page
   - `DELETE /page/{path}` - Delete page
   - `GET /widget/` - Get widget definitions
   - `GET /store/` - Get available stores

2. **Assets Manager** (`am_url`)

   - Asset management and file uploads
   - Optional service

3. **LLM Integration** (`openai_api_*`)
   - AI-powered content generation
   - Configurable endpoint and model
   - **CRITICAL**: All LLM modifications go through the patch system for proper undo/redo functionality

### Configuration Sources (Priority Order)

1. URL query parameters
2. localStorage
3. Default values

## Component Communication Patterns

### Hook-Based Data Flow

Components receive state and operations through props:

```typescript
// Pattern used throughout application
const SomeComponent = ({ page_hooks, editor_hooks }: Props) => {
  // Use hooks to access state and operations
  const element = page_hooks.findElement(elementId);

  // Modify state through hook functions
  const handleChange = (value: any) => {
    page_hooks.onChangeElementField(elementId, "data/content", value);
  };
};
```

### Dialog System (`src/components/dialog.tsx`)

- Stack-based modal management
- Promise-based interaction
- Global state management

### Message System (`src/components/messages.tsx`)

- Toast notifications
- Auto-dismissing messages
- Multiple severity levels

## Key Integration Points for LLM Modifications

### 1. Element Modifications

```typescript
// Correct: Use hook functions
page_hooks.onChangeElementField(elementId, "data/content", newValue);

// Wrong: Direct modification
element.data.content = newValue; // Breaks undo/redo
```

### 2. Element Creation

```typescript
// Correct: Use creation hook
const newElementId = page_hooks.onCreateElement(widget, parentId, index);

// Wrong: Direct insertion
parent.children.push(newElement); // Bypasses patch system
```

### 3. Page Structure Changes

```typescript
// Correct: Use page update hook
page_hooks.onUpdatePage({ title: newTitle });

// Wrong: Direct modification
page.title = newTitle; // No undo/redo tracking
```

### 4. Batch Operations

```typescript
// For rapid changes (e.g., typing), enable batching
page_hooks.onChangeElementField(elementId, "data/content", value, true);

// For distinct operations, disable batching
page_hooks.onChangeElementField(elementId, "widget", newWidget, false);
```

### 5. LLM Integration with Patch System

**CRITICAL**: LLM modifications must use the patch system to maintain undo/redo functionality.

```typescript
// Correct: LLM applies patches through the patch system
const applyPatchesFromAI = (patches: JSONPatch): void => {
  patches.forEach((patchOp) => {
    if (patchOp.op === "remove") {
      page_hooks.onPatchPage("remove", patchOp.path, undefined);
    } else if (patchOp.op === "add" || patchOp.op === "replace") {
      page_hooks.onPatchPage(patchOp.op, patchOp.path, patchOp.value);
    }
  });
};

// Wrong: Direct page modification bypasses patch system
page_hooks.setPage(modifiedPage); // Breaks undo/redo
```

**LLM Patch Processing:**

- All AI-generated JSON Patch operations are applied through `page_hooks.onPatchPage()`
- Operations are automatically batched by the patch system based on timing and characteristics
- Only supported operations (`add`, `replace`, `remove`) are processed
- Unsupported operations (`move`, `copy`, `test`) are logged as warnings
- Each AI response is treated as a logical unit for undo/redo purposes

## Web Component Integration

### Usage

```html
<page-editor
  path="/store/page-id"
  css="./custom-styles.css"
  cp_url="https://api.example.com/cp/api/v1"
  am_url="https://api.example.com/am/api/v1"
>
</page-editor>
```

### Features

- Shadow DOM isolation
- Dynamic CSS loading
- Attribute reactivity
- Full editor functionality

## File Structure Organization

```
src/
├── hooks/           # State management and business logic
├── components/      # Reusable UI components
├── editor/          # Main editor interface
│   └── sidebars/    # Editor sidebar components
├── utils/           # Utility functions
├── webcomponent/    # Web component implementations
└── types.ts         # TypeScript definitions
```

## Performance Considerations

1. **Patch Batching**: Reduces undo/redo stack size
2. **React Keys**: Element IDs used as stable keys
3. **Memoization**: Strategic use in expensive components
4. **Lazy Loading**: Widget definitions loaded on demand

## Testing Strategy

- Unit tests for patch operations (`actions.test.ts`)
- Page state management tests (`page.test.ts`)
- Integration tests for complete workflows
- Focus on undo/redo functionality validation

## Development Guidelines for LLM

### DO:

- Always use provided hook functions for state changes
- Understand the patch system before making modifications
- Test undo/redo after any state management changes
- Follow the existing component prop patterns
- Use TypeScript interfaces for type safety
- **For LLM operations**: Always use `page_hooks.onPatchPage()` for applying AI-generated patches
- **For LLM operations**: Filter out unsupported patch operations (`move`, `copy`, `test`)
- **For LLM operations**: Log warnings for unsupported operations instead of failing silently

### DON'T:

- Directly modify page or element objects
- Bypass the patch system for "simple" changes
- Create side effects outside the hook system
- Ignore the batching system for rapid changes
- Break the immutable state principle
- **For LLM operations**: Use `page_hooks.setPage()` directly with modified pages
- **For LLM operations**: Apply patches directly without going through the patch system

### Critical Functions to Always Use:

- `page_hooks.onChangeElement()`
- `page_hooks.onChangeElementField()`
- `page_hooks.onCreateElement()`
- `page_hooks.onMoveElement()`
- `page_hooks.onDeleteElement()`
- `page_hooks.onUpdatePage()`
- **For LLM operations**: `page_hooks.onPatchPage()` for applying AI-generated patches

### LLM-Specific Integration Pattern:

```typescript
// Correct LLM integration pattern
const applyPatchesFromAI = (patches: JSONPatch): void => {
  const supportedPatches = patches.filter((patchOp) => {
    return (
      patchOp.op === "add" ||
      patchOp.op === "replace" ||
      patchOp.op === "remove"
    );
  });

  supportedPatches.forEach((patchOp) => {
    if (patchOp.op === "remove") {
      page_hooks.onPatchPage("remove", patchOp.path, undefined);
    } else {
      page_hooks.onPatchPage(patchOp.op, patchOp.path, patchOp.value);
    }
  });
};
```

This architecture ensures data consistency, enables powerful undo/redo functionality, and maintains the integrity of the editing experience across all interaction modes.
