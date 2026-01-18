---
title: "Почему я выбрал Hugo для своего блога"
date: 2026-01-10T15:30:00+02:00
draft: true
description: "Обзор генератора статических сайтов Hugo и сравнение с другими решениями"
author: "Alexey Sibirtsev"
categories: ["Веб-разработка"]
tags: ["hugo", "static-site", "blog"]
toc: true
comments: true
---

## Введение

Когда я решил создать свой блог, передо мной встал выбор: какую платформу использовать? WordPress, Jekyll, Gatsby, Next.js или что-то другое?

## Требования к блогу

Мне нужно было решение, которое:
- ✅ Быстро работает
- ✅ Легко в использовании
- ✅ Поддерживает Markdown
- ✅ Имеет гибкую систему тем
- ✅ Работает без базы данных

## Почему Hugo?

### Скорость

Hugo написан на **Go** и компилируется в один бинарный файл. Это делает его невероятно быстрым:

```bash
# Сборка сайта с 1000+ страниц за секунды
hugo --minify
```

### Простота

Установка Hugo занимает пару минут:

```bash
# Windows (Chocolatey)
choco install hugo-extended

# macOS (Homebrew)
brew install hugo

# Linux
snap install hugo
```

### Markdown-first

Весь контент пишется в Markdown. Это просто, удобно и переносимо.

```markdown
---
title: "Мой пост"
date: 2026-01-10
---

# Заголовок

Текст поста...
```

## Сравнение с альтернативами

### Hugo vs Jekyll

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

| Фича | Hugo | Jekyll |
| ------ | ------ | -------- |
| Язык | Go | Ruby |
| Скорость | ⚡⚡⚡ | ⚡ |
| Установка | Простая | Сложная |
| Плагины | Встроенные | Gem-based |

### Hugo vs WordPress

WordPress - отличная CMS, но для блога это перебор:
- Требует базу данных
- Медленнее работает
- Больше уязвимостей безопасности
- Нужен хостинг с PHP

Hugo генерирует статические HTML файлы, которые можно хостить где угодно.

## Структура проекта Hugo

```
my-blog/
├── content/          # Контент сайта
│   ├── posts/       # Посты блога
│   └── pages/       # Статические страницы
├── layouts/         # Шаблоны
├── static/          # Статические файлы
├── themes/          # Темы
└── config.toml      # Конфигурация
```

## Работа с темами

Одна из сильных сторон Hugo - система тем. Можно:
- Использовать готовые темы из [Hugo Themes](https://themes.gohugo.io/)
- Создать свою тему
- Настроить существующую

### Моя тема

Я создал свою тему **SiberianCoder** с:
- Поддержкой портфолио
- Адаптивным дизайном
- Темной темой
- Многоязычностью

## Хостинг

Hugo-сайт можно захостить на:
- **GitHub Pages** (бесплатно)
- **Netlify** (бесплатно)
- **Vercel** (бесплатно)
- Любом статическом хостинге

### GitHub Actions

Я настроил автоматический деплой через GitHub Actions:

```yaml
name: Deploy Hugo site
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
      - name: Build
        run: hugo --minify
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
```

## Минусы Hugo

Честно говоря, есть и недостатки:
- Нет админки (всё через файлы)
- Go templates требуют привыкания
- Меньше плагинов, чем у Jekyll

Но для меня плюсы перевешивают.

## Заключение

Hugo - отличный выбор для технического блога или портфолио. Он быстрый, простой и мощный.

Если вы хотите попробовать Hugo, начните с [официальной документации](https://gohugo.io/documentation/).

**Рекомендую!** ⭐⭐⭐⭐⭐
