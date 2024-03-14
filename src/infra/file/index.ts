import fs from 'fs';
export class File {
  /**
   * @param path Local que irá salvar o arquivo.
   * @param data Dados a serem salvs
   */
  async write(path: string, data: any) {
    await fs.writeFileSync(`${path}.json`, JSON.stringify(data));
  }
  async read(pathFile: string) {
    return await JSON.parse(fs.readFileSync(pathFile, 'utf-8'))
  }
}