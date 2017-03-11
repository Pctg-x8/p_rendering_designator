// Electron EntryPoint

const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");

const index_url = url.format({
	pathname: path.join(__dirname, "view", "index.html"),
	protocol: "file:",
	hash: "/EntryRedirect",
	slashes: true
});

function GlobalContext() {
	this.win = null;
	this.createWindow = function() {
		this.win = new BrowserWindow({ width: 640, height: 480 });
		this.win.setMenu(null);
		console.log("Loading " + index_url);
		this.win.loadURL(index_url);
		// this.win.webContents.openDevTools();
		this.win.on("closed", function() { this.win = null; });
	}
	this.activate = function() { if(this.win === null) this.createWindow(); }
}
let global = new GlobalContext();

app.on("ready", global.createWindow);
app.on("window-all-closed", function() {
	if(process.platform !== "darwin") app.quit();
});
app.on("activate", global.activate);
