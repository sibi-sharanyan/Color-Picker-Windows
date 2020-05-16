const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const isDev = require("electron-is-dev");
const robot = require("robotjs");
const ioHook = require('iohook');
const path = require("path");
let mainWindow;
let interval = null;

function createWindow() {

    let display = electron.screen.getPrimaryDisplay();
let width = display.bounds.width;
let height = display.bounds.height;


  mainWindow = new BrowserWindow({
    width: 600,
    height: 210,
    x: width - 600,
    y: height - 240,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/preload.js",
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.removeMenu();
  mainWindow.setAlwaysOnTop(true);
//   mainWindow.webContents.openDevTools();
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    clearInterval(interval);

    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});



ipc.on("app-loaded", (event) => {

    
  interval = setInterval(() => {
    var mouse = robot.getMousePos();
    event.sender.send("progress-update", robot.getPixelColor(mouse.x, mouse.y));
  }, 100);



  ioHook.on('keypress', keyevent => {
    //   console.log(keyevent);
    if(keyevent.keychar === 99 && keyevent.ctrlKey === true) {
        // console.log("ctrl+c pressed");
        event.sender.send("copy-color");
    }
  });
  
  // Register and start hook
  ioHook.start();

});



ipc.on("app-close" , (event) => {
    clearInterval(interval);
})