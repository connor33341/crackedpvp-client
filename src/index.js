const mineflayer = require("mineflayer");
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { WorldView, Viewer } = require('prismarine-viewer/viewer')
global.THREE = require('three')


const Bots = []

class BotClass {
    constructor(Username) {
        this.Bot = mineflayer.createBot({
            host: "pvp.mc.connor33341.dev",
            username: Username,
            auth: "offline",
            port: "25555",
            version: "1.16.5" // Use a version mineflayer supports best
        })
        this.ViewDistance = 12
        Bots.push(this.Bot);
        console.log("Class Constructed")
    };
    Viewer() {
        console.log("Creating Viewer")
        this.Bot.once('spawn', () => {
            mineflayerViewer(this.Bot, { port: 3000 }) // Start the viewing server on port 3000

            // Draw the path followed by the bot
            const path = [this.Bot.entity.position.clone()]
            this.Bot.on('move', () => {
                if (path[path.length - 1].distanceTo(this.Bot.entity.position) > 1) {
                    path.push(this.Bot.entity.position.clone())
                    this.Bot.viewer.drawLine('path', path)
                }
            })
        })
    },
    WorldView(){
        this.center = this.Bot.entity.position
        this.view = new WorldView(this.Bot.world,this.ViewDistance,this.center)
        this.render = new THREE.WebGLRenderer()
        this.render.setPixelRation(window.dev)
    }
}

function Main() {
    // For testing
    console.log("Creating Class")
    let Bot = new BotClass("testusr")
    Bot.Viewer()
}

console.log("Init")
Main()
console.log("Finished")
