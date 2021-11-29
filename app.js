const { app, BrowserWindow, Menu, globalShortcut } = require("electron");

const isMacos = process.platform === "darwin" ? true : false;
let mainWindow;
process.env.NODE_ENV = "development";
const isDevelopment = process.env.NODE_ENV === "development" ? true : false;
let aboutWindow;

const createAboutWindow = () => {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    resizable: true,
    title: "About",
  });
  aboutWindow.loadFile("./app/about.html");
};

const openMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    title: "Boilerplate",
    resizable: false,
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
};

app.on("ready", () => {
  openMainWindow();
  const appMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(appMenu);
  //register global shortcuts
  globalShortcut.register(isMacos ? "Command+R" : "Ctrl+R", () =>
    mainWindow.reload()
  );
});

//array of objects
const menu = [
  {
    label: "App",
    submenu: [
      {
        label: "Force Quit",
        accelerator: isMacos ? "Command+Q" : "Ctrl+Q", //"CmdOrCtrl+Q"
        click: () => app.quit(),
      },
    ],
  },
  {
    label: app.name,
    submenu: [
      {
        label: "About",
        click: () => createAboutWindow(),
      },
    ],
  },
];

if (isMacos) {
  menu.unshift({ role: "appMenu" });
}

//Quit the app when all windows are closed (Windows & Linux)​
//listen for the app module's 'window-all-closed' event, and
//call app.quit() if the user is not on macOS (darwin).
//on macOS user should use command + Q
app.on("window-all-closed", () => {
  if (!isMacos) {
    app.quit();
  }
});

//Open a window if none are open (macOS)​
app.whenReady().then(() => {
  openMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) openMainWindow();
  });
});
