# Архитектура Tipster Frontend (Expo React Native)

> **Версия:** 1.0
> **Дата:** 2026-01-10
> **State Management:** Zustand
> **Data Fetching:** TanStack Query (React Query)

## 📋 Содержание

1. [Обзор проекта](#обзор-проекта)
2. [Структура директорий](#структура-директорий)
3. [Архитектурные слои](#архитектурные-слои)
4. [Технологический стек](#технологический-стек)
5. [Примеры реализации](#примеры-реализации)
6. [Интеграция с Backend](#интеграция-с-backend)
7. [План миграции](#план-миграции)
8. [Best Practices](#best-practices)
9. [FAQ](#faq)

---

## Обзор проекта

**Tipster** - социальная платформа, где пользователи зарабатывают TIP токены за активность (посты, лайки, комментарии).

### Текущий функционал:

- 🔐 Аутентификация (login/register)
- 📱 Лента постов с системой лайков
- 🏆 Рейтинг пользователей
- 📊 Активность пользователя
- 👤 Профиль

### Технологии:

- **Framework**: Expo SDK 54 + React Native 0.81
- **Navigation**: Expo Router (file-based)
- **UI**: Tamagui 1.144
- **Forms**: React Hook Form 7.70
- **State**: Zustand (планируется)
- **Data Fetching**: TanStack Query (планируется)
- **Backend**: Go Auth Service

---

## Структура директорий

### Важно о структуре Expo Router

**Директория `app/` ДОЛЖНА находиться в корне проекта** - это требование Expo Router для file-based routing. Вся бизнес-логика, компоненты и утилиты выносятся в `src/`, а `app/` содержит только экраны (screens) и layouts.

```
tipster/frontend/
├── app/                          # 📱 Expo Router screens (ОБЯЗАТЕЛЬНО в корне!)
│   ├── (tabs)/                   # Tab group - главные экраны приложения
│   │   ├── _layout.tsx          # Tab navigator конфигурация
│   │   ├── index.tsx            # Feed screen (лента постов)
│   │   ├── rating.tsx           # Rating screen (рейтинг)
│   │   ├── activity.tsx         # Activity screen (активность)
│   │   └── profile.tsx          # Profile screen (профиль)
│   ├── _layout.tsx              # Root layout с providers
│   ├── index.tsx                # Entry point (redirect на login)
│   ├── login.tsx                # Login screen
│   └── register.tsx             # Register screen
│
├── src/                          # 🎯 Вся бизнес-логика приложения
│   │
│   ├── api/                      # API Layer
│   │   ├── client.ts            # Axios instance with interceptors
│   │   ├── endpoints/           # API endpoint definitions
│   │   │   ├── auth.api.ts      # Auth endpoints
│   │   │   ├── posts.api.ts     # Posts endpoints
│   │   │   ├── users.api.ts     # Users endpoints
│   │   │   └── tips.api.ts      # Tips/balance endpoints
│   │   └── types/               # API types
│   │       ├── auth.types.ts
│   │       ├── post.types.ts
│   │       ├── user.types.ts
│   │       └── common.types.ts
│   │
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.styles.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Input.styles.ts
│   │   │   ├── Card/
│   │   │   ├── Avatar/
│   │   │   └── index.ts
│   │   │
│   │   ├── forms/               # Form components
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormError.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── feed/                # Feed-specific components
│   │   │   ├── PostCard/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostCard.styles.ts
│   │   │   │   └── PostCard.types.ts
│   │   │   ├── CreatePostButton.tsx
│   │   │   ├── InfoBanner.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── layout/              # Layout components
│   │       ├── Header.tsx
│   │       ├── Container.tsx
│   │       └── index.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── api/                 # API hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── usePosts.ts
│   │   │   ├── useUsers.ts
│   │   │   └── useTipBalance.ts
│   │   ├── ui/                  # UI hooks
│   │   │   ├── useInfiniteScroll.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useToast.ts
│   │   └── index.ts
│   │
│   ├── store/                    # Zustand stores
│   │   ├── authStore.ts         # Authentication state
│   │   ├── userStore.ts         # User profile state
│   │   ├── postStore.ts         # Posts state (optional)
│   │   └── index.ts
│   │
│   ├── services/                 # Business logic layer
│   │   ├── auth.service.ts      # Auth operations
│   │   ├── post.service.ts      # Post operations
│   │   ├── storage.service.ts   # AsyncStorage wrapper
│   │   ├── analytics.service.ts # Analytics tracking
│   │   └── index.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── validation/          # Validation schemas
│   │   │   ├── auth.schema.ts   # Zod schemas for auth
│   │   │   ├── post.schema.ts
│   │   │   └── index.ts
│   │   ├── formatters/          # Formatters
│   │   │   ├── date.ts
│   │   │   ├── number.ts
│   │   │   └── index.ts
│   │   ├── errors.ts            # Error handling
│   │   ├── constants.ts         # App constants
│   │   └── index.ts
│   │
│   ├── types/                    # TypeScript types
│   │   ├── models.ts            # Domain models
│   │   ├── navigation.ts        # Navigation types
│   │   ├── common.ts            # Common types
│   │   └── index.ts
│   │
│   └── config/                   # Configuration
│       ├── env.ts               # Environment variables
│       ├── api.config.ts        # API configuration
│       └── query.config.ts      # React Query config
│
├── assets/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── tamagui.config.ts            # Tamagui configuration
├── themes.ts                     # Theme definitions
├── tokens.ts                     # Design tokens
├── app.json                      # Expo configuration
├── package.json
└── tsconfig.json
```

### Почему `app/` отдельно от `src/`?

**Причины разделения:**

1. **Требование Expo Router** - `app/` должна быть в корне для работы file-based routing
2. **Разделение ответственности**:
   - `app/` = только UI экранов и навигация (thin layer)
   - `src/` = вся бизнес-логика, компоненты, хуки, API (thick layer)
3. **Чистота кода** - экраны в `app/` становятся простыми композициями компонентов из `src/`

**Пример правильного использования:**

```typescript
// ❌ ПЛОХО - вся логика в app/login.tsx
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const handleLogin = async () => {
    const response = await fetch('/api/login', ...);
    // 100+ строк логики
  };
  return <View>...</View>;
}

// ✅ ХОРОШО - app/login.tsx только композиция
import { LoginForm } from '@/components/auth/LoginForm';
import { useLogin } from '@/hooks/api/useAuth';

export default function LoginScreen() {
  const { mutate: login, isPending } = useLogin();

  return (
    <Container>
      <LoginForm onSubmit={login} isLoading={isPending} />
    </Container>
  );
}
```

**Импорты из `src/`:**

```typescript
// В любом файле проекта используем алиас @/
import { useAuth } from "@/hooks/api/useAuth";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/api/endpoints/auth.api";
import { ENV } from "@/config/env";
```

**Настройка алиаса в tsconfig.json:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Архитектурные слои

### Диаграмма потока данных

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
│                   (Screens & Components)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Hooks Layer                              │
│              (Custom hooks + React Query)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   State Layer                                │
│                  (Zustand Stores)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Services Layer                              │
│              (Business Logic)                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                 │
│              (HTTP Client + Endpoints)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API                                │
│              (Go Auth Service + Others)                      │
└─────────────────────────────────────────────────────────────┘
```

### Описание слоев

1. **UI Layer** - React компоненты и экраны
2. **Hooks Layer** - Кастомные хуки для переиспользования логики
3. **State Layer** - Глобальное состояние (Zustand)
4. **Services Layer** - Бизнес-логика и операции
5. **API Layer** - HTTP запросы и типизация
6. **Backend** - REST API на Go

---

## Технологический стек

### Основные библиотеки

```json
{
  "dependencies": {
    "expo": "~54.0.31",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "expo-router": "~6.0.21",

    "tamagui": "^1.144.1",
    "react-hook-form": "^7.70.0",

    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.5",
    "zod": "^3.22.4",

    "@react-native-async-storage/async-storage": "^1.21.0",
    "date-fns": "^3.0.6",
    "react-native-toast-message": "^2.2.0"
  }
}
```

### Зачем каждая библиотека?

- **Zustand** - легковесный state management (3kb)
- **TanStack Query** - кеширование, синхронизация, refetching данных
- **Axios** - HTTP клиент с interceptors
- **Zod** - runtime валидация и type inference
- **AsyncStorage** - персистентное хранилище
- **date-fns** - работа с датами (легче moment.js)
- **Toast Message** - уведомления пользователю

---

## Примеры реализации

### 1. API Client

```typescript
// src/api/client.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ENV } from "@/config/env";
import { storageService } from "@/services/storage.service";
import { useAuthStore } from "@/store/authStore";

// Создаем axios instance
export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - добавляем токен к каждому запросу
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Если 401 - токен истек
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Очищаем токен и редиректим на login
      await storageService.clearToken();
      useAuthStore.getState().logout();

      // В Expo Router можно использовать router.replace('/login')
    }

    return Promise.reject(error);
  }
);

// Типизированный wrapper для запросов
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    return new Error(message);
  }
  return new Error("Неизвестная ошибка");
}
```

### 2. Auth API Endpoints

```typescript
// src/api/endpoints/auth.api.ts
import { apiClient } from "../client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.types";

export const authApi = {
  /**
   * Вход пользователя
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  /**
   * Регистрация пользователя
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      data
    );
    return response.data;
  },

  /**
   * Получение текущего пользователя
   */
  async getCurrentUser() {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  /**
   * Выход
   */
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};
```

### 3. API Types

```typescript
// src/api/types/auth.types.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  tipBalance: number;
  createdAt: string;
}
```

```typescript
// src/api/types/post.types.ts
export interface Post {
  id: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  tipAmount: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
}

export interface GetPostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    hasMore: boolean;
  };
}
```

### 4. Zustand Store

```typescript
// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@/api/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),

      setToken: (token) => set({ token }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Сохраняем только нужные поля
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

```typescript
// src/store/userStore.ts
import { create } from "zustand";

interface UserState {
  tipBalance: number;
  totalPosts: number;
  totalLikes: number;
}

interface UserActions {
  updateBalance: (amount: number) => void;
  incrementPosts: () => void;
  incrementLikes: () => void;
  setUserStats: (stats: Partial<UserState>) => void;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  // State
  tipBalance: 0,
  totalPosts: 0,
  totalLikes: 0,

  // Actions
  updateBalance: (amount) =>
    set((state) => ({ tipBalance: state.tipBalance + amount })),

  incrementPosts: () => set((state) => ({ totalPosts: state.totalPosts + 1 })),

  incrementLikes: () => set((state) => ({ totalLikes: state.totalLikes + 1 })),

  setUserStats: (stats) => set((state) => ({ ...state, ...stats })),
}));
```

### 5. Custom Hooks with React Query

```typescript
// src/hooks/api/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { authApi } from "@/api/endpoints/auth.api";
import { useAuthStore } from "@/store/authStore";
import { storageService } from "@/services/storage.service";
import type { LoginRequest, RegisterRequest } from "@/api/types/auth.types";

export function useLogin() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response) => {
      // Сохраняем токен
      await storageService.setToken(response.token);

      // Обновляем store
      setToken(response.token);
      setUser(response.user);

      // Инвалидируем кеш
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Редирект на главную
      router.replace("/(tabs)");
    },
    onError: (error: Error) => {
      console.error("Login error:", error.message);
      // Показываем toast с ошибкой
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: async (response) => {
      await storageService.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
      router.replace("/(tabs)");
    },
    onError: (error: Error) => {
      console.error("Register error:", error.message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      await storageService.clearToken();
      logout();
      queryClient.clear();
      router.replace("/login");
    },
  });
}
```

```typescript
// src/hooks/api/usePosts.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { postsApi } from "@/api/endpoints/posts.api";
import { useUserStore } from "@/store/userStore";
import type { CreatePostRequest } from "@/api/types/post.types";

export function usePosts(page = 1) {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: () => postsApi.getPosts(page),
    staleTime: 30000, // 30 секунд
  });
}

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: ({ pageParam = 1 }) => postsApi.getPosts(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { incrementPosts, updateBalance } = useUserStore();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
    onSuccess: () => {
      // Инвалидируем кеш постов
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Обновляем статистику
      incrementPosts();
      updateBalance(10); // +10 TIP за пост
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  const { incrementLikes, updateBalance } = useUserStore();

  return useMutation({
    mutationFn: (postId: string) => postsApi.likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      incrementLikes();
      updateBalance(1); // +1 TIP за лайк
    },
  });
}
```

### 6. Storage Service

```typescript
// src/services/storage.service.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  TOKEN: "@tipster:token",
  USER: "@tipster:user",
  THEME: "@tipster:theme",
} as const;

export const storageService = {
  // Token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.TOKEN);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TOKEN, token);
    } catch (error) {
      console.error("Error setting token:", error);
    }
  },

  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.TOKEN);
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  },

  // Generic methods
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
```

### 7. Validation Schemas

```typescript
// src/utils/validation/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email обязателен").email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен быть минимум 6 символов"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Минимум 3 символа")
      .max(20, "Максимум 20 символов")
      .regex(/^[a-zA-Z0-9_]+$/, "Только буквы, цифры и подчеркивание"),
    email: z.string().min(1, "Email обязателен").email("Неверный формат email"),
    password: z
      .string()
      .min(6, "Пароль должен быть минимум 6 символов")
      .max(50, "Максимум 50 символов"),
    confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
```

```typescript
// src/utils/validation/post.schema.ts
import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Пост не может быть пустым")
    .max(500, "Максимум 500 символов"),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
```

### 8. Environment Configuration

```typescript
// src/config/env.ts
import Constants from "expo-constants";

const ENV_CONFIG = {
  development: {
    API_URL: "http://localhost:8080/api",
    WS_URL: "ws://localhost:8080",
  },
  staging: {
    API_URL: "https://staging-api.tipster.com/api",
    WS_URL: "wss://staging-api.tipster.com",
  },
  production: {
    API_URL: "https://api.tipster.com/api",
    WS_URL: "wss://api.tipster.com",
  },
};

const getEnvVars = () => {
  const env = Constants.expoConfig?.extra?.env || "development";
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development;
};

export const ENV = {
  ...getEnvVars(),
  ENV: Constants.expoConfig?.extra?.env || "development",
  VERSION: Constants.expoConfig?.version || "1.0.0",
} as const;
```

```json
// app.json
{
  "expo": {
    "name": "Tipster",
    "slug": "tipster",
    "version": "1.0.0",
    "extra": {
      "env": "development"
    }
  }
}
```

### 9. React Query Configuration

```typescript
// src/config/query.config.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 минута
      gcTime: 300000, // 5 минут (было cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### 10. Root Layout с Providers

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import tamaguiConfig from '../tamagui.config';
import { queryClient } from '@/config/query.config';
import { useAuthStore } from '@/store/authStore';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
            </>
          ) : (
            <Stack.Screen name="(tabs)" />
```

---

## Интеграция с Backend

### Backend Auth Service (Go)

Ваш backend auth service уже работает на Go. Вот как интегрировать его с frontend:

#### Backend Endpoints

```
POST /auth/register - Регистрация
POST /auth/login    - Вход
GET  /auth/me       - Получить текущего пользователя
POST /auth/logout   - Выход
```

#### Пример интеграции

```typescript
// src/api/endpoints/auth.api.ts
import { apiClient } from "../client";

export const authApi = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    // Соответствует вашему Go backend
    const response = await apiClient.post("/auth/register", {
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/login", {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};
```

#### Environment Configuration

```typescript
// .env.development
EXPO_PUBLIC_API_URL=http://localhost:8080/api
EXPO_PUBLIC_ENV=development

// .env.production
EXPO_PUBLIC_API_URL=https://api.tipster.com/api
EXPO_PUBLIC_ENV=production
```

### Дополнительные Backend Endpoints (планируемые)

```typescript
// Posts API
GET    /posts              - Получить ленту постов
POST   /posts              - Создать пост
GET    /posts/:id          - Получить пост
DELETE /posts/:id          - Удалить пост
POST   /posts/:id/like     - Лайкнуть пост
DELETE /posts/:id/like     - Убрать лайк
GET    /posts/:id/comments - Получить комментарии

// Users API
GET    /users/:id          - Получить профиль пользователя
GET    /users/:id/posts    - Получить посты пользователя
GET    /users/rating       - Получить рейтинг пользователей
PATCH  /users/me           - Обновить свой профиль

// Tips API
GET    /tips/balance       - Получить баланс TIP токенов
GET    /tips/history       - История транзакций
POST   /tips/withdraw      - Вывести токены
```

---

## План миграции

### Фаза 1: Подготовка инфраструктуры (1-2 дня)

**Цель:** Настроить базовую инфраструктуру проекта

- [ ] Установить зависимости

  ```bash
  npm install zustand @tanstack/react-query axios zod
  npm install @react-native-async-storage/async-storage
  npm install date-fns react-native-toast-message
  ```

- [ ] Создать структуру директорий `src/`

  ```bash
  mkdir -p src/{api/{endpoints,types},components/{ui,forms,feed,layout},hooks/{api,ui},store,services,utils/{validation,formatters},types,config}
  ```

- [ ] Настроить TypeScript алиасы в `tsconfig.json`

  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```

- [ ] Настроить environment variables
- [ ] Создать базовую конфигурацию React Query

### Фаза 2: API Layer (2-3 дня)

**Цель:** Создать слой работы с API

- [ ] Создать API client с interceptors ([`src/api/client.ts`](src/api/client.ts:1))
- [ ] Реализовать auth endpoints ([`src/api/endpoints/auth.api.ts`](src/api/endpoints/auth.api.ts:1))
- [ ] Создать типы для API ([`src/api/types/auth.types.ts`](src/api/types/auth.types.ts:1))
- [ ] Добавить обработку ошибок ([`src/utils/errors.ts`](src/utils/errors.ts:1))
- [ ] Протестировать интеграцию с Go backend

### Фаза 3: State Management (2-3 дня)

**Цель:** Настроить управление состоянием

- [ ] Создать Zustand store для аутентификации ([`src/store/authStore.ts`](src/store/authStore.ts:1))
- [ ] Создать store для пользователя ([`src/store/userStore.ts`](src/store/userStore.ts:1))
- [ ] Реализовать storage service ([`src/services/storage.service.ts`](src/services/storage.service.ts:1))
- [ ] Настроить персистентность состояния
- [ ] Добавить middleware для логирования (dev mode)

### Фаза 4: Authentication Flow (3-4 дня)

**Цель:** Реализовать полный flow аутентификации

- [ ] Создать custom hooks для auth ([`src/hooks/api/useAuth.ts`](src/hooks/api/useAuth.ts:1))
- [ ] Добавить валидацию форм с Zod ([`src/utils/validation/auth.schema.ts`](src/utils/validation/auth.schema.ts:1))
- [ ] Рефакторить [`app/login.tsx`](app/login.tsx:1) с использованием новых hooks
- [ ] Рефакторить [`app/register.tsx`](app/register.tsx:1)
- [ ] Добавить защиту роутов (redirect если не авторизован)
- [ ] Реализовать автоматический refresh токена

### Фаза 5: UI Components Library (3-4 дня)

**Цель:** Создать переиспользуемые компоненты

- [ ] Создать базовые UI компоненты

  - [`src/components/ui/Button`](src/components/ui/Button:1)
  - [`src/components/ui/Input`](src/components/ui/Input:1)
  - [`src/components/ui/Card`](src/components/ui/Card:1)
  - [`src/components/ui/Avatar`](src/components/ui/Avatar:1)

- [ ] Создать form компоненты

  - [`src/components/forms/FormInput.tsx`](src/components/forms/FormInput.tsx:1)
  - [`src/components/forms/FormError.tsx`](src/components/forms/FormError.tsx:1)

- [ ] Создать layout компоненты
  - [`src/components/layout/Header.tsx`](src/components/layout/Header.tsx:1)
  - [`src/components/layout/Container.tsx`](src/components/layout/Container.tsx:1)

### Фаза 6: Feed Feature (4-5 дней)

**Цель:** Реализовать функционал ленты постов

- [ ] Создать posts API endpoints ([`src/api/endpoints/posts.api.ts`](src/api/endpoints/posts.api.ts:1))
- [ ] Создать типы для постов ([`src/api/types/post.types.ts`](src/api/types/post.types.ts:1))
- [ ] Реализовать hooks для постов ([`src/hooks/api/usePosts.ts`](src/hooks/api/usePosts.ts:1))
- [ ] Создать компоненты feed
  - [`src/components/feed/PostCard`](src/components/feed/PostCard:1)
  - [`src/components/feed/CreatePostButton.tsx`](src/components/feed/CreatePostButton.tsx:1)
  - [`src/components/feed/InfoBanner.tsx`](src/components/feed/InfoBanner.tsx:1)
- [ ] Рефакторить [`app/(tabs)/index.tsx`](<app/(tabs)/index.tsx:1>)
- [ ] Добавить infinite scroll
- [ ] Реализовать pull-to-refresh

### Фаза 7: Остальные экраны (3-4 дня)

**Цель:** Реализовать rating, activity, profile

- [ ] Реализовать экран рейтинга ([`app/(tabs)/rating.tsx`](<app/(tabs)/rating.tsx:1>))
- [ ] Реализовать экран активности ([`app/(tabs)/activity.tsx`](<app/(tabs)/activity.tsx:1>))
- [ ] Реализовать экран профиля ([`app/(tabs)/profile.tsx`](<app/(tabs)/profile.tsx:1>))
- [ ] Добавить редактирование профиля
- [ ] Добавить отображение баланса TIP токенов

### Фаза 8: Оптимизация и полировка (2-3 дня)

**Цель:** Улучшить UX и производительность

- [ ] Добавить loading states
- [ ] Добавить error boundaries
- [ ] Реализовать toast notifications
- [ ] Оптимизировать рендеринг списков
- [ ] Добавить skeleton loaders
- [ ] Настроить offline support (опционально)

### Фаза 9: Testing (3-4 дня)

**Цель:** Покрыть тестами критичные части

- [ ] Настроить Jest и React Native Testing Library
- [ ] Написать тесты для API client
- [ ] Написать тесты для stores
- [ ] Написать тесты для hooks
- [ ] Написать тесты для компонентов
- [ ] E2E тесты для критичных флоу (опционально)

### Общая оценка времени

- **Минимум:** 23-28 дней (без тестов и оптимизаций)
- **Оптимально:** 30-35 дней (с тестами и полировкой)
- **С запасом:** 40-45 дней (включая непредвиденные задачи)

---

## Best Practices

### 1. Организация кода

#### ✅ DO

```typescript
// Группируйте связанные файлы в папки
src/components/ui/Button/
  ├── Button.tsx
  ├── Button.styles.ts
  ├── Button.types.ts
  └── index.ts

// Используйте barrel exports
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// Импортируйте через barrel
import { Button, Input, Card } from '@/components/ui';
```

#### ❌ DON'T

```typescript
// Не создавайте огромные файлы
// ❌ components.tsx с 2000+ строк

// Не используйте default exports для компонентов
// ❌ export default function MyComponent() {}
// ✅ export function MyComponent() {}
```

### 2. TypeScript

#### ✅ DO

```typescript
// Используйте строгую типизацию
interface User {
  id: string;
  username: string;
  email: string;
}

// Используйте type inference из Zod
const schema = z.object({ email: z.string() });
type FormData = z.infer<typeof schema>;

// Типизируйте API responses
async function getUser(): Promise<User> {
  const response = await apiClient.get<User>("/users/me");
  return response.data;
}
```

#### ❌ DON'T

```typescript
// Не используйте any
// ❌ const data: any = await fetch();

// Не игнорируйте ошибки типов
// ❌ // @ts-ignore

// Не создавайте слишком общие типы
// ❌ type Props = { data: any; onPress: Function };
```

### 3. React Hooks

#### ✅ DO

```typescript
// Создавайте кастомные хуки для переиспользования
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Используйте React Query для данных
function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => postsApi.getPosts(),
  });
}
```

#### ❌ DON'T

```typescript
// Не делайте fetch в useEffect
// ❌
useEffect(() => {
  fetch("/api/posts")
    .then((r) => r.json())
    .then(setData);
}, []);

