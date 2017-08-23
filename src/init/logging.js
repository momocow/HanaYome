const log4js = require("log4js")
const path = require("path")

const conf = {
  appenders:[
    {
      category: ['hanayome'],
      type: 'dateFile',
      filename: path.join(USERDATA_PATH, "logs", "hanayome.log"),
      layout:{
        type: "pattern",
        pattern: "[%d{ISO8601_WITH_TZ_OFFSET}] [%c] [%5.5p] %m"
      }
    },
    {
      category: ['game'],
      type: 'dateFile',
      filename: path.join(USERDATA_PATH, "logs", "game.log"),
      layout:{
        type: "pattern",
        pattern: "[%d{ISO8601_WITH_TZ_OFFSET}] [%c] [%5.5p] %m"
      }
    },
    {
      category: ['hanayome', 'game'],
      type: 'console',
      layout:{
        type: "pattern",
        pattern: "[%d{ISO8601_WITH_TZ_OFFSET}] [%c] [%5.5p] %m"
      }
    }
  ],
  levels:{
    "[all]": "all",
    hanayome: "error",
    game: "info"
  }
}

log4js.configure(conf)
