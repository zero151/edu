# Используем официальный Node.js образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем код приложения
COPY . .

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["node", "server.js"]

