let clientCurrentStatus = "";
let filesTotal = 0;
let filesNeeded = 0;

// Сколько объектов нам нужно отрисовать в прогресс-баре?
const barAmount = 200;

function ChangeHTMLStatus(string) {
    const DOMElement = document.querySelector(".loading-status");
    DOMElement.innerHTML = string;
    console.log(`New status "${string}" was successfully innered into the DOM element!`)
}

function GetDownloadProgress() {
    return (filesTotal - Math.max(filesNeeded, 0)) / Math.max(filesTotal, 1)
}

function GameDetails( servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language ) {
    document.querySelector(".server-name").innerHTML(servername)
}

function SetFilesTotal( total ) {
    filesTotal = total;
}

function DownloadingFile( fileName ) {
    ChangeHTMLStatus(`Downloading file ${fileName}`)
}

function SetStatusChanged( status ) {
    clientCurrentStatus = status;
    ChangeHTMLStatus(status)
}

function SetFilesNeeded( needed ) {
    filesNeeded = needed;

    const DOMLoading = document.querySelector(".loading-bar");
    const parentWidth = DOMLoading.clientWidth;
    const barWidth = parentWidth / barAmount;
    const drawAmount = Math.round(barAmount * GetDownloadProgress());

    let htmlString = "";
    DOMLoading.innerHTML = htmlString;
    for (let index = 0; index < drawAmount; index++) {
        htmlString = htmlString + `<div class="bar">
            <img src="images/whitebar.jpg" style="width: ${barWidth}px" alt="bar">
        </div>`
    }

    DOMLoading.innerHTML = htmlString;
}

GameDetails( "Project Azuki", "git.io/past", "rp_area14_v2", 64, 76561198012345678, "darkrp", 0.5, "ru" )