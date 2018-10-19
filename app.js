const fs = require('fs');
const path = require('path');
const stream = require('stream');

// checking for the third argument

if(process.argv[2] == undefined) {
  console.error("File name isn't specified");
  process.exit(1);
}

/* Two possible options to enter the name of csv file - either with '.csv'
 at the end or without */

var fileName = process.argv[2];
if (!fileName) {
  console.error("CSV file isn't designated.");
  process.exit(1);
}

if (!(fileName.endsWith('.csv'))) {
  fileName = fileName.concat('.csv');
}

/* Another command-line argument can be used to specify the name of an
   output file (either with '.json' or without). If not, the file is called "db.json". */

if (process.argv[3]) {
  var outputFile = process.argv[3];
  if (!(outputFile.endsWith('.json'))) {
    outputFile = outputFile.concat('.json');
  }
}
else {
  var outputFile = "customer-data.json";
}

/* Variables for names&values of objects. firstLineRead is needed to distingush
future JSON names from values*/

var objects = [];
var names = [];
var values = [];
var value = '';
var data;
var firstLineRead = false;

/*creating new read stream. Path module is used to provide proper filename input
on different OS*/

var readStream = new fs.ReadStream(path.join(__dirname, './csv/', fileName), {encoding:'utf8'});
readStream.on('readable', () => {
  // important detail: file is read symbol by symbol (readstream.read(1))
  while(null !== (data = readStream.read(1))) {

    /* Each customer-data.csv line contains \n\r at the end of it. Since the file is being
       read symbol by symbol, it's not possible to check for the end of line as
       a combination of both \n and \r/. Therefore, one of them is used for this
       check, while the other one is just skipped.*/

    if (data == '\n') continue;

    /* Starting from the second line of file onward, this code combines the names and the
       values into new object and stores it in an array*/

    if (data == '\r' && firstLineRead == true) {
      values.push(value);
      value = '';
      let line = {};
      for (var key in names) {
        line[names[key]] = values[key];
      }
      values = [];
      objects.push(line);
    }

    /* Here it's checked whether the first line containing the names is read.
     They are stored in an array. */

    else if (data == '\r' && firstLineRead == false) {
      values.push(value);
      value = '';
      for (var each in values) {
        names.push(values[each]);
      }
      values = [];
      firstLineRead = true;
    }

    /* Apart from the end of a line, the program has to watch for commas that
       separate the values. All the values between commas are stored in 'value'
       variable, and then, when a comma is reached, the symbols are joined
       together into proper words, to later be stored in an array*/

    else if (data != ',') {
        value = value + data;
      }
      else {
        values.push(value);
        value = '';
      }
  }
});

/* Writing a JSONified 'objects' array into a file. Since the data is concatenated
   to the designated output file, the file is deleted first to ensure proper output data */

readStream.on('end', () => {
  if (fs.existsSync(__dirname + outputFile)) {
    fs.unlinkSync(outputFile);
  }
  fs.appendFileSync(outputFile, JSON.stringify(objects, null, 4));
});
