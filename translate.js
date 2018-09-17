const readline = require('readline');
const fs = require('fs');
const path = require('path');
const SE = require('./special-escape');

const _config = require('./translate.config.json');
let path_en = path.resolve(_config.source_en);
let path_zh = path.resolve(_config.source_zh);
let target = path.resolve(_config.target);
let isDecoding = _config.decoding;

let findfiles = new Promise((resolve, reject) => {
    fs.readdir(path_zh, (err, files) => {
        if (err) {
            reject(err);
        } else {
            Promise.all(files.map(filename => {
                return new Promise((resolve, reject) => {
                    fs.stat(`${path_en}/${filename}`, (err, stat) => {
                        if (stat && stat.isFile()) {
                            resolve(filename)
                        } else {
                            resolve(false);
                        }
                    });
                });
            })).then(files => files.filter(filename => filename !== false))
                .then(files => resolve(files));
        }
    });
});
findfiles.then(files => {
    // 创建目标目录
    SE.mkdir(target);
    files.forEach(filename => {
        let fileStream1 = fs.createReadStream(`${path_en}/${filename}`);
        let fileStream2 = fs.createReadStream(`${path_zh}/${filename}`);

        const rl1 = readline.createInterface({
            input: fileStream1,
            crlfDelay: Infinity
        });

        const rl2 = readline.createInterface({
            input: fileStream2,
            crlfDelay: Infinity
        });
        let TEXT_MAP_EN = {};
        let TEXT_MAP_ZH = {};

        rl1.on('line', (line) => {
            format(line, TEXT_MAP_EN);
        });
        rl2.on('line', (line) => {
            format(line, TEXT_MAP_ZH);
        });

        let promse1 = new Promise((resolve, reject) => {
            fileStream1.on('close', () => resolve());
        });

        let promse2 = new Promise((resolve, reject) => {
            fileStream2.on('close', () => resolve());
        });

        let StartWork = Promise.all([promse1, promse2]);

        StartWork.then(() => {
            Object.keys(TEXT_MAP_ZH).forEach(key => {
                TEXT_MAP_EN[key] = TEXT_MAP_ZH[key];
            });
            let new_fileStream = fs.createWriteStream(`${target}/${filename}`, {
                flags: 'w+'
            });;
            new_fileStream.write(`\ufeffl_english:\n`);
            Object.keys(TEXT_MAP_EN).forEach(key => {
                new_fileStream.write(`${key}${TEXT_MAP_EN[key]}\n`);
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
    let value;
    if (isDecoding) {
        value = SE.encoding(str);
    } else {
        value = str;
    }
    obj[key] = value;
}