// Не создавайте сложную логику в компонентах
// ❌ 100+ строк логики в компоненте
```

### 4. State Management

#### ✅ DO

```typescript
// Используйте Zustand для глобального состояния
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Используйте React Query для серверного состояния
const { data: posts } = usePosts();

// Используйте useState для локального UI состояния
const [isOpen, setIsOpen] = useState(false);
```

#### ❌ DON'T

```typescript
// Не храните серверные данные в Zustand
// ❌ const usePostsStore = create(() => ({ posts: [] }));

// Не используйте Context для всего
// ❌ <PostsContext><UsersContext><ThemeContext>...
```

### 5. Performance

#### ✅ DO

```typescript
// Мемоизируйте тяжелые вычисления
const sortedPosts = useMemo(
  () => posts.sort((a, b) => b.likes - a.likes),
  [posts]
);

// Используйте React.memo для компонентов
export const PostCard = React.memo(({ post }: Props) => {
  return <Card>...</Card>;
});

// Используйте FlashList вместо FlatList
import { FlashList } from "@shopify/flash-list";
```

#### ❌ DON'T

```typescript
// Не создавайте функции в render
// ❌ <Button onPress={() => handlePress(id)} />
// ✅ <Button onPress={handlePress} />

// Не используйте inline styles
// ❌ <View style={{ flex: 1, padding: 20 }} />
// ✅ <View style={styles.container} />
```

### 6. Error Handling

#### ✅ DO

```typescript
// Обрабатывайте ошибки на уровне API
try {
  const data = await apiClient.get("/posts");
  return data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || "Network error"
    );
  }
  throw error;
}

