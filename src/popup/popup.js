chrome.tabs.executeScript({ file: './src/inject.js' });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (sender.tab && request.names) {
        sendResponse({ resp: "recieved" });
        showRolls(request.names.split(","))
    } else {
        sendResponse({});
    }
});

setupCopy();

function showRolls(names) {
    const generalDiv = document.getElementById('general');
    const foundDiv = document.getElementById('data-found');
    const missingDiv = document.getElementById('data-missing');
    let matches = [];
    let unmatched = [];
    data = data.map(e => {
        e.name = e.name.toLowerCase();
        return e;
    })

    names.forEach(name => {
        let info = getName(name);
        let match = data.find(element => element.name === info.name.toLowerCase());
        if (match)
            matches.push({ roll: match.roll, name: info.name });
        else
            unmatched.push(name);
    });

    generalDiv.innerText = `${names.length} names, ${matches.length} found`
    foundDiv.innerText = `${matches.reduce((acc, n, i) => i > 0 ? `${acc}, ${n.roll}` : n.roll, '')}`;
    missingDiv.innerText = `${unmatched.reduce((acc, n, i) => i > 0 ? `${acc}, ${n}` : n, '')}`;
}

/**
 * Returns an object representating the passed name. The name might or might not have a 
 * roll number, either at the beginning or at the end. If present, the roll number is
 * separated from the name with one of the dilimeters: "-_() ". Assumes that there is 
 * only one sequence of numbers, and that is the roll number.
 * Example names: "123-Name Abc", "Name Abc (5001)"
 */
function getName(item) {
    let data = { orig: item };
    let match = item.match(/\d+/);
    let rollRemoveRegex = /_|-|\(|\)/g;

    if (match) {
        // A roll number is present
        data.roll = parseInt(match[0])
        if (match.index > 0) {
            // The roll is at the end of the name
            data.name = item.substring(0, match.index);
        } else {
            // The roll is at the beginning of the name
            data.name = item.substring(match[0].length);
        }
        data.name = data.name.replace(rollRemoveRegex, '').trim()
    } else {
        data.name = item
    }
    return data
}

function setupCopy() {
    const copyButton = document.getElementById('copy-found');
    const tooltip = document.getElementById('copy-tooltip');

    copyButton.onclick = () => {
        const foundDiv = document.getElementById('data-found');

        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNode(foundDiv);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeRange(range);
        tooltip.innerText = "Copied!"
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
    }
    setupTooltip(copyButton, tooltip);
}

function setupTooltip(copyButton, tooltip) {
    let tooltipTimer;

    copyButton.onmouseenter = () => {
        tooltipTimer = setInterval(() => {
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
        }, 500);
    }

    copyButton.onmouseleave = () => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
        tooltip.innerText = "Copy to clipboard"
        clearInterval(tooltipTimer);
    }
}