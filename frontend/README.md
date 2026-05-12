# Frontend README

## Требования

Перед запуском убедитесь, что установлены:

- Node.js
- npm

## Установка зависимостей

Из корня репозитория:

```sh
cd frontend
npm install
```

## Запуск приложения

### Обычный dev-режим

```sh
cd frontend
npm run start
```

### Production-like запуск

```sh
cd frontend
npm run start:prod
```

Команда использует [`start:prod`](frontend/package.json:19): старт без dev-режима и с минификацией.

## Тесты

В проекте настроен [`jest`](frontend/package.json:20).

### Запустить все тесты один раз

```sh
cd frontend
npm test
```

или

```sh
cd frontend
npm run test
```

### Запустить тесты с coverage

```sh
cd frontend
npm run test:coverage
```

Скрипт: [`test:coverage`](frontend/package.json:22).

Примеры тестов лежат в папках [`__tests__`](frontend/src/core/utils/__tests__) и рядом с модулями, например [`frontend/src/modules/auth/api/__tests__/`](frontend/src/modules/auth/api/__tests__).

## Линтинг

### Проверка

```sh
cd frontend
npm run lint
```

Скрипт: [`lint`](frontend/package.json:23).

### Автоисправление

```sh
cd frontend
npm run lint:fix
```

Скрипт: [`lint:fix`](frontend/package.json:24).

## Storybook

В проекте также настроен Storybook.

### Web Storybook

```sh
cd frontend
npm run storybook:web
```

Скрипт: [`storybook:web`](frontend/package.json:12).

### Сборка Storybook

```sh
cd frontend
npm run build-storybook
```

Скрипт: [`build-storybook`](frontend/package.json:13).

Если добавили новые stories для native-режима, обновите генерацию через:

```sh
cd frontend
npm run storybook-generate
```

Скрипт: [`storybook-generate`](frontend/package.json:14).
