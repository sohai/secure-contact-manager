import * as path from "path";
import * as os from "os";
import { app, BrowserWindow, ipcMain, Menu } from "electron";
import type { IpcMainInvokeEvent } from "electron/main";
import { readdir, mkdir, access } from "fs";
import { promisify } from "util";
import type { Contact } from "../types/Contact";
import { encryptAndSave, readAndDecryptFile } from "./crypto";

const readdirAsync = promisify(readdir);
const mkdirAsync = promisify(mkdir);
const accessAsync = promisify(access);

// ideally user should be albe to select folder/file
const appDir = path.resolve(os.homedir(), ".secure-contact-manager");
const FILE_NAME = "contacts.json";

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

async function createFile(event: IpcMainInvokeEvent, password: string) {
  await encryptAndSave(
    path.join(appDir, FILE_NAME),
    JSON.stringify([]),
    password
  );
  return []; //return file content
}

async function openFile(event: IpcMainInvokeEvent, password: string) {
  const files = await readdirAsync(appDir);
  return readAndDecryptFile(path.join(appDir, files[0]), password);
}

async function saveFile(
  event: IpcMainInvokeEvent,
  data: Contact[],
  password: string
) {
  await encryptAndSave(
    path.join(appDir, "contacts.json"),
    JSON.stringify(data),
    password
  );
}
