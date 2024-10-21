//node convertFonts.mjs public/assets/fonts/Rubik

import { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, extname, join } from "path";
import ttf2woff2 from "ttf2woff2";

// Проверьте, предоставлен ли путь к директории
if (process.argv.length < 3) {
  console.error("Пожалуйста, укажите путь к директории, содержащей шрифты.");
  process.exit(1);
}

// Определите путь к файлам шрифтов
const FONT_DIR = resolve(process.argv[2]);

// Убедитесь, что предоставленный путь существует и является директорией
if (!existsSync(FONT_DIR) || !lstatSync(FONT_DIR).isDirectory()) {
  console.error("Предоставленный путь не существует или не является директорией.");
  process.exit(1);
}

// Получите список файлов шрифтов
const fontFiles = readdirSync(FONT_DIR).filter(file => extname(file).toLowerCase() === '.ttf');

for (const fontFile of fontFiles) {
  try {
    // Прочитайте файл TTF
    const ttfPath = join(FONT_DIR, fontFile);
    console.log(`Обработка файла: ${ttfPath}`);
    const ttf = readFileSync(ttfPath);

    // Конвертируйте TTF в WOFF2
    const woff2 = ttf2woff2(ttf);
    const woff2Path = join(FONT_DIR, fontFile.replace('.ttf', '.woff2'));
    writeFileSync(woff2Path, Buffer.from(woff2));
    console.log(`Конвертировано в WOFF2: ${woff2Path}`);
  } catch (error) {
    console.error(`Не удалось обработать ${fontFile}:`, error);
  }
}

console.log("Конвертация завершена.");