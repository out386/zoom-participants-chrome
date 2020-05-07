function readCsv(event) {
    const reader = new FileReader();
    reader.onload = () => {
        const contents = reader.result;
        processData(contents);
    };
    reader.readAsText(event.target.files[0]);
}

function processData(input) {
    input = input.split("\n");
    let data = [];
    input.forEach((studentData, i) => {
        studentData = studentData.split(",");
        data[i -1] = { name: studentData[1].trim(), roll: studentData[0].trim() };
    });

    showTable(data);
    chrome.storage.sync.set({ data: data });
}

function showTable(data) {
    const tableHolder = document.getElementById('table-holder');
    let table = createTable();
    let halfway = Math.floor(data.length / 2);
    if (halfway % 2 != 0)
        halfway++;

    for (let i = 0; i < halfway; i++) {
        const tr = document.createElement('tr');
        fillTableRow(tr, data[i]);
        fillTableRow(tr, data[halfway + i]);
        table.appendChild(tr);
    }
    tableHolder.innerHTML = '';
    tableHolder.appendChild(table);
}

function createTable() {
    const table = document.createElement('table');

    for (let i = 0; i < 2; i++) {
        const nH = document.createElement('th');
        nH.innerText = 'Name';
        const rH = document.createElement('th');
        rH.innerText = 'Roll';
        table.appendChild(nH);
        table.appendChild(rH);
    }
    return table;
}

function fillTableRow(tableRow, element) {
    const name = document.createElement('td');
    if (element) {
        name.innerText = element.name;
        tableRow.appendChild(name);
        const roll = document.createElement('td');
        roll.innerText = element.roll;
        tableRow.appendChild(roll);
    }
}

chrome.storage.sync.get(['data'], res => {
    if (res && res.data)
        showTable(res.data);
});


let dataDiv = document.getElementById('data');
dataDiv.onchange = readCsv;