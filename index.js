const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let words = [];

const printLine = () => {
    const arr = new Array(150).fill("-");
    console.log(arr.join(""));
};

console.log("Лабораторная работа № 4\nВыполнил: Фомин Д.A 090301-ПОВа-o23 ");
printLine();

async function processFile(filePath) {
    const startTime = Date.now();
    const fileStream = fs.createReadStream(filePath);
    const fileReadLine = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of fileReadLine) {
        const word = line.toLowerCase().trim();
        if (word.match(/^[а-яё]+$/)) {
            words.push(word);
        }
    }
    const endTime = Date.now();
    console.log(`Прочитано ${words.length} слов за ${endTime - startTime} мс`);
}

function findOptions(target) {
    const targetFreq = toFreq(target);
    const validWords = words.filter((word) => {
        const wordFreq = toFreq(word);
        return matches(targetFreq, wordFreq);
    });

    if (!validWords.length) {
        console.log(
            `Из "${target}" невозможно составить слова, которые есть в словаре`
        );
    } else {
        validWords.sort((a, b) => b.length - a.length);
        validWords.forEach((word) => {
            console.log(word);
        });
    }
}

const matches = (freq, freqIn) => {
    for (let i = 0; i < 33; i++) {
        if ((freq[i] === 0 && freqIn[i] > 0) || freq[i] < freqIn[i]) {
            return false;
        }
    }
    return true;
};

const toFreq = (str) => {
    const freq = new Array(33).fill(0);
    for (const char of str) {
        const index =
            char === "ё" ? 32 : char.charCodeAt(0) - "а".charCodeAt(0);
        if (index >= 0 && index < 33) {
            freq[index]++;
        }
    }
    return freq;
};

const mainMenu = () => {
    printLine();
    rl.question('Введите слово или "0" для завершения: ', (answer) => {
        if (answer === "0") {
            console.log("Выход из программы");
            printLine();
            rl.close();
        } else {
            findOptions(answer);
            mainMenu();
        }
    });
};

processFile("nouns.txt").then(mainMenu);
