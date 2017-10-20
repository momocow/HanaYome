import * as cson from 'cson'
import * as fs from 'fs-extra'
import * as path from 'path'

export function loadCSONFile(filename: string): any {
    fs.accessSync(filename, fs.constants.R_OK)
    let data
    if ((data = cson.load(filename)) instanceof Error) {
        throw data
    }
    return data
}

/**
* Ensure and load the cson file into an object
*/
export function ensureCSONFile(filename: string): any {
    fs.ensureFileSync(filename)
    return loadCSONFile(filename)
}

/**
* Ensure and write the object into a cson file
*/
export function writeCSONFile(filename: string, content: object): void {
    fs.ensureFile(filename)
    fs.accessSync(filename, fs.constants.W_OK)
    fs.writeFileSync(filename, cson.stringify(content, null, 4))
}

/**
 * Read the file with file extension '.cson' or '.json' and parse the content into an object
 */
export function parseObject(filename: string): any {
    fs.accessSync(filename, fs.constants.R_OK)

    switch (path.extname(filename)) {
        default:
            throw new Error('Invalid file extension is received. Expect .json or .cson')
        case '.json':
            return fs.readJSONSync(filename)
        case '.cson':
            return cson.load(filename)
    }
}


/**
 * Source should be an absolute path
 * revised from https://stackoverflow.com/a/24594123/8579025
 */
export function isDir(source: string): boolean {
    return fs.lstatSync(source).isDirectory()
}

/**
 * Source should be an absolute path
 * revised from https://stackoverflow.com/a/24594123/8579025
 */
export function getDirs(source: string): string[] {
    return fs.readdirSync(source)
        .map(function(name) {
            return path.join(source, name)
        })
        .filter(isDir)
}

export function isFile(source: string): boolean {
    return fs.lstatSync(source).isFile()
}

export function getFiles(source: string): string[]{
  return fs.readdirSync(source)
      .map(function(name) {
          return path.join(source, name)
      })
      .filter(isFile)
}
