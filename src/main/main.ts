import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from "electron";
import type { MenuItemConstructorOptions } from "electron/main";
import { createReadStream, readdir, mkdir, access, writeFile } from "fs";
import { promisify } from "util";
import { Contact } from "../types/Contact";

// require because of wierd typescript issue
const path = require("path");
const os = require("os");

const readdirAsync = promisify(readdir);
const mkdirAsync = promisify(mkdir);
const accessAsync = promisify(access);
const writeFileAsync = promisify(writeFile);

// ideally user should be albe to select folder/file
const appDir = path.resolve(os.homedir(), ".secure-contact-manager");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
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

  if (process.env.NODE_ENV !== "production") {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
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
  // example how we can you stream/async iterators to deal with files if we meet ant performance issue
  const iterator = createReadStream(path.join(appDir, files[0]));
  for await (const chunk of iterator) {
    content += chunk;
  }
  return JSON.parse(content);
}

async function saveFile(_, data: Contact[]) {
  await writeFileAsync(
    path.join(appDir, "contacts.json"),
    JSON.stringify(data)
  );
}
