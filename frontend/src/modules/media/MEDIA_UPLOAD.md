# Работа с фото на фронтенде

## Общая архитектура

Загрузка изображений проходит через **media-сервис** (`/media/*`), который управляет S3-хранилищем. Фронтенд взаимодействует только с одним эндпоинтом media-сервиса — `POST /media/presigned-url`. Коммит файлов (перенос из temp в permanent bucket) выполняется **бэкендом content-сервиса** автоматически при создании поста/комментария.

### Схема загрузки изображений

```
1. Пользователь выбирает фото (expo-image-picker)
         │
         ▼
2. Фронтенд → POST /media/presigned-url
   Отправляет: { files: [{ content_type, size_bytes }], purpose }
   Получает:   { uploads: [{ object_key, upload_url }] }
         │
         ▼
3. Фронтенд → PUT upload_url (presigned URL)
   Загружает файл по presigned URL (temp bucket)
         │
         ▼
4. Фронтенд → POST /content/posts (или /content/comments)
   Передаёт: { content, image_object_ids: [object_key, ...] }
   Content-сервис сам вызывает POST /media/commit для переноса
   файлов из temp bucket в permanent bucket
```

### Бэкенд-эндпоинты media-сервиса

| Эндпоинт                    | Кто вызывает                | Описание                                   |
| --------------------------- | --------------------------- | ------------------------------------------ |
| `POST /media/presigned-url` | **Фронтенд**                | Получить presigned URL для загрузки файла  |
| `POST /media/commit`        | **Content-сервис (бэкенд)** | Перенести файлы из temp в permanent bucket |

> ⚠️ Фронтенд **НЕ** вызывает `/media/commit` напрямую — это делает content-сервис.

## Файлы модуля media

```
frontend/src/modules/media/
├── index.ts                      # Barrel-экспорт модуля
├── api/
│   ├── client.ts                 # Axios-инстанс для media-сервиса
│   ├── types.ts                  # TypeScript-типы (запросы/ответы)
│   └── media.service.ts          # API: getPresignedUrls
├── hooks/
│   └── useMediaUpload.ts         # React-хук для загрузки изображений
└── utils/
    └── getImageUrl.ts            # Утилита для формирования URL изображения
```

## API-клиент (`client.ts`)

- Base URL: `MEDIA_API_URL` (по умолчанию `http://localhost:8084`)
- Timeout: 30 секунд (увеличен для загрузки файлов)
- Автоматически добавляет JWT-токен из AsyncStorage в заголовок `Authorization`

## Сервис (`media.service.ts`)

Содержит единственный метод — обёртку над бэкенд-эндпоинтом:

### `getPresignedUrls(data)`

- **Эндпоинт:** `POST /media/presigned-url`
- **Запрос:** `{ files: [{ content_type, size_bytes }], purpose }`
  - `purpose` — назначение: `"post_images"` или `"comment_images"`
- **Ответ:** `{ uploads: [{ object_key, upload_url }] }`
  - `object_key` — ключ объекта в S3 (например, `uuid1.jpg`)
  - `upload_url` — presigned URL для загрузки файла

## Хук `useMediaUpload`

```typescript
const { uploadImages, isUploading, progress, error, resetError } =
  useMediaUpload();
```

Хук инкапсулирует весь процесс загрузки:

1. Запрашивает presigned URL через `mediaService.getPresignedUrls()`
2. Загружает каждый файл по presigned URL (PUT через XMLHttpRequest)
3. Возвращает `object_keys` для передачи в эндпоинт создания поста/комментария

### Возвращаемые значения

| Поле           | Тип                                            | Описание                                 |
| -------------- | ---------------------------------------------- | ---------------------------------------- |
| `uploadImages` | `(assets, purpose) => Promise<{ objectKeys }>` | Загружает массив изображений             |
| `isUploading`  | `boolean`                                      | Идёт ли загрузка                         |
| `progress`     | `number` (0..1)                                | Прогресс загрузки (по количеству файлов) |
| `error`        | `Error \| null`                                | Последняя ошибка загрузки                |
| `resetError`   | `() => void`                                   | Сброс ошибки                             |

### Пример использования

```typescript
import { useMediaUpload } from "@/src/modules/media";

const { uploadImages, isUploading, progress } = useMediaUpload();

const handlePost = async () => {
  let imageObjectIds: string[] | undefined;

  if (images.length > 0) {
    const result = await uploadImages(images, "post_images");
    imageObjectIds = result.objectKeys;
  }

  createPost({ content, image_object_ids: imageObjectIds });
};
```

## Где используется

### Создание поста (`create-post.tsx`)

1. Пользователь выбирает до 4 изображений через `expo-image-picker`
2. Хранятся как `ImagePickerAsset[]` (с URI, размером, типом)
3. При нажатии «Опубликовать»:
   - Вызывается `uploadImages(images, "post_images")`
   - Полученные `objectKeys` передаются в `createPost({ content, image_object_ids })`
4. Во время загрузки показывается индикатор прогресса

### Редактирование поста (`edit-post-modal.tsx`)

1. Если пользователь выбрал новое фото — загружается через `uploadImages()`
2. Если фото удалено — передаётся пустой массив `image_object_ids: []`
3. Если фото не менялось — `image_object_ids` не передаётся (undefined)

## Текущее состояние: аватар профиля

⚠️ **Аватар профиля пока НЕ использует media-сервис.**

Сейчас в `useProfileForm.ts` и `editProfileScreen/index.tsx`:

- Фото выбирается через `ImagePicker`
- Локальный `file://` URI передаётся напрямую как `avatar_url` в `PATCH /users/profile`
- Это **не работает корректно** — другие пользователи не смогут увидеть аватар, т.к. `file://` путь локальный

### Что нужно для исправления

1. На бэкенде: добавить поддержку `purpose: "avatar"` в media-сервисе
2. На фронтенде: использовать `useMediaUpload()` для загрузки аватара, передавать S3 URL/ключ вместо локального пути

## Типы данных

### Запрос presigned URL

```typescript
interface PresignedUploadRequest {
  files: { content_type: string; size_bytes: number }[];
  purpose: "post_images" | "comment_images";
}
```

### Ответ presigned URL

```typescript
interface PresignedUploadResponse {
  uploads: { object_key: string; upload_url: string }[];
}
```

### Поля постов/комментариев

```typescript
interface CreatePostRequest {
  content: string;
  image_object_ids?: string[];
}

interface PostResponse {
  id: string;
  author_id: string;
  content: string;
  image_object_ids: string[];
  created_at: string;
  updated_at: string;
}
```
