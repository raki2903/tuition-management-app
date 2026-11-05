const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

function startBackend() {
    let backendPath;

    if (app.isPackaged) {
        // Installed application
        backendPath = path.join(
            process.resourcesPath,
            "backend",
            "tuition-backend.exe"
        );
    } else {
        // Development
        backendPath = path.join(
            __dirname,
            "..",
            "backend",
            "dist",
            "tuition-backend.exe"
        );
    }

    console.log("Starting backend:", backendPath);

    backendProcess = spawn(backendPath, [], {
        windowsHide: true,
        detached: false
    });

    backendProcess.on("error", (error) => {
        console.error("Backend failed to start:", error);
    });

    backendProcess.on("exit", (code) => {
        console.log("Backend stopped with code:", code);
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile(
        path.join(__dirname, "dist", "index.html")
    );
}

app.whenReady().then(() => {
    startBackend();

    setTimeout(() => {
        createWindow();
    }, 2000);
});

app.on("window-all-closed", () => {
    if (backendProcess) {
        backendProcess.kill();
        backendProcess = null;
    }

    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("before-quit", () => {
    if (backendProcess) {
        backendProcess.kill();
        backendProcess = null;
    }
});