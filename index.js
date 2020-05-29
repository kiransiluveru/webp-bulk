#!/usr/bin/env node

const yargs = require('yargs');
const converter = require('webp-converter');
const fs = require('fs');
const path = require('path');
const find = require('find');

const log = console.log;

const extension_types = {
    PNG: '\\.png',
    JPEG: '\\.jpeg',
    JPG: '\\.jpg',
    GIF: "\\.gif"
}

const onConvertImage = async ({ input_file_path, output_file_name }) => {
    return new Promise((resolve, reject) => {
        converter.cwebp(input_file_path, `${output_file_name}.webp`, '-q 80', async (status, error) => {
            // log('Status ', status);
            if (status == 100) {
                resolve("Successful conversion : ", input_file_path);
                return;
            }
            log("Error while converting this file ", input_file_path, error);
            reject(error);
        })
    }
    ).catch(err => log("Error while conversion", err));
}

const processDirectory = ({ extensions = [], inputFolder, isOutputSeparate = false }) => {
    // log('extensions', extensions);
    if (!extensions.length) {
        log("Please provide image extensions to convert");
        return;
    }
    const ext_types = extensions.join('|');
    // log('ext_types', ext_types);
    const regEx = new RegExp(ext_types, 'i');
    // log('text  ', regEx);
    find.file(regEx, inputFolder, async (files) => {
        log('Total files found ', files.length);
        for (let i = 0, len = files.length; i < len; i++) {
            let input_file_path = files[i];
            log('Currently Processing : index', i, input_file_path);
            const file_name = path.parse(input_file_path).name;
            let dir_of_file = path.parse(input_file_path).dir;
            if (isOutputSeparate) {
                dir_of_file = path.resolve(inputFolder, 'Output');
                // log('Output dir of file', dir_of_file);
                if (!fs.existsSync(dir_of_file)) {
                    log('Output directory does not exists');
                    fs.mkdirSync(dir_of_file);
                    log('Created Output directory for you...');
                }
            }
            const output_file_name = path.resolve(dir_of_file, file_name);
            await onConvertImage({ input_file_path, output_file_name })
        }
    });
}

const toUpper = function (x) {
    return x.toUpperCase();
};

const convertImages = ({ e: exts, o }) => {
    let extensions = [];
    const upperCasedExtensions = exts.map(toUpper);

    for (let i = 0; i < upperCasedExtensions.length; i++) {
        extensions[i] = extension_types[upperCasedExtensions[i]];
    }
    extensions = extensions.filter(Boolean);
    log("Current Dir", process.cwd());
    log(" resolved path", path.resolve(process.cwd()));
    // return
    const Folder = path.resolve(process.cwd());
    processDirectory({
        extensions,
        inputFolder: Folder,
        isOutputSeparate: o
    });
}

try {
    yargs.command('convert', " To convert images to webp format", () => {
        return yargs.options;
    },
        ({ e, o }) => {
            if (!e.length) {
                log('Please provide at least one extension type...');
                return;
            }
            convertImages({ e, o });
        }
    )
        .usage('\n From CLI Usage like this         : webp-bulk convert -e [image_extensions] -o')
        .usage('\n To Run as a script Use like this : node index.js convert -e [image extensions] -o')
        .alias('e', 'extensions')
        .alias('o', 'outputSeparate')
        .option('e', {
            type: 'array',
            desc: 'Provide one or more image extension types with space separated values'
        })
        .option('o', {
            type: 'boolean',
            desc: `Provide this value if output of all converted images to single folder
        default outputs converted image to image path`,
            default: false
        })
        .demandOption(['e'])
        .argv
} catch (error) {
    log('\n Error While Converting: Please create an issue in git if error is originating from code... Thanks :)\n');
}
