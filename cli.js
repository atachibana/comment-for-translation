#!/usr/bin/env node

'use strict'

const packageJson = require('./package.json')
const fs = require('fs')
const readline = require('readline')
const { program } = require('commander')

const writeToStream = (buffer, oStream, addComment) => {
    if (buffer.length) {
        if (addComment) {
            oStream.write('<!--\n')
            buffer.forEach((oneline) => {
                oStream.write(oneline + '\n')
            })
            // oStream.write('-->\n')
        }
        buffer.forEach((oneline) => {
            let rep1 = oneline
            // Rule: /docs/.../dir1/README.md -> https://ja.wordpress.org/.../dir1/
            rep1 = rep1.replace(
                /\]\(\/docs\/(.*)README\.md/g,
                '](https://ja.wordpress.org/team/handbook/block-editor/$1'
            )
            // Rule: /docs/.../dir1/contents1.md -> https://ja.wordpress.org/.../dir1/contents1
            rep1 = rep1.replace(
                /\]\(\/docs\/(.*)\.md/g,
                '](https://ja.wordpress.org/team/handbook/block-editor/$1'
            )
            // replaced = replaced.replace(
            oStream.write(rep1 + '\n')
        })
    }
}

const generateComment = async (mdFile, outputDir) => {
    const rs = fs.createReadStream(mdFile)
    var ws = ''
    if (mdFile.startsWith('/')) {
        // mdFile was speccified with absolute path.
        // In case of that, outputDir is ignored.
        ws = fs.createWriteStream(mdFile.replace(/(.*)\.md/, '$1-new.md'))
    } else {
        outputDir = outputDir ? outputDir.replace(/\/$/, '') + '/' : './'
        if (fs.existsSync(outputDir)) {
            // console.log('Output directory %s already exists', outputDir);
        } else {
            fs.mkdir(outputDir, { recursive: true }, (err) => {
                if (err) {
                    console.error(
                        'Could not create output directory. Make sure you have right permission on the directory and try again.'
                    )
                    throw err
                }
                console.log('Created output directory %s', outputDir)
            })
        }
        ws = fs.createWriteStream(
            outputDir + mdFile.replace(/(.*)\.md/, '$1-new.md')
        )
    }

    //
    // const ws = fs.createWriteStream(outputDir + mdFile + '.new')
    // const ws = fs.createWriteStream(outputDir + mdFile.replace(/(.*)\.md/, '$1-new.md'))

    const rl = readline.createInterface({
        input: rs,
        output: ws,
    })

    var buffer = []
    var inCode = false

    rl.on('line', (lineString) => {
        if (inCode) {
            buffer.push(lineString)
            if (lineString.startsWith('```')) {
                writeToStream(buffer, ws, false)
                buffer = []
                inCode = false
            }
        } else {
            if (lineString.startsWith('```')) {
                buffer.push(lineString)
                inCode = true
            } else if (lineString === '') {
                writeToStream(buffer, ws, true)
                buffer = []
                ws.write('\n')
            } else {
                buffer.push(lineString)
            }
        }
    })
    rl.on('close', () => {
        writeToStream(buffer, ws, true)
        buffer = []
    })
}

program
    .version(packageJson.version)
    .arguments('<mdFile>')
    .description(packageJson.description)
    .option(
        '-o --output-dir <outputDir>',
        'Specify directory to save files (default ./ (current directory))'
    )
    .action((mdFile, options) => {
        generateComment(mdFile, options.outputDir)
    })

program.parse(process.argv)
