// Node.js의 crypto 모듈을 전역으로 패치
const crypto = require('crypto');
global.crypto = {
  randomUUID: () => crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex')
};