// Используйте Error Boundaries
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>;

// Показывайте пользователю понятные ошибки
const { error } = usePosts();
if (error) {
  return <ErrorMessage message="Не удалось загрузить посты" />;
}
```

### 7. Security

#### ✅ DO

```typescript
// Храните токены в secure storage
import * as SecureStore from "expo-secure-store";

async function saveToken(token: string) {
  await SecureStore.setItemAsync("token", token);
}

// Валидируйте данные на клиенте
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Не логируйте чувствительные данные
console.log("Login attempt", { email }); // ✅
// console.log('Login', { email, password }); // ❌
```

### 8. Git Workflow

```bash
# Создавайте feature branches
git checkout -b feature/auth-flow
git checkout -b fix/login-validation

# Делайте атомарные коммиты
git commit -m "feat: add login API endpoint"
git commit -m "refactor: extract auth hooks"
git commit -m "fix: handle 401 errors in interceptor"

# Используйте conventional commits
feat: новая функция
fix: исправление бага
refactor: рефакторинг
docs: документация
test: тесты
chore: рутинные задачи
```

---

## FAQ

### Q: Почему Zustand, а не Redux?

**A:** Zustand проще, легче (3kb vs 20kb+), имеет меньше boilerplate и отлично подходит для приложений малого и среднего размера. Redux нужен только для очень сложных приложений с множеством взаимосвязанных состояний.

### Q: Зачем React Query, если есть Zustand?

**A:** React Query специализируется на серверном состоянии (кеширование, refetching, синхронизация), а Zustand - на клиентском. Они дополняют друг друга:

- **React Query** - для данных с сервера (posts, users, etc.)
- **Zustand** - для UI состояния (theme, modals, etc.)

### Q: Можно ли использовать Context API вместо Zustand?

**A:** Да, но Zustand удобнее:

- Нет Provider hell
- Лучше производительность (селекторы)
- Проще тестировать
- Меньше boilerplate

### Q: Как организовать большие формы?

**A:** Используйте React Hook Form + Zod:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

### Q: Как обрабатывать offline режим?

**A:** React Query имеет встроенную поддержку:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
      retry: 3,
    },
  },
});
```

### Q: Нужны ли unit тесты для всего?

**A:** Нет, фокусируйтесь на:

- Критичная бизнес-логика (services, utils)
- Сложные хуки
- Компоненты с логикой
- API client и interceptors

UI компоненты можно тестировать визуально (Storybook) или E2E тестами.

### Q: Как деплоить Expo приложение?

**A:**

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## Полезные ссылки

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Tamagui Documentation](https://tamagui.dev/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

---

**Создано:** 2026-01-10  
**Автор:** Yandex Code Assistant  
**Версия:** 1.0
