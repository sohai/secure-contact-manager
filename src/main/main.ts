import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from "electron";
import type { MenuItemConstructorOptions } from "electron/main";
import {
  createReadStream,
  readdir,
  mkdir,
  access,
  writeFile,
  writeFileSync,
} from "fs";
import { promisify } from "util";
import { Contact } from "../types/Contact";

const path = require("path");
const os = require("os");

const readdirAsync = promisify(readdir);
const mkdirAsync = promisify(mkdir);
const accessAsync = promisify(access);
const writeFileAsync = promisify(writeFile);

const appDir = path.resolve(os.homedir(), ".secure-contact-manager");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 860,
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

ipcMain.handle("app:open-file", openFile);
ipcMain.handle("app:check-file", checkFile);
ipcMain.handle("app:create-file", createFile);
ipcMain.handle("app:save-file", saveFile);

async function checkFile() {
  try {
    await accessAsync(appDir);
    const files = await readdirAsync(appDir);

    return files.length > 0;
  } catch {
    await mkdirAsync(appDir);
    return false;
  }
}

async function createFile() {
  await writeFileAsync(path.join(appDir, "contacts.json"), JSON.stringify([]));
  return []; //return file content
}

async function openFile() {
  const files = await readdirAsync(appDir);

  let content = "";
  const iterator = createReadStream(path.join(appDir, files[0]));
  for await (const chunk of iterator) {
    content += chunk;
  }
  return JSON.parse(content);
}

async function saveFile(event, data: Contact[]) {
  console.log(data)
  await writeFileAsync(
    path.join(appDir, "contacts.json"),
    JSON.stringify(data)
  );
}
