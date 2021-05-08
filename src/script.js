function handleWindowControls() {
    document.getElementById("min-button").addEventListener("click", (event) => {
        win.minimize()
    })

    document.getElementById("close-button").addEventListener("click", async (event) => {
        win.close()
    })

    document.getElementById("max-button").addEventListener("click", async (event) => {
        win.maximize()
    })

    document.getElementById("restore-button").addEventListener("click", (event) => {
        win.unmaximize()
    })

    toggleMaxRestoreButtons()
    win.on("maximize", toggleMaxRestoreButtons)
    win.on("unmaximize", toggleMaxRestoreButtons)

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add("maximized")
        } else {
            document.body.classList.remove("maximized")
        }
    }
}

const remote = require("electron").remote
const win = remote.getCurrentWindow()

document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls()
    }
}

const isPackaged = require("electron-is-packaged").isPackaged

if (!isPackaged) {
    document.addEventListener("keydown", function (e) {
        if (e.which === 123) {
            remote.getCurrentWindow().toggleDevTools()
        } else if (e.which === 116) {
            location.reload()
        }
    })
}
