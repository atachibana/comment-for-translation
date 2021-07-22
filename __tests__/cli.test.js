const fs = require('fs')
const { execSync } = require('child_process')

test('Compare result file with expected one.', () => {
    execSync('node cli.js __tests__/test1.md')
    expect(fs.readFileSync('__tests__/test1-new.md')).toEqual(fs.readFileSync('__tests__/test1-expected.md'))
})
