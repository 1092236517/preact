import { action, observable, runInAction } from 'mobx';
import { getPost, getCode, saveResume } from "@/services/detail";
import ToastStore from '@/components/toast/store'
const { toastClick } = ToastStore;

const $store = observable({
  postList: [],
  leftList: [],
  showSelectJobPop: false,
  checkingContent: {},
  isUpdate: false,
  setIsUpdate: (val) => {
    $store.isUpdate = val
  },
  setShowSelectJobPop: (val) => {
    $store.showSelectJobPop = val
  },
  gePostData: async () => {
    const query = {
      UserSign: localStorage.getItem('userSign'),
    };
    try {
      const res = await getPost(query);
      if (res.Code === 0) {
        const { Data } = res;
        if(Data) {
          const { RecordList } = Data;
          if(RecordList) {
            $store.postList = RecordList;
            $store.leftList = RecordList.map((item,index) => {
              return {
                industry_id:item.industry_id,
                industry_name:item.industry_name
              }
            }) 
          }
        }
      }
    } catch (e) {}
  },
  codeText: '获取验证码',
  disableCode: false,
  setGetCode: (val) => {
    $store.codeText = `剩余${val}s`;
  },
  defaultCode: () => {
    $store.codeText = '获取验证码';
  },
  getCodeDetail: async (Mobile) => {
    const query = {
      Mobile
    }
    try {
      $store.disableCode = true;
      const res = await getCode(query);
      if(res.Code === 0) {
        let remainTime = 60;
        $store.codeText = '剩余60s';
        $store.timeInterval = setInterval(() => {
          if (remainTime > 1) {
            remainTime -= 1;
            $store.setGetCode(remainTime);
          } else {
            $store.defaultCode();
            clearInterval($store.timeInterval);
            $store.disableCode = false;
          }
        }, 1000);
      }
    } catch (err) {

    }
  },
  ProfessionalTypeList:new Set(),
  setProfessionalTypeList:(arr) => {
    $store.ProfessionalTypeList = arr;
  },

  ProfessionalTypeList2: [],
  setProfessionalTypeList2:(arr) => {
    $store.ProfessionalTypeList2 = arr;
  },

  getSave: async (arg) => {
    if($store.timeInterval) {
      clearInterval($store.timeInterval);
    }
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
      ProfessionalTypeList:arg.ProfessionalTypeList,
      UserSign: localStorage.getItem('userSign'),
      Address: JSON.parse(localStorage.getItem('location'))
        ? JSON.parse(localStorage.getItem('location')).address
        : '',
      Source: arg.WayType === 1 || arg.WayType === 2 ? 2 : 1,
    };
    try {
      const res = await saveResume(query);
      if (res.Code === 0) {
        toastClick($store.isUpdate ? '修改成功' : '提交成功，请手机保持通畅，以便商家联系', 'success','info')
        // 区分有没有投递过简历 -> 有没有登录
        localStorage.setItem('resumeDetail', JSON.stringify(res.Data));
        gio('setUserId', res.Data.Id.toString());
        gio('track','getbigResume',{
          'refPage_var': localStorage.getItem('personalFrom') ? JSON.parse(localStorage.getItem('personalFrom')).page : '我的',
          'refbutton_var': localStorage.getItem('personalFrom') ? JSON.parse(localStorage.getItem('personalFrom')).button : '我的简历'})
        localStorage.removeItem('personalFrom')
        setTimeout(function () {
          window.history.go(-1);
        }, 2000)
      } else {
        toastClick(res.Desc, 'warning','info')
      }
    } catch (err) {
    }
  }
}, {
  gePostData: action,
  setShowSelectJobPop: action,
  getCodeDetail: action,
  getSave: action
});

export default $store;
