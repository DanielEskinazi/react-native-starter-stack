import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Counter Store - Simple state management
interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Todo Store - More complex state with arrays
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
}

const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [
    { id: '1', text: 'Learn React Native', completed: true },
    { id: '2', text: 'Try Zustand', completed: false },
    { id: '3', text: 'Build awesome apps', completed: false },
  ],
  addTodo: (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    set((state) => ({ todos: [...state.todos, newTodo] }));
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
}));

// User Preferences Store - Persistent-like state
interface UserPrefsStore {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  notifications: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'es' | 'fr') => void;
  toggleNotifications: () => void;
}

const useUserPrefsStore = create<UserPrefsStore>(
  subscribeWithSelector((set) => ({
    theme: 'light',
    language: 'en',
    notifications: true,
    setTheme: (theme) => set({ theme }),
    setLanguage: (language) => set({ language }),
    toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
  }))
);

// Counter Component
function CounterSection() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔢 Counter Store</Text>
      <Text style={styles.counterText}>Count: {count}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.decrementButton]} onPress={decrement}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.incrementButton]} onPress={increment}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Todo Component
function TodoSection() {
  const { todos, toggleTodo, removeTodo, clearCompleted, addTodo } = useTodoStore();
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📝 Todo Store</Text>
      <Text style={styles.statsText}>
        {completedCount}/{totalCount} completed
      </Text>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => addTodo(`New task ${Date.now()}`)}
      >
        <Text style={styles.buttonText}>Add Random Task</Text>
      </TouchableOpacity>

      {todos.map((todo) => (
        <View key={todo.id} style={styles.todoItem}>
          <TouchableOpacity
            style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
            onPress={() => toggleTodo(todo.id)}
          >
            <Text style={styles.checkboxText}>
              {todo.completed ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.todoText, todo.completed && styles.todoTextCompleted]}>
            {todo.text}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeTodo(todo.id)}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      {completedCount > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearCompleted}>
          <Text style={styles.buttonText}>Clear Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// User Preferences Component
function PreferencesSection() {
  const { theme, language, notifications, setTheme, setLanguage, toggleNotifications } = 
    useUserPrefsStore();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>⚙️ User Preferences Store</Text>
      
      <View style={styles.prefRow}>
        <Text style={styles.prefLabel}>Theme:</Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleButton, theme === 'light' && styles.toggleButtonActive]}
            onPress={() => setTheme('light')}
          >
            <Text style={[styles.toggleText, theme === 'light' && styles.toggleTextActive]}>
              Light
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, theme === 'dark' && styles.toggleButtonActive]}
            onPress={() => setTheme('dark')}
          >
            <Text style={[styles.toggleText, theme === 'dark' && styles.toggleTextActive]}>
              Dark
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.prefRow}>
        <Text style={styles.prefLabel}>Language:</Text>
        <View style={styles.toggleGroup}>
          {(['en', 'es', 'fr'] as const).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.toggleButton, language === lang && styles.toggleButtonActive]}
              onPress={() => setLanguage(lang)}
            >
              <Text style={[styles.toggleText, language === lang && styles.toggleTextActive]}>
                {lang.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.switchRow} onPress={toggleNotifications}>
        <Text style={styles.prefLabel}>Notifications:</Text>
        <View style={[styles.switch, notifications && styles.switchOn]}>
          <Text style={styles.switchText}>{notifications ? 'ON' : 'OFF'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function ZustandTest() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🐻 Zustand State Management</Text>
        <Text style={styles.subtitle}>Testing different store patterns</Text>

        <View style={styles.content}>
          <CounterSection />
          <TodoSection />
          <PreferencesSection />
        </View>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Back to Home</Text>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  // Counter styles
  counterText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  incrementButton: {
    backgroundColor: '#28a745',
  },
  decrementButton: {
    backgroundColor: '#dc3545',
  },
  resetButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Todo styles
  statsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#343a40',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  deleteButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  // Preferences styles
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  prefLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343a40',
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switch: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#dc3545',
    minWidth: 50,
    alignItems: 'center',
  },
  switchOn: {
    backgroundColor: '#28a745',
  },
  switchText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Link styles
  link: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#34C759',
    borderRadius: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});