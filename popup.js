// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let changeColor = document.getElementById('changeColor');

chrome.tabs.executeScript({ file: 'inject.js' });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (sender.tab && request.names) {
    sendResponse({ resp: "recieved" });
    showRolls(request.names.split(","))
  } else {
    sendResponse({});
  }
});

function showRolls(names) {
  const generalDiv = document.getElementById('general');
  const foundDiv = document.getElementById('data-found');
  const missingDiv = document.getElementById('data-missing');
  let matches = []
  let unmatched = []

  names.forEach(name => {
    let info = getName(name)
    let match = data.find(element => element.name.toLowerCase() === info.name.toLowerCase())
    if (match)
      matches.push({ roll: match.roll, info: info })
    else
      unmatched.push({ name: name, info: info })
  });

  generalDiv.innerText = `${names.length} names, ${matches.length} found`
  foundDiv.innerText = `${matches.reduce((acc, n, i) => i > 0 ? `${acc}, ${n.roll}` : n.roll, '')}`
  missingDiv.innerText = `${unmatched.reduce((acc, n, i) => i > 0 ? `${acc}, ${n.name}` : n.name, '')}`
}

// Assumes that there is only one sequence of numbers, and only at the beginning or ending
function getName(item) {
  let data = { orig: item }
  let match = item.match(/\d+/)
  if (match) {
    data.roll = parseInt(match[0])
    if (match.index > 0) {
      data.name = item.substring(0, match.index).replace(/_|-|\(|\)/g, '').trim()
    } else {
      data.name = item.substring(match[0].length).replace(/_|-|\(|\)/g, '').trim()
    }
  } else {
    data.name = item
  }
  return data
}