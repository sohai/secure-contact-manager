import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from "electron";
import type { MenuItemConstructorOptions } from "electron/main";
import { createReadStream, readFileSync } from "fs";
import { promisify } from "util";
const { pipeline } = require("stream");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === "production") {
    mainWindow.loadFile("./build/index.html");
  } else {
    mainWindow.loadURL("http://localhost:8080");
  }

  const template: MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [{ label: "asd", click: () => openFile() }],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  console.log(process.env.NODE_ENV);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("app:open-file", async (event, ...args) => {
  return openFile();
});

async function openFile() {
  // Opens file dialog
  const result = dialog.showOpenDialogSync(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "`JSON", extensions: ["json"] }],
  });
  // If no files
  if (!result) return;

  let content = "";
  const iterator = createReadStream(result[0]);
  for await (const chunk of iterator) {
    content += chunk;
  }
  return JSON.parse(content);
}
