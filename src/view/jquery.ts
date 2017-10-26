import * as path from 'path'

export const $: (selector: string | object) => any =
  require(
    path.join(
      __dirname, '..', '..', 'assets',
      'vendor', 'flat-ui', 'js', 'vendor', 'jquery.min.js'
    )
  )
