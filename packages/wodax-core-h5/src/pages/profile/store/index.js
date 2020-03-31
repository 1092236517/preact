import { action, observable, runInAction } from 'mobx';
import { getResume, getCode, giveMeYouCode } from '@/services/detail';
import ToastStore from '@/components/toast/store'
const { toastClick } = ToastStore;
import cookie from "react-cookies"

const $store = observable({
  titleName:localStorage.getItem('resumeDetail')?JSON.parse(localStorage.getItem('resumeDetail')).Name:'未登录',
  avatar: localStorage.getItem('resumeDetail')?(JSON.parse(localStorage.getItem('resumeDetail')).Avatar?JSON.parse(localStorage.getItem('resumeDetail')).Avatar:'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/08b35c75b56c0a13a205ca6c8a700242.jpg'):'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/08b35c75b56c0a13a205ca6c8a700242.jpg',
  showLogin:false,
  setShowLogin: (newVal) => {
    $store.showLogin = newVal;
  },
  clickWhere:'',
  setClickWhere: (newVal) => {
    $store.clickWhere = newVal;
  },
  getUserInfo: async () => {
    if (localStorage.getItem('loginInfo')) {
      $store.title = JSON.parse(localStorage.getItem('loginInfo')).Name;
      $store.avatar = JSON.parse(localStorage.getItem('loginInfo')).Avatar;
    } else if(localStorage.getItem('resumeDetail')){
      try {
        // toastClick('数据加载中','loading','loading');
        const res = await getResume({});
        if (res.Code === 0) {
            $store.title= res.Data.Name,
            $store.avatar= res.Data.Avatar
            localStorage.setItem('resumeDetail', JSON.stringify(res.Data))
        }
      } catch (e) {
        toastClick(e.Desc,'warning','info');
      }
    }
  }

},{
  getUserInfo:action
});

export default $store;
