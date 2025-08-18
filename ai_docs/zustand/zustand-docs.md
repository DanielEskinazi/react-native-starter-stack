# Zustand State Management Documentation

## Overview
Zustand is a small, fast, and scalable state management solution for React applications. It provides a simple API based on hooks without boilerplate or opinions, offering an excellent developer experience with TypeScript support and powerful middleware system.

## Core Concepts

### Store Creation
Zustand stores are created using the `create` function, which returns a React hook:

```javascript
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

### Basic TypeScript Setup
```typescript
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

### Using Stores in Components
```typescript
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  const increase = useBearStore((state) => state.increase)
  
  return (
    <div>
      <h1>{bears} around here ...</h1>
      <button onClick={() => increase(1)}>one up</button>
    </div>
  )
}
```

## Store Patterns

### Simple Counter Store
```typescript
type CounterState = {
  count: number
}

type CounterActions = {
  increment: (qty: number) => void
  decrement: (qty: number) => void
}

const useCounterStore = create<CounterState & CounterActions>((set) => ({
  count: 0,
  increment: (qty: number) => set((state) => ({ count: state.count + qty })),
  decrement: (qty: number) => set((state) => ({ count: state.count - qty })),
}))
```

### Todo Store with Complex State
```typescript
interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoStore {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
  clearCompleted: () => void
}

const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  addTodo: (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
    }
    set((state) => ({ todos: [...state.todos, newTodo] }))
  },
  toggleTodo: (id: string) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  removeTodo: (id: string) =>
    set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
  clearCompleted: () =>
    set((state) => ({ todos: state.todos.filter((todo) => !todo.completed) })),
}))
```

## Middleware

### Persist Middleware
Automatically saves store state to storage:

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
  user: { name: string; email: string } | null
  setUser: (user: UserState['user']) => void
  clearUser: () => void
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // unique name
      storage: createJSONStorage(() => localStorage), // default is localStorage
    }
  )
)
```

### Persist with Partial State
```typescript
const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      language: 'en',
      tempData: 'not-persisted',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({ theme: state.theme, language: state.language }),
    }
  )
)
```

### DevTools Middleware
Integration with Redux DevTools:

```typescript
import { devtools } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing

const useStore = create<State>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'counter-store', // store name in devtools
    }
  )
)
```

### Immer Middleware
Enables mutable-style updates:

```typescript
import { immer } from 'zustand/middleware/immer'

interface TodoState {
  todos: Record<string, Todo>
  toggleTodo: (todoId: string) => void
}

const useTodoStore = create<TodoState>()(
  immer((set) => ({
    todos: {},
    toggleTodo: (todoId: string) =>
      set((state) => {
        state.todos[todoId].done = !state.todos[todoId].done
      }),
  }))
)
```

### Combine Middleware
Separates initial state and actions:

```typescript
import { combine } from 'zustand/middleware'

const useStore = create(
  combine(
    { bears: 0 }, // initial state
    (set) => ({
      increase: (by: number) => set((state) => ({ bears: state.bears + by })),
    })
  )
)
```

### Multiple Middleware
```typescript
const useStore = create<BearState>()(
  devtools(
    persist(
      immer((set) => ({
        bears: 0,
        increase: (by) => 
          set((state) => {
            state.bears += by
          }),
      })),
      { name: 'bear-storage' }
    ),
    { name: 'bear-store' }
  )
)
```

## Advanced Patterns

### Slices Pattern
Organize large stores by breaking them into slices:

```typescript
interface BearSlice {
  bears: number
  addBear: () => void
  eatFish: () => void
}

interface FishSlice {
  fishes: number
  addFish: () => void
}

const createBearSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createFishSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const useBoundStore = create<BearSlice & FishSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

### Custom Middleware
Create your own middleware:

```typescript
const logger = <T>(
  f: StateCreator<T, [], []>,
  name?: string
) => (set: any, get: any, store: any) => {
  const loggedSet = (...a: any[]) => {
    set(...a)
    console.log(`${name}:`, get())
  }
  
  return f(loggedSet, get, store)
}

const useStore = create(
  logger(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    'counter-store'
  )
)
```

## Store Factories
Create multiple store instances:

```typescript
type CounterStore = {
  count: number
  increment: () => void
  reset: () => void
}

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set({ count: 0 }),
  }))
}

// Create multiple instances
const counterStore1 = createCounterStore()
const counterStore2 = createCounterStore()
```

### Context-Based Store Provider
```typescript
import React, { createContext, useContext, useState } from 'react'

type CounterStore = ReturnType<typeof createCounterStore>

const CounterStoreContext = createContext<CounterStore | undefined>(undefined)

const CounterStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(createCounterStore)
  
  return (
    <CounterStoreContext.Provider value={store}>
      {children}
    </CounterStoreContext.Provider>
  )
}

const useCounterStore = <T,>(selector: (store: CounterStore) => T) => {
  const store = useContext(CounterStoreContext)
  
  if (!store) {
    throw new Error('useCounterStore must be used within CounterStoreProvider')
  }
  
  return useStore(store, selector)
}
```

## Vanilla Stores
Use Zustand without React:

```typescript
import { createStore } from 'zustand/vanilla'

type PositionStore = {
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
}

const positionStore = createStore<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
}))

// Subscribe to changes
const unsubscribe = positionStore.subscribe((state) => {
  console.log('Position updated:', state.position)
})

// Get current state
const currentState = positionStore.getState()

// Update state
positionStore.getState().setPosition({ x: 10, y: 20 })

// Cleanup
unsubscribe()
```

## Storage Options

### Default (localStorage)
```typescript
const useStore = create(
  persist(
    (set, get) => ({ count: 0 }),
    { name: 'count-storage' }
  )
)
```

