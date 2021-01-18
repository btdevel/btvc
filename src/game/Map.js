import { setGameText } from "./GameLogic"
import { execCommand } from "./KeyMap"
import { mod } from '../util/math'
import { startConference, stopConference } from './Video'

export const create2dArray = (rows, columns, defaultVal) =>
    [...Array(rows).keys()].map(() => Array(columns).fill(defaultVal))

export default class Map {
    rows
    columns
    name
    loaded
    name
    level
    map
    startX
    startY

    showInfo(time_hours, pos, dir) {
        const time = mod(time_hours, 24)
        dir = mod(dir, 4)

        function pad(num, size) { return ('00' + num).substr(-size); }
        const hours = pad(Math.floor(time), 2)
        const minutes = pad(Math.floor((time - hours) * 60), 2)
        const directions = ['north', 'west', 'south', 'east'];
        const timeOfDay = ['after midnite', 'early morning', 'mid morning',
            'noon', 'afternoon', 'dusk', 'evening', 'midnite']
        const timeStr = timeOfDay[Math.floor(mod(time - 1.5, 24) / 3)]

        // https://bardstale.brotherhood.de/talefiles/forum/viewtopic.php?t=1604
        // "present time of day: after midnite 0 - 3, midnite 4 - 7, evening 8 - b, dusk c - f, afternoon 10 - 13, noon 14 - 17, mid morning 18 - 1b, early morning 1c - 1f"  Seems to be set to 1f; i.e. early morning


        let locationText = this.getLocationInfo()
        const gameText = `${locationText} facing ${directions[dir]}.

        It's now ${timeStr}.

        [T: ${hours}:${minutes} L: ${this.level} X: ${pos.x} Y: ${pos.y}]`
        setGameText(gameText)
    }

    enter(pos, how = "move") {
        const { x, y } = pos

        // if !video field leave channel
        const videoConf = this.map[x][y].videoConf
        if (videoConf) {
            startConference()
        }

        if (how !== "stairs") {
            // check whether we are on stairs and ask
            // if we take them exit before taking any other actions
            // same with portals
        }

        // if video field join channel
        // maybe the video stuff should go into configurable pre/post actions...
        if (!videoConf) {
            stopConference()
        }

        const actions = this.map[x][y].actions
        if (actions) {
            for (let action of actions) {
                execCommand(action)
            }
        }
    }
}