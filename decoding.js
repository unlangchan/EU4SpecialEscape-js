const readline = require('readline');
const fs = require('fs');
const path = require('path');
const SE = require('./special-escape');

const _config = require('./decoding.config.json');

let source = path.resolve(_config.source);
let target = path.resolve(_config.target);

let findfiles = new Promise((resolve, reject) => {
    fs.readdir(source, (err, files) => {
        if (err) {
            reject(err);
        } else {
            resolve(files);
        }
    });
});

findfiles.then(files => {
    // 创建目标目录
    SE.mkdir(target);
    files.forEach(filename => {
        let fileStream = fs.createReadStream(`${source}/${filename}`);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        let TEXT_MAP = {};

        rl.on('line', (line) => {
            format(line, TEXT_MAP);
        });

        let StartWork = new Promise((resolve, reject) => {
            fileStream.on('close', () => resolve());
        });

        StartWork.then(() => {
            let new_fileStream = fs.createWriteStream(`${target}/${filename}`, {
                flags: 'w+'
            });;
            new_fileStream.write(`\ufeffl_english:\n`);
            Object.keys(TEXT_MAP).forEach(key => {
                new_fileStream.write(`${key}${TEXT_MAP[key]}\n`);
            });
        });
    });
});

function format(line, obj) {
    if (line.indexOf('\ufeffl_english:') === 0) {
        return;
    }
    let index = line.indexOf(':');
    let key = line.slice(0, index + 2);
    let str = line.slice(index + 2);
    let value = SE.decoding(str);

    obj[key] = value;
}
