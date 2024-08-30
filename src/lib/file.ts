import fs from "node:fs";
import fsPromises from "node:fs/promises";

export const initDir = async (path: fs.PathLike) => {
  if (!fs.existsSync(path)) await fsPromises.mkdir(path);
};

export const initFile = async (path: fs.PathLike, content: string) => {
  if (!fs.existsSync(path)) await fsPromises.writeFile(path, content);
};
