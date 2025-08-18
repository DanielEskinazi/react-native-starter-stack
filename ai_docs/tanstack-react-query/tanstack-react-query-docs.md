# TanStack React Query Documentation

## Overview
TanStack Query (formerly React Query) is a powerful asynchronous state management library for TypeScript/JavaScript. It provides data fetching, caching, synchronization, and server state management capabilities for React applications.

**Version**: 5.85.3  
**Trust Score**: 8/10  
**Code Snippets Available**: 1037+

## Installation

```bash
# npm
npm install @tanstack/react-query

# yarn
yarn add @tanstack/react-query

# pnpm
pnpm add @tanstack/react-query

# bun
bun add @tanstack/react-query
```

## Basic Setup

### 1. Create Query Client and Provider

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
```

### 2. Using Queries and Mutations

```tsx
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery({ 
    queryKey: ['todos'], 
    queryFn: getTodos 
  })

  // Mutations
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <ul>
        {query.data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}
```

## Core Concepts

### useQuery Hook
Used for fetching data from servers.

```tsx
import { useQuery } from '@tanstack/react-query'

function Profile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchUserProfile(userId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  })

  if (isLoading) return 'Loading...'
  if (error) return `An error occurred: ${error.message}`

  return <div>Hello {data.name}!</div>
}
```

### useMutation Hook
Used for creating, updating, or deleting data.

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodo() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => {
      console.error('Failed to add todo:', error)
    }
  })

  return (
    <button
      onClick={() => {
        mutation.mutate({ title: 'New Todo' })
      }}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Adding...' : 'Add Todo'}
    </button>
  )
}
```

## React Native Specific Configuration

### Setup with Expo/React Native

```tsx
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { focusManager } from '@tanstack/react-query'
import { AppState, Platform } from 'react-native'

function onAppStateChange(status) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { 
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    } 
  },
})

export default function App() {
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)
    return () => subscription?.remove()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  )
}
```

## Advanced Features

### Query Keys
Query keys are used for caching and invalidation.

```tsx
// Simple string key
useQuery({ queryKey: ['todos'], queryFn: fetchTodos })

// Array with parameters
useQuery({ 
  queryKey: ['todo', todoId], 
  queryFn: () => fetchTodo(todoId) 
})

// Complex key with filters
useQuery({ 
  queryKey: ['todos', { status, page }], 
  queryFn: () => fetchTodos(status, page) 
})
```

### Infinite Queries
For pagination and infinite scrolling.

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

function Posts() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  })

  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.posts.map(post => (
            <p key={post.id}>{post.title}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </div>
    </>
  )
}
```

### Query Invalidation
Manually trigger refetches when data changes.

```tsx
import { useQueryClient } from '@tanstack/react-query'

function Button() {
  const queryClient = useQueryClient()

  return (
    <button
      onClick={() => {
        // Invalidate every query in the cache
        queryClient.invalidateQueries()
        
        // Invalidate every query with a key that starts with `todos`
        queryClient.invalidateQueries({ queryKey: ['todos'] })
        
        // Invalidate a specific query
        queryClient.invalidateQueries({ 
          queryKey: ['todo', { id: 5 }] 
        })
      }}
    >
      Invalidate Queries
    </button>
  )
}
```

## Configuration Options

### Query Client Configuration

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

### Per-Query Configuration

```tsx
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 10 * 60 * 1000, // 10 minutes
  cacheTime: 15 * 60 * 1000, // 15 minutes
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchInterval: 30000, // Refetch every 30 seconds
  enabled: !!userId, // Only run when userId is truthy
})
```

## Error Handling

### Global Error Handling

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.status === 404) return false
        return failureCount < 2
      },
    },
  },
})
```

### Component-Level Error Handling

```tsx
function TodoList() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    throwOnError: false, // Handle errors manually
  })

  if (isLoading) return <div>Loading...</div>
  
  if (isError) {
    return (
      <div>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <ul>
      {data.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

## DevTools

### Installation

```bash
npm i @tanstack/react-query-devtools
```

### Usage

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## Best Practices

### 1. Query Key Management
```tsx
// Use a query key factory
const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
}
```

### 2. Custom Hooks
```tsx
function useTodos() {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: fetchTodos,
    staleTime: 5 * 60 * 1000,
  })
}

function useTodo(id: number) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodo(id),
    enabled: !!id,
  })
}
```

### 3. Optimistic Updates
```tsx
const updateTodoMutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] })

    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos'])

    // Optimistically update
    queryClient.setQueryData(['todos'], old => 
      old.map(todo => 
        todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
      )
    )

    return { previousTodos }
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

### 4. Background Refetching
```tsx
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchInterval: 30000, // Refetch every 30 seconds
  refetchIntervalInBackground: true, // Continue refetching in background
})
```

## Common Patterns

### Loading States
```tsx
function TodoList() {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  return (
    <div>
      {isLoading && <div>Initial loading...</div>}
      {isFetching && !isLoading && <div>Refetching...</div>}
      {isError && <div>Error occurred!</div>}
      {data && (
        <ul>
          {data.map(todo => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### Dependent Queries
```tsx
function UserPosts({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })

  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchPosts(user.id),
    enabled: !!user?.id, // Only fetch when user is loaded
  })

  return (
    <div>
      <h1>{user?.name}</h1>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

## Performance Tips

1. **Use staleTime appropriately** - Reduces unnecessary network requests
2. **Implement proper query keys** - Enables efficient caching and invalidation
3. **Use suspense mode for better UX** - Provides cleaner loading states
4. **Implement background refetching** - Keeps data fresh without user interaction
5. **Use select option** - Transform/filter data to prevent unnecessary rerenders

```tsx
const { data: todoCount } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  select: data => data.length, // Only rerender when count changes
})
```

This documentation covers the essential concepts and patterns for using TanStack React Query effectively in React and React Native applications.