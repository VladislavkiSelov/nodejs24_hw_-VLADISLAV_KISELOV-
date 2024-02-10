const fsAsync = require("fs/promises");
const path = require("path");
const loggerFile = require("./utils/logger");
const { createLogger } = loggerFile;
const logger = createLogger("file sync");

const fileSync = {
  start: async () => {
    const sourceFolder = path.join(".", "source");
    const targetFolder = path.join(".", "target");
    //пути к катологам

    async function recutionCopyFile(source, target) {
      const filesSource = await fsAsync.readdir(source, { withFileTypes: true });
      const filesTarget = await fsAsync.readdir(target, { withFileTypes: true });
      //получил все что содержится в каталогах

      for (let file of filesSource) {
        const sourcePath = path.join(source, file.name);
        const targetPath = path.join(target, file.name);
        //перебераю папку с которой нужно скопировать и (создаю,получаю) пути

        const fileStats = await fsAsync.stat(sourcePath);
        const isFileExists = !!filesTarget.find((targetFile) => targetFile.name === file.name); // додав !! на початку щоб отримати boolean
        //проверка папка или нет, и проверка есть ли во втрой папке такие же файлы как в первой

        if (fileStats.isDirectory()) {
          try {
            if (!isFileExists) {
              await fsAsync.mkdir(targetPath);
            }
            await recutionCopyFile(sourcePath, targetPath);
          } catch (err) {
            logger.error("помилка створення папки", file.name);
          }
          //если нет создаем папку в target и перебираем эту папку запускаем рекурсию
        } else if (!isFileExists) {
          try {
            // await fsAsync.writeFile(targetPath, ''); //! некоректно. ти не копіюєш файл із source, а створюєш новий з таким іменем, але ПУСТИЙ ))
            await fsAsync.copyFile(sourcePath, targetPath);
            logger.info(`файл ${file.name} скопійовано`);
            //просто копируем файлы
          } catch (err) {
            logger.error("помилка створення файлу", file.name);
          }
        }
        logger.warn(`файл із source ${file.name} вже є в target`);
      }
    }

    recutionCopyFile(sourceFolder, targetFolder);
  },
};

module.exports = fileSync;
