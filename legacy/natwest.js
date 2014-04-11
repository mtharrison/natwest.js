#!/usr/bin/env node

var credentials = {},
    phantom = require('node-phantom'),
    prompt = require("prompt"),
    fs = require("fs");

var argv = require('optimist').argv;

if (typeof (argv.r) !== 'undefined') {
    if (argv.r === "server") {
        var renderer = require("./renderers/ServerRenderer");
    } else {
        var renderer = require("./renderers/CLITableRenderer");
    }
} else {
    var renderer = require("./renderers/CLITableRenderer");
}

// Check if there's a credentials file
fs.exists('./credentials.json', function (exists) {
    if (exists) {
        credentials = require("./credentials");
        connect();
    } else {

        prompt.message = "";
        prompt.delimiter = "";

        prompt.start();

        console.log("Please enter the following information:".red.underline.bold);
        console.log("");
        prompt.get({
            properties: {
                'customer_number': {
                    description: 'Customer number: '.red.bold,
                    type: 'string',
                    required: true
                },
                'pin': {
                    description: 'Pin: '.red.bold,
                    type: 'string',
                    required: true,
                    hide: true
                },
                'password': {
                    description: 'Password: '.red.bold,
                    type: 'string',
                    required: true,
                    hide: true
                },
                'write': {
                    description: 'Do you want to save these credentials? [y/n]: '.red.bold,
                    default: 'n',
                    required: true
                }
            }
        }, connect);
    }


});

function connect(err, result) {

    if (result) {
        credentials.customer_number = result.customer_number;
        credentials.pin = result.pin;
        credentials.password = result.password;

        if (result.write === 'y')
            fs.writeFile("credentials.json", JSON.stringify(credentials, null, 4));
    }

    bank();
}

function bank() {
    console.log("Connecting to bank…");
    phantom.create(function (err, ph) {
        return ph.createPage(function (err, page) {
            return page.open("https://www.nwolb.com/", function (err, status) {
                console.log("Entering customer number…");
                setTimeout(function () {
                    return page.evaluate(function (credentials) {
                        window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_LI5TABA_DBID_edit').value = credentials.customer_number;
                        window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_LI5TABA_LI5-LBA_button_button').click();
                    }, function (error, result) {
                        console.log("Entering pin and password…");
                        setTimeout(function () {
                            return page.evaluate(function (credentials) {

                                var pin1 = parseInt(window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6DDALALabel').innerText.split(" ")[2].split("nd")[0]);
                                var pin2 = parseInt(window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6DDALBLabel').innerText.split(" ")[2].split("nd")[0]);
                                var pin3 = parseInt(window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6DDALCLabel').innerText.split(" ")[2].split("nd")[0]);

                                window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6PPEA_edit').value = credentials.pin[pin1 - 1];
                                window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6PPEB_edit').value = credentials.pin[pin2 - 1];
                                window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6PPEC_edit').value = credentials.pin[pin3 - 1];

                                var password1 = parseInt(window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6DDALDLabel').innerText.split(" ")[2].split("nd")[0]);
                                var password2 = parseInt(window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6DDALELabel').innerText.split(" ")[2].split("nd")[0]);
                                var password3 = parseInt(window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6DDALFLabel').innerText.split(" ")[2].split("nd")[0]);

                                window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6PPED_edit').value = credentials.password[password1 - 1];
                                window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6PPEE_edit').value = credentials.password[password2 - 1];
                                window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_LI6PPEF_edit').value = credentials.password[password3 - 1];

                                window.frames.ctl00_secframe.document.querySelector('#ctl00_mainContent_Tab1_next_text_button_button').click();

                            }, function (error, result) {
                                setTimeout(function () {
                                    return page.evaluate(function () {

                                        var accounts = [];


                                        var accountsDOM = Array.prototype.slice.call(frames.ctl00_secframe.document.querySelectorAll("#ctl00_mainContent_Accounts_Accounts .CollapseExpandLink"), 0);
                                        for (var i in accountsDOM) {
                                            var account = {};
                                            account.id = parseInt(i) + 1;
                                            account.name = accountsDOM[i].querySelector(".AccountName").innerText;
                                            account.number = accountsDOM[i].querySelector(".AccountNumber .num").innerText.replace(/ /g, "");
                                            account.sortcode = accountsDOM[i].querySelector(".SortCode .num").innerText.replace(/ /g, "");
                                            account.balance = accountsDOM[i].querySelectorAll(".currency")[0].innerText.replace(/ /g, "");
                                            account.available = accountsDOM[i].querySelectorAll(".currency")[1].innerText.replace(/ /g, "");
                                            accounts.push(account);
                                        }

                                        return accounts;
                                    }, function (error, result) {
                                        renderer.setData(result).render();
                                        ph.exit();
                                    }, credentials);
                                }, 3000);
                            }, credentials);
                        }, 3000);
                    }, credentials);
                }, 3000);

            });
        });
    });
}