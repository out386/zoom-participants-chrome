function readCsv(event) {
    const reader = new FileReader();
    reader.onload = () => {
        const contents = reader.result;
        processData(contents);
    };
    reader.readAsText(event.target.files[0]);
}

function processData(input) {
    input = input.split("\r\n");
    let data = [];
    input.forEach((studentData, i) => {
        studentData = studentData.split(",");
        data[i - 1] = { name: studentData[1], roll: studentData[0] };
    });

    const node = document.getElementById('file-contents');
    node.innerText = data;
    chrome.storage.sync.set({ data: data });
}

let dataDiv = document.getElementById('data');
dataDiv.onchange = readCsv;