import fs from 'fs';
export class File {
  /**
 * @param path Local que irá salvar o arquivo.
 * @param data Dados a serem salvs
 */
  static Write(path: string, data: any) {
    fs.writeFileSync(`${path}.json`, JSON.stringify(data));
  }
  /**
* @param path Local para realizar a leitura
*/
  static Read(pathFile: string) {
    try {
      return JSON.parse(fs.readFileSync(pathFile, 'utf-8'))
    } catch (error) {
    }
  }
}