### Session Storage
```typescript
import { createJSONStorage } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({ count: 0 }),
    {
      name: 'count-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
```

### Custom Storage (IndexedDB)
```typescript
import { StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  },
}

const useStore = create(
  persist(
    (set, get) => ({ count: 0 }),
    {
      name: 'count-storage',
      storage: createJSONStorage(() => storage),
    }
  )
)
```

### URL Hash Storage
```typescript
const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    const storedValue = searchParams.get(key) ?? ''
    return JSON.parse(storedValue)
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.set(key, JSON.stringify(newValue))
    location.hash = searchParams.toString()
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.delete(key)
    location.hash = searchParams.toString()
  },
}
```

## Persistence Configuration

### Migration
Handle state schema changes:

```typescript
const useStore = create(
  persist(
    (set, get) => ({
      newField: 0, // renamed from oldField
      increment: () => set((state) => ({ newField: state.newField + 1 })),
    }),
    {
      name: 'my-store',
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migrate from v0 to v1
          persistedState.newField = persistedState.oldField
          delete persistedState.oldField
        }
        return persistedState
      },
    }
  )
)
```

### Custom Merge Strategy
```typescript
import deepMerge from '@fastify/deepmerge'

const merge = deepMerge({ all: true })

const useStore = create(
  persist(
    (set, get) => ({
      user: { name: '', preferences: { theme: 'light' } },
    }),
    {
      name: 'user-store',
      merge: (persisted, current) => merge(current, persisted),
    }
  )
)
```

### Hydration Control
```typescript
const useStore = create(
  persist(
    (set, get) => ({ count: 0 }),
    {
      name: 'count-storage',
      skipHydration: true,
      onRehydrateStorage: () => {
        console.log('Hydration starts')
        return (state, error) => {
          if (error) {
            console.log('Hydration error:', error)
          } else {
            console.log('Hydration finished')
          }
        }
      },
    }
  )
)

// Manual hydration
useStore.persist.rehydrate()

// Check hydration status
const isHydrated = useStore.persist.hasHydrated()
```

## React Native Considerations

### AsyncStorage Setup
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

### Flipper Integration
```typescript
const useStore = create(
  devtools(
    persist(
      (set) => ({ count: 0 }),
      { name: 'count-storage' }
    ),
    {
      name: 'count-store',
      enabled: __DEV__, // Only in development
    }
  )
)
```

## Testing

### Mock Store for Testing
```typescript
import { create } from 'zustand'

// Create store factory for testing
const createTestStore = (initialState = {}) => {
  return create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    ...initialState,
  }))
}

// In tests
describe('Store', () => {
  it('increments count', () => {
    const useStore = createTestStore({ count: 5 })
    const { increment } = useStore.getState()
    
    increment()
    
    expect(useStore.getState().count).toBe(6)
  })
})
```

### Reset Store Between Tests
```typescript
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))

// In test setup
beforeEach(() => {
  useStore.getState().reset()
})
```

## Performance Optimization

### Selective Subscriptions
```typescript
// Only re-render when count changes
const count = useStore((state) => state.count)

// Only re-render when user name changes
const userName = useStore((state) => state.user?.name)

// Multiple selectors
const { count, increment } = useStore(
  (state) => ({ count: state.count, increment: state.increment }),
  shallow // Use shallow comparison for objects
)
```

### Computed Values
```typescript
const useStore = create((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  get itemCount() {
    return get().items.length
  },
  get expensiveComputation() {
    return get().items.reduce((sum, item) => sum + item.value, 0)
  },
}))
```

## Error Handling

### Storage Errors
```typescript
const useStore = create(
  persist(
    (set, get) => ({ count: 0 }),
    {
      name: 'count-storage',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to hydrate store:', error)
          // Reset to default state
          useStore.setState({ count: 0 })
        }
      },
    }
  )
)
```

### Action Error Handling
```typescript
const useStore = create((set, get) => ({
  data: null,
  loading: false,
  error: null,
  fetchData: async () => {
    try {
      set({ loading: true, error: null })
      const response = await fetch('/api/data')
      const data = await response.json()
      set({ data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))
```

## Best Practices

1. **Keep stores focused**: Create separate stores for different domains
2. **Use TypeScript**: Define proper interfaces for type safety
3. **Normalize nested data**: Avoid deeply nested structures
4. **Use selectors wisely**: Subscribe only to needed state slices
5. **Handle async operations**: Use loading states and error handling
6. **Test your stores**: Create testable store factories
7. **Persist strategically**: Only persist necessary state
8. **Use middleware**: Leverage built-in middleware for common needs
9. **Structure large stores**: Use slices pattern for complex state
10. **Handle hydration**: Properly manage persistence hydration

## Common Patterns

### Loading States
```typescript
const useAsyncStore = create((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchData: async () => {
    set({ loading: true, error: null })
    try {
      const data = await api.getData()
      set({ data, loading: false })
    } catch (error) {
      set({ error, loading: false })
    }
  },
}))
```

### Optimistic Updates
```typescript
const useTodoStore = create((set, get) => ({
  todos: [],
  addTodo: async (text) => {
    const tempId = Date.now().toString()
    const tempTodo = { id: tempId, text, completed: false }
    
    // Optimistic update
    set((state) => ({ todos: [...state.todos, tempTodo] }))
    
    try {
      const newTodo = await api.createTodo(text)
      // Replace temp todo with real one
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === tempId ? newTodo : todo
        ),
      }))
    } catch (error) {
      // Remove temp todo on error
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== tempId),
      }))
    }
  },
}))
```

This documentation covers the essential concepts and patterns for using Zustand in React and React Native applications, providing a comprehensive guide for state management.