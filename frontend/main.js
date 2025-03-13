const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;
let username;

const createLoginWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.setResizable(false);
    mainWindow.loadFile("index.html");
}

const createChatWindow = () => {
    mainWindow.loadFile("chat.html");
};

app.whenReady().then(() => {
    createLoginWindow();
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

ipcMain.on("set-username", (event, usernameValue) => {
    username = usernameValue;
    console.log("Username set:", username);

    createChatWindow();
});

ipcMain.handle("get-username", () => {
    return username;
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});