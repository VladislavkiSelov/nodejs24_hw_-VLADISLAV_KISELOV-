module.exports = fileSync;

const fsAsync = require("fs/promises");
const path = require("path");
const logger = require("./utils/logger")("main");

function fileSync() {
  return {
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

          const isDirectory = await fsAsync.stat(sourcePath);
          const checkExistenceFile = filesTarget.find((targetFile) => targetFile.name === file.name);
          //проверка папка или нет, и проверка есть ли во втрой папке такие же файлы как в первой

          if (isDirectory.isDirectory() && !checkExistenceFile) {
            try {
              await fsAsync.mkdir(targetPath);
              await recutionCopyFile(sourcePath, targetPath);
            } catch (err) {
              logger.error("помилка створення папки");
            }
            //если нет создаем папку в target и перебираем эту папку запускаем рекурсию
          } else if (!checkExistenceFile) {
            try {
              await fsAsync.writeFile(targetPath, "");
              logger.info("файл скопійовано");
              //просто копируем файлы
            } catch (err) {
              logger.error("помилка створення файлу");
            }
          }
          logger.warn(" файл із source вже є в target");
        }
      }
      recutionCopyFile(sourceFolder, targetFolder)
    },
  };
}
