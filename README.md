Natwest.js
=========

A command line banking tool written in Node.js

![Bilby Stampede](http://s3-eu-west-1.amazonaws.com/matt-github/screenshot-table.png)


Natwest.js is a command line tool written in Node.js which lets CLI addicts get your account information programatically from Natwest Bank (UK). It uses PhantomJS behind the scenes to fire up a webkit, submit your credentials and scrape some ugly HTML and output it into a beautiful terminal interface.




Installation
--------------

PhantomJS is required for this tool to work, Installation instructions are here: http://phantomjs.org/download.html

```sh
git clone https://github.com/mtharrison/natwest.js
cd natwest.js
npm install
chmod u+x natwest.js
```

Usage
--------------

```sh
./natwest.js             # Uses the default CLI table renderer
                         # OR
./natwest.js -r server   # Serves you JSON via an Express server
```

Customisation and Renderers
--------------

This tool is designed to allow alternative renderers to present your data in any way you wish. V0.1.0 comes bundled with 2 renderers: The default CLI table (see screenshot) and the JSON server renderer. More will be included in future. Feel free to submit pull requests for renderers (or anything for that matter!).

Security
--------------

Please use wisely, obviously anything that deals with personal financial information needs to used sensibly. The program will prompt you to save your credentials (defaults to no), if you say yes, it will store these unencrypted in a JSON file called `credentials.json`, I only recommend you do this for development and that's why it's there. No other data is stored.

Version
----

0.1.0

License
----
MIT
