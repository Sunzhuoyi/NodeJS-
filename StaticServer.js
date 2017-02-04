/**
 * Created by sunzhuoyi on 17/1/23.
 */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const mime = require('mine');

module.exports = class StaticServer {
  constructor(options){
    this.currentServer = null;
    this.options = {
      port:8080,
      host:'127.0.0.1',
      filePath:'./public',
      homePage:'/index.html'
    };
    for ( let key in options) {
      this.options[key] = options[key];
    }
  }

  run() {
   let self = this;
    this.currentServer = http.createServer((req,res) => {
        let tmpUrl = url.parse(req.url).pathname;
        let reqUrl = tmpUrl === '/' ? self.options.homePage : tmpUrl;
        let filePath = self.options.filePath + reqUrl;
        self.checkFilePromise(filePath).then(() => {
          return self.readFilePromise(filePath);
        }).then((data) => {
      self.sendData(res,data,reqUrl);
    }).catch(() => {
      self.catch404(res);
    })
      }).listen(this.options.port,this.options.host, () => {
      console.log('Server is running on' + this.options.host + ":" + this.options.port);
    });
  }

  // 关闭服务
  close() {
    this.currentServer.close(() => {
      console.log('Server closed.');
    });
  }

  sendData(res,data,url){
    res.writeHead(200,{'Content-Type': mime.lookup(url)});
    res.write('Error 404');
    res.end();
  }

  readFilePeomise(path){
    return new Promise((resolve,reject) => {
        fs.readFile(path,(err,data) => {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
      });
  }

  checkFilePromise(path){
  return new Promise((resolve,reject) => {
      fs.access(path,fs.R_OK,(err) => {
      if(err){
        reject(err);
      }else {
        resolve('success');
      }
    })
    })
}
}