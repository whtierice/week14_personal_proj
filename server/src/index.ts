// crypto 패치를 먼저 로드
require('./polyfill');

// 그 다음 NestJS 앱 실행
import { bootstrap } from './main';