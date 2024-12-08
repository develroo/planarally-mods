let randomTableData = [];
let randomizedData = [];

// Upload CSV
document.getElementById('uploadButton').addEventListener('click', () => {
  const input = document.getElementById('csvFileInput');
  if (input.files && input.files[0]) {
    const file = input.files[0];
    parseCSVFile(file);
  } else {
    alert('Please select a CSV file to upload.');
  }
});

function parseCSVFile(file) {
Papa.parse(file, {
  header: false,
  quoteChar: '"',
  skipEmptyLines: true,
  complete: function(results) {
    const parsedData = results.data;

    console.log('Parsed CSV Data:', parsedData); // Debugging log

    // Populate UI elements
    populateColumnOptions(parsedData);
    populateSortableList(parsedData);
  },
  error: function(error) {
    console.error('Error parsing file:', error);
  }
});
}

// Populate Column Options

function populateColumnOptions(data) {
  const dataColumnSelect = document.getElementById('dataColumn');
  const rollColumnSelect = document.getElementById('rollColumn');

  // Clear existing options
  dataColumnSelect.innerHTML = '';
  rollColumnSelect.innerHTML = '';

  // Display column options (assuming first row contains headers)
  const headers = Object.keys(data[0] || {});

  headers.forEach((header, index) => {
    const option = document.createElement('option');
    option.value = index; // Store column index for flexibility
    option.textContent = header;
    dataColumnSelect.appendChild(option);

    const rollOption = option.cloneNode(true);
    rollColumnSelect.appendChild(rollOption);
  });

  // Debugging log
  console.log('Column options populated:', headers);
}

function populateSortableList(data) {
  const list = document.getElementById('sortableList');
  list.innerHTML = '';

  // Create a sortable list from parsed data
  data.forEach((row, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `ID: ${row[0]}, Description: ${row[1]}`;
    listItem.dataset.index = index;
    list.appendChild(listItem);
  });

  new Sortable(list, {
    animation: 150,
    onEnd: function(evt) {
      console.log('List reordered:', evt);
    }
  });

  // Debugging log
  console.log('Sortable list populated:', data);
}


// Apply Parameters
document.getElementById('applyParameters').addEventListener('click', () => {
  const dataColumn = document.getElementById('dataColumn').value;
  const useAutoRange = document.getElementById('useAutoRange').checked;
  const manualRanges = document.getElementById('manualRanges').value;

  if (useAutoRange) {
    autoGenerateRollRanges(dataColumn);
  } else if (manualRanges.trim()) {
    applyManualRanges(manualRanges, dataColumn);
  } else {
    alert('Please select auto-range or provide manual ranges.');
  }
});

function autoGenerateRollRanges(dataColumn) {
  const data = randomTableData.map(row => row[dataColumn]);
  const totalRolls = data.length;
  const rangeStep = Math.ceil(20 / totalRolls);

  randomizedData = data.map((item, index) => {
    const startRoll = index * rangeStep + 1;
    const endRoll = Math.min((index + 1) * rangeStep, 20);
    return {
      range: `${startRoll}-${endRoll}`,
      event: item
    };
  });

  displayRangedData();
}

function applyManualRanges(manualRanges, dataColumn) {
  const lines = manualRanges.split('\n');
  randomizedData = lines.map(line => {
    const [range, event] = line.split(':').map(item => item.trim());
    return { range, event };
  });

  displayRangedData();
}

// Display Data with Ranges
function displayRangedData() {
  const outputDiv = document.getElementById('outputWithRanges');
  outputDiv.innerHTML = '<h3>Randomized Roll Ranges</h3>';
  randomizedData.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${item.range}: ${item.event}`;
    outputDiv.appendChild(div);
  });
}

// Generate Random Entry
document.getElementById('generateButton').addEventListener('click', () => {
  const roll = Math.floor(Math.random() * 20) + 1;
  const match = randomizedData.find(item => {
    const [start, end] = item.range.split('-').map(Number);
    return roll >= start && roll <= end;
  });

  if (match) {
    alert(`Roll: ${roll}, Event: ${match.event}`);
  } else {
    alert('No match found for this roll.');
  }
});
