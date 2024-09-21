const fs = require('fs');
const path = require('path');

const MIN_RUN = 32;

function SortIntLines(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i += MIN_RUN) {
        insertionSort(arr, i, Math.min(i + MIN_RUN - 1, n - 1));
    }

    let size = MIN_RUN;
    while (size < n) {
        for (let left = 0; left < n; left += 2 * size) {
            const mid = Math.min(n - 1, left + size - 1);
            const right = Math.min(left + 2 * size - 1, n - 1);

            if (mid < right) {
                merge(arr, left, mid, right);
            }
        }
        size *= 2;
    }
}

function insertionSort(arr, left, right) {
    for (let i = left + 1; i <= right; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

function merge(arr, left, mid, right) {
    const len1 = mid - left + 1;
    const len2 = right - mid;
    const leftArr = new Array(len1);
    const rightArr = new Array(len2);

    for (let i = 0; i < len1; i++) leftArr[i] = arr[left + i];
    for (let i = 0; i < len2; i++) rightArr[i] = arr[mid + 1 + i];

    let i = 0, j = 0, k = left;
    while (i < len1 && j < len2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        k++;
    }

    while (i < len1) {
        arr[k] = leftArr[i];
        i++;
        k++;
    }

    while (j < len2) {
        arr[k] = rightArr[j];
        j++;
        k++;
    }
}

function stripString(s, chars = ' \t\n\r\v\f') {
    let start = 0;
    let end = s.length - 1;

    while (start <= end && chars.includes(s[start])) {
        start++;
    }

    while (end >= start && chars.includes(s[end])) {
        end--;
    }

    return s.slice(start, end + 1);
}

class UniqueInt {
    static processFile(fileLines) {
        const outputList = [];
        for (let line of fileLines) {
            const rawLine = stripString(line);

            try {
                const processedLine = parseInt(rawLine, 10);
                if (!outputList.includes(processedLine)) {
                    outputList.push(processedLine);
                }
            } catch (e) {
                continue;
            }
        }
        return outputList;
    }

    static ReadAndWriteToFile(inputFileName) {
        let processedData = [];

        try {
            const rawData = fs.readFileSync(inputFileName, 'utf8').split('\n');
            processedData = UniqueInt.processFile(rawData);
            SortIntLines(processedData);
        } catch (err) {
            console.error(`No such file or directory: ${inputFileName}`);
            return;
        }

        const outputFileName = path.resolve('./drc/hw', path.basename(inputFileName) + '_results.txt');

        fs.writeFileSync(outputFileName, processedData.join('\n'));
    }
}

if (process.argv.length < 3) {
    console.log("No file name provided");
    console.log("Usage: node UniqueInt.js <filename>");
} else {
    const startTime = Date.now();
    const fileName = process.argv[2];
    stripString(fileName);
    UniqueInt.ReadAndWriteToFile(fileName);
    const endTime = Date.now();

    console.log(`Elapsed time: ${(endTime - startTime) / 1000} seconds`);
}