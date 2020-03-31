// 深拷贝
function cloneDeep(obj) {
  var str,
    newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== "object") {
    return;
  } else if (window.JSON) {
    (str = JSON.stringify(obj)), (newobj = JSON.parse(str));
  } else {
    for (var i in obj) {
      newobj[i] = typeof obj[i] === "object" ? cloneObj(obj[i]) : obj[i];
    }
  }
  return newobj;
}

// 是否Object 返回值 true || false
function isObject(value) {
  const type = typeof value;
  return value !== null && (type === "object" || type === "function");
}

// 是否数组 返回值 true || false
function isArray(value) {
  const _isArray =
    Array.isArray ||
    (_arg => Object.prototype.toString.call(_arg) === "[object Array]");
  return _isArray(value);
}

// 是否为空 返回值 true || false
function isEmpty(value) {
  if (value === null || value === undefined || value === "") {
    return true;
  }
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }
  if (isArray(value)) {
    return value.length === 0;
  }
  return false;
}

// 是否String 返回值 true || false
function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}

// 时间格式化 返回值 2019-10-31 11:00
function formatDateTime(date) {
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? `0${m}` : m;
  let d = date.getDate();
  d = d < 10 ? `0${d}` : d;
  let h = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  h = h < 10 ? `0${h}` : h;
  minute = minute < 10 ? `0${minute}` : minute;
  second = second < 10 ? `0${second}` : second;
  return `${y}-${m}-${d} ${h}:${minute}:${second}`;
}

// 经纬度距离计算 返回值 string
function calcDistance(lata, lnga, latb, lngb) {
  const pk = 180 / 3.14159;
  const a1 = lata / pk;
  const a2 = lnga / pk;
  const b1 = latb / pk;
  const b2 = lngb / pk;
  const t1 = Math.cos(a1) * Math.cos(a2) * Math.cos(b1) * Math.cos(b2);
  const t2 = Math.cos(a1) * Math.sin(a2) * Math.cos(b1) * Math.sin(b2);
  const t3 = Math.sin(a1) * Math.sin(b1);
  const tt = Math.acos(t1 + t2 + t3);
  return 6371 * tt;
}

// 获取距离明天的秒数 返回值string(秒)
function getRTime() {
  const date = new Date();
  const m1 = date.getTime();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  const m0 = date.getTime();
  const m = 60 * 60 * 24 - (m1 - m0) / 1000;
  return m;
}

// 获取随机数 返回值string
function random(min, max) {
  const range = max - min;
  const rand = Math.random();
  const number = min + Math.round(rand * range);
  return number;
}

function time(_time) {
  const date =
    typeof _time === "number"
      ? new Date(_time)
      : new Date((_time || "").replace(/-/g, "/"));
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  const dayDiff = Math.floor(diff / 86400);
  const isValidDate = Object.prototype.toString.call(date) === "[object Date]";
  // const isValidDate = Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())

  if (!isValidDate) {
    return "";
  }

  const formatDate = function(_date) {
    const today = new Date(_date);
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const day = `0${today.getDate()}`.slice(-2);
    // let hour = formatNumber(today.getHours())
    // let minute = formatNumber(today.getMinutes())
    if (new Date().getFullYear() > year) {
      return `${year}年${month}月${day}日`; // ${hour}:${minute}
    }
    return `${month}月${day}日`;
  };

  if (dayDiff === -1) {
    return "刚刚";
    // } if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 30) {
  }
  if (dayDiff < 0 || dayDiff >= 30) {
    return formatDate(date);
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60 && "刚刚") ||
        (diff < 120 && "1分钟前") ||
        (diff < 3600 && `${Math.floor(diff / 60)}分钟前`) ||
        (diff < 7200 && "1小时前") ||
        (diff < 86400 && `${Math.floor(diff / 3600)}小时前`))) ||
    `${dayDiff}天前`
  );
}

