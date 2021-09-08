function prompt(question, callback) {
    var stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function(data) {
        callback(data.toString().trim());
    });
}
process.chdir(__dirname)
const fs = require('fs')
const filePath = '../changelog.json'
const data = JSON.parse(fs.readFileSync(filePath, "utf8"))
prompt("Enter the title of the change: ", function(inputData) {
    const title = inputData
    prompt("Enter the description of the change: ", function(inputData2) {
        data[data.length] = { title: title, date: Date.now(), description: inputData2 }
        fs.writeFile(filePath, JSON.stringify(data, null, 4), function(err) {
            process.exit()
        })

    })
})