'use strict';

const { app, BrowserWindow } = require('electron');
var mainWindow;
const notifier = require('node-notifier');
var express = require("express");
var web = express();
var server = web.listen(80, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

// お知らせの表示  http://localhost/message
//   実際はPOST ブラウザから制御するデモなのでGETにしている
web.get("/message", function(req, res){
    notify("タスクが追加されました");
    res.json("OK");
});

// コマンド実行  http://localhost/exec
//   実際はPOST ブラウザから制御するデモなのでGETにしている
web.get("/exec", function(req, res){
    const execSync = require('child_process').execSync;  // 同期処理
    const result = execSync('C:\\Users\\egami\\message\\egami.bat');
    console.log(result.toString());
    res.json("OK");
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({width: 260, height: 125});
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// http://blog.techium.jp/entry/2016/04/05/091500
function notify(message) {
    notifier.notify({
        title: 'お知らせ',
        message: message,
        icon: 'file://' + __dirname + '/img/icon.png',
        sound: true,
        wait: true,
    }, function (err, response) {
//        console.log(response);
    });

    // クリックしたけど検出されない
    notifier.on('click', function (notifierObject, options) {
        console.log('notification click');
    });

    // クリックしないでタイムアウトすると検出される
    // タイムアウト時間はどこで設定？ Windowsの設定？
    notifier.on('timeout', function (notifierObject, options) {
        console.log('notification timeout');
    });
}
