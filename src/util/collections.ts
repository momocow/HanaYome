import * as traverse from 'traverse'
import * as _ from 'lodash'

// build a new object from the src object whose leaves has been filtered by iteratee
export function reduceLeaves(src: object, iteratee: (src: object, path: string) => boolean): object {
  let reduced: object = {}, leaves: { path: string, isLeaf: boolean }[] = []
  traverse(src).forEach(function() {
    leaves.push({ path: this.path.join('.'), isLeaf: this.isLeaf })
  })

  for (let leaf of leaves) {
    let tmpValue = _.get(src, leaf.path, undefined)
    if (leaf.isLeaf && iteratee(src, leaf.path)) {
      _.set(reduced, leaf.path, tmpValue)
    }
  }
  return reduced
}

export function getAllPaths(obj: any): string[][] {
  return <string[][]>(<any>traverse(obj).paths()).filter(function(value) {
    return value.length > 0
  })
}
