import { action, observable, runInAction } from 'mobx';
import cookie from "react-cookies"
import { getCode, giveMeYouCode, saveResume } from "@/services/detail";
import ToastStore from '@/components/toast/store'
const { toastClick } = ToastStore;

const $store = observable({
  clickWhere:'',
  setClickWhere: (newVal) => {
    $store.clickWhere = newVal;
  },
  showLogin:false,
  setShowLogin: (newVal) => {
    $store.showLogin = newVal;
  },
  from:'',
  setFrom: (newVal) => {
    $store.from = newVal;
  },

  // 获取验证码
  getVCode: async mobile => {
    const query = {
        Mobile: mobile,
    };
    try {
      const response = await getCode(query);
      if (response.Code === 0) {
        runInAction(() => {
            _czc.push(['_trackEvent', '登录', '获取验证码'])
        })
      }
    } catch (err) {
      console.log(err);
    }
  },
  // 登录
  getLoginIn: async arg => {
    const query = {
        ...arg
    };
    try {
      const response = await giveMeYouCode(query);
      if (response.Code === 0) {
        runInAction(() => {
          toastClick('登录成功','success','info');
          $store.setShowLogin(false)
          cookie.save('userPhone', response.Data.Phone)
          gio('setUserId', response.Data.Id.toString());
          localStorage.setItem('resumeDetail', JSON.stringify(response.Data))
          _czc.push(['_trackEvent', '制造业详情', '让经纪人联系我'])
        })
      } else {
        toastClick(response.Desc,'warning','info');
      }
    } catch (err) {
    }
  },

  // 小简历保存
  getSave: async arg => {
    const query = {
      Phone: arg.Phone,
      Code: arg.Code,
      Name: arg.Name,
      Sex: Number(arg.Sex),
      Lng: JSON.parse(localStorage.getItem('location'))
        ? `${JSON.parse(localStorage.getItem('location')).lng}`
        : '',
      Lat: JSON.parse(localStorage.getItem('location'))
        ? `${JSON.parse(localStorage.getItem('location')).lat}`
        : '',
      WayType: arg.WayType,
      Birth: arg.Birth,
      Avatar: arg.Avatar,
      ProfessionalTypeList: arg.ProfessionalTypeList,
      UserSign: localStorage.getItem('userSign'),
      Address: JSON.parse(localStorage.getItem('location'))
        ? JSON.parse(localStorage.getItem('location')).address
        : '',
      Source: arg.WayType === 1 || arg.WayType === 2 ? 2 : 1,
    };
    try {
      const response = await saveResume(query);
      if (response.Code === 0) {
        $store.setShowLogin(false)
        cookie.save('userPhone', response.Data.Phone)
        localStorage.setItem('resumeDetail', JSON.stringify(response.Data))
        gio('setUserId', response.Data.Id.toString());
        window.location.href = `tel:${localStorage.getItem('detailCallPhone')}`
        toastClick('提交成功，请手机保持通畅，以便商家联系','success','info');
        _czc.push(['_trackEvent', '小简历', '提交小简历'])
      } else {
        toastClick(response.Desc,'warning','info');
      }
    } catch (err) {
      toastClick(err,'warning','info');
    }
  }


}, {
    getVCode: action,
    getLoginIn:action,
    getSave:action
});

export default $store;