function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`); // 构造一个含有目标参数的正则表达式对象
  const r = window.location.search.substr(1).match(reg); // 匹配目标参数
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null; // 返回参数值
}

// 精度加法计算
function accAdd(arg1, arg2) {
  let r1;
  let r2;
  let n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = 10 ** Math.max(r1, r2);
  return (arg1 * m + arg2 * m) / m;
}

// 精度减法计算
function subtr(arg1, arg2) {
  let r1;
  let r2;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = 10 ** Math.max(r1, r2);
  // last modify by deeka
  // 动态控制精度长度
  const n = r1 >= r2 ? r1 : r2;
  return (arg1 * m - arg2 * m) / m;
}

// 精度乘法计算
function accMul(num1, num2) {
  let m = 0;
  const s1 = num1.toString();
  const s2 = num2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
    // empty
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
    // empty
  }
  return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / 10 ** m;
}

// 精度除法计算
function accDiv(arg1, arg2) {
  let t1 = 0;
  let t2 = 0;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    // empty
  }
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    // empty
  }
  const r1 = Number(arg1.toString().replace(".", ""));
  const r2 = Number(arg2.toString().replace(".", ""));
  return accMul(r1 / r2, 10 ** (t2 - t1));
}

const PH = window.innerHeight; // window.screen.availHeight;
const VW = window.innerWidth / 100; // window.screen.availWidth / 100;

const EffectiveType =
  window.navigator &&
  window.navigator.connection &&
  window.navigator.connection.effectiveType;

const UA = window.navigator.userAgent;
const isiPhone = /iPhone/.test(UA);
const isAndroid = /Android/.test(UA);

function testWebP() {
  const canvas =
    typeof document === "object" ? document.createElement("canvas") : {};
  canvas.width = canvas.height = 1;
  return canvas.toDataURL
    ? canvas.toDataURL("image/webp").indexOf("image/webp") === 5
    : false;
}
const SupportWebP = testWebP();

function getImgFormatUrl(url, opt) {
  if (isAndroid && SupportWebP) {
    opt.t = "webp";
  }
  if (EffectiveType) {
    switch (EffectiveType) {
      case "4g": {
        opt.q = 80;
        return formatStr(url, opt);
        break;
      }

      case "3g": {
        opt.q = 60;
        return formatStr(url, opt);
        break;
      }
      case "2g": {
        opt.q = 40;
        return formatStr(url, opt);
        return false;
      }
      case "slow-2g": {
        opt.q = 30;
        return formatStr(url, opt);
        return false;
      }
      default: {
        opt.q = 80;
        return formatStr(url, opt);
        break;
      }
    }
  } else {
    opt.q = 70;
    return formatStr(url, opt);
  }
}

function formatStr(url, opt) {
  const { w, h, t, q } = opt;
  const formatStr = `?x-oss-process=image/resize,h_${h},w_${w}/quality,q_${q}/interlace,1/${
    t ? "format,webp" : ""
  }`;
  return `${url}${formatStr}`;
}

function getRem(pwidth,prem){
  var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
  return oWidth/pwidth*prem + "px";
}

function gcj02tobd09(lng, lat){
  const xPI = 3.14159265358979324 * 3000.0 / 180.0
  let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPI)
  let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPI)
  let bdLng = z * Math.cos(theta) + 0.0065
  let bdLat = z * Math.sin(theta) + 0.006
  return [bdLng, bdLat]
}

//百度坐标转高德（传入经度、纬度）
function bgps_gps(bd_lng, bd_lat) {
  const X_PI = Math.PI * 3000.0 / 180.0;
  let x = bd_lng - 0.0065;
  let y = bd_lat - 0.006;
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  let gg_lng = z * Math.cos(theta);
  let gg_lat = z * Math.sin(theta);
  return {lng: gg_lng, lat: gg_lat}
}

export {
  isObject,
  isArray,
  isEmpty,
  isString,
  cloneDeep,
  formatDateTime,
  calcDistance,
  getRTime,
  random,
  time,
  getUrlParam,
  accAdd,
  subtr,
  accMul,
  accDiv,
  PH,
  VW,
  getRem,
  getImgFormatUrl,
  gcj02tobd09,
  bgps_gps,
};
