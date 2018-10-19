# csv-to-json

This app converts a CSV file to JSON. It was made specifically to be working with 
'customer-data.csv' file, so it may not work / work improperly with other files.

It requires a command-line argument with file's name to run - i.e., 'node app.js customer-data.csv'.
The user also can indicate the output file's name, but it's not really required.

As for the app's design - it's quite simple and can be followed by comments inside app.js.
The greatest difficulty for me was to figure out how readable and writeable streams work in
Node.js. There is a lot of deprecated functionality, and I'm sure that the way I've done the 
task isn't even nearly the best. I've decided to read the file letter by letter, but I suspect
it could be done with more style - especially because this .csv file contains two end-line
characters at the end of each line and they both have to be managed. 

I've tested this app with 'customer-data.csv'. The task didn't specify that it should work
with other files, so I didn't bother with making it multipurpose. Nevertheless, app's
structure should allow it to work with other .csv files to some extent. 
