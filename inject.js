function sendParticipants() {
    let x;
    document.querySelectorAll(".participants-item__display-name")
        .forEach(e => x = (x ? `${x},${e.innerText}` : e.innerText));
    chrome.runtime.sendMessage({ names: x });
}

sendParticipants();