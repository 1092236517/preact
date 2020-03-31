import MD5 from "md5";
import { isString, isObject, isArray, cloneDeep } from "@/lib/base/common";
import GlobalDef from "@/defines/global";
import ToastStore from '@/components/toast/store'
const { toastClick } = ToastStore;

const host = GlobalDef.APP_API_HOST;

/** Use the function to get the current settings
 *
 * @returns {{AuthInfo: {Uid: (*|number), Token: string}, AppSetting: {AppVersion: string, DeviceType: string, AppId: string, AppKey: string, AppSecret: string, UidKey: string, DeviceName: string}}}
 */
const getSettings = () => {
  let ResumeDetail = JSON.parse(localStorage.getItem("resumeDetail"));

  const settings = {
    AppSetting: {
      AppVersion: "1.0.0",
      AppId: "WK",
      AppKey: "WKWeb",
      UidKey: "EmployeeID",
      AppSecret: "a323f9b6-1f04-420e-adb9-b06d142c5e63",
      DeviceType: "web",
      DeviceName: "web"
    },
    AuthInfo: {
      Uid: ResumeDetail ? ResumeDetail.Id : 0,
      Token: ResumeDetail ? ResumeDetail.Token : ""
    }
  };

  return settings;
};

function getSign(dataStr, TimeStampStr) {
  if (typeof dataStr !== "string" || typeof TimeStampStr !== "string") {
    throw Error("Arguments type must be string. dataStr & timeStampStrt");
  }
  const settings = getSettings();
  return MD5(
    settings.AppSetting.AppKey +
      TimeStampStr +
      dataStr +
      settings.AppSetting.AppSecret,
    32
  ).toString();
}

function transfer(params) {
  const dataStr = JSON.stringify(trimp(params || {}));
  const nowTmp = Math.round(new Date().getTime() / 1000);
  const settings = getSettings();

  const Uid = settings.AuthInfo.Uid;
  const Token = settings.AuthInfo.Token;
  return {
    AppVer: settings.AppSetting.AppVersion,
    TimeStamp: nowTmp,
    Lang: "CN",
    DeviceName: settings.AppSetting.DeviceName,
    DeviceType: "web",
    Token,
    Uid,
    AppKey: settings.AppSetting.AppKey,
    Sign: getSign(dataStr, nowTmp.toString()),
    Data: JSON.stringify(params)
  };
}

function trimp(param) {
  if (isString(param)) {
    let pTrim = param.trim();
    const len = pTrim.length;
    if (
      (len === 11 || len === 16 || len === 18 || len === 19) &&
      pTrim.match(/[\uff00-\uffff]/)
    ) {
      const pTrimArr = pTrim.split("");
      let pTrimRes = "";
      for (const ch of pTrimArr) {
        const chCode = ch.charCodeAt();
        if (chCode > 65280 && chCode < 65375) {
          pTrimRes += String.fromCharCode(chCode - 65248);
        } else {
          pTrimRes += ch;
        }
      }
      pTrim = pTrimRes;
    }
    return pTrim;
  }
  if (isObject(param) || isArray(param)) {
    for (const key in param) {
      param[key] = trimp(param[key]);
    }
    return param;
  }
  return param;
}

function postData(url, data, method) {
  if (!navigator.onLine) {
    toastClick('无网络，请检查您的网络情况','error','info');
    return
  }
  return fetch(url, {
    body: JSON.stringify(data),
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    method: method || "POST",
    mode: "cors",
    redirect: "follow",
    referrer: "no-referrer"
  })
    .then(response => {
      if (response.ok) {
        if (response.Code !== 0) {
          gio('track','errorSelect', {
            'serviceName_var': url,
            'requestData_var': JSON.stringify(data),
            'error_var': response.Desc
            });
        }
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .catch(error => {
      gio('track','errorSelect', {
        'serviceName_var': url,
        'requestData_var': JSON.stringify(data),
        'error_var': error
        });
      console.log("请求错误:" + error);
    });
}

const request = async (url, opt) => {
  const { data, method } = opt;
  const copyData = cloneDeep(data);
  const formatData = transfer(copyData);
  return postData(`${host}${url}`, formatData, method);
};

export default request;
