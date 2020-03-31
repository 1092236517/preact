import {action, observable, runInAction, toJS} from 'mobx';
import { getList, getPost, getBroker, brokerShareBind, happenCounts, getWXShareParam, getShareText } from "@/services/detail";
import { isEmpty, gcj02tobd09, getUrlParam, getRTime } from "@/lib/base/common";
import region from "@/json/region";
import { getStorage, setStorage } from "@/lib/base/storage";
import cookie from 'react-cookies';
import md5 from 'md5';
import ToastStore from '@/components/toast/store'
const { toastClick } = ToastStore;

export const TypeForGetListData = {
  Normal: 'normal',
  Search: 'search'
}

const $store = observable({
  ToList: [],
  isFirst: true,
  setIsFirst:(newVal) => {
    $store.isFirst = newVal
  },
  // 岗位名
  searchName:'',
  setSearchName:(newVal) => {
    $store.searchName = newVal
  },
  // 排序
  SortId:1,
  updateSortId:(newVal) => {
    $store.SortId = newVal
  },
  // 薪资
  SalaryRoundId:0,
  updateSalaryRoundId:(newVal) => {
    $store.SalaryRoundId = newVal
  },
  // 行业
  IndustryId:0,
  getIndustryId: (newVal) => {
    $store.IndustryId = newVal;
  },
  // 岗位
  choiceId:[0],
  updateChoiceId:(newVal) => {
    $store.choiceId = newVal
  },
  choiceList:[],
  addChoicePost: async (newVal) => {
    $store.choiceList = newVal;
  },
  firstPostSearch:[],
  getFirstPostSearch: (val) => {
    $store.firstPostSearch = val;
  },
  allPost:[],
  setAllPost: (val) => {
    $store.allPost = val;
  },
  // 区域
  AreaId:0,
  updateAreaId:(newVal) => {
    $store.AreaId = newVal
  },
  // 是否疫情岗位
  isPneumonia: false,
  setIsPneumonia:(newVal) => {
    $store.isPneumonia = newVal
  },
  postList:[],

  isFrom:'index',
  setIsFrom: (val) =>{
    $store.isFrom = val
  },
  personalChoiceList:[],
  addPersonalPost: async (newVal) => {
    $store.personalChoiceList = newVal;
  },
  getPersonalIndustryId: (newVal) => {
    $store.PersonalIndustryId = newVal;
  },
  PersonalIndustryId:0,
  // loadingMore:false,
  // setLoadingMore: (loadingMore = false) => {
  //   $store.loadingMore = !!loadingMore;
  // },
  tabId:0,
  setTabId: (newVal) => {
    $store.tabId = newVal;
  },
  // 区域
  firstAreaId:0,
  updateFirstAreaId:(newVal) => {
    $store.firstAreaId = newVal
  },
  secondAreaId: '',
  updateSecondAreaId:(newVal) => {
    $store.secondAreaId = newVal
  },
  thirdAreaId: '',
  updateThirdAreaId:(newVal) => {
    $store.thirdAreaId = newVal
  },
  salaryRoundName: '不限',
  updateSalaryRoundName:(newVal) => {
    $store.salaryRoundName = newVal
  },
  sortName: '距离最近',
  updateSortName:(newVal) => {
    $store.sortName = newVal
  },
  statusId:0,
  setStatusId: (newVal) => {
    $store.statusId = newVal;
  },
  // 精度
  longitude:'0',
  setLongitude: (newVal) => {
    $store.longitude = newVal;
  },
  // 纬度
  latitude:'0',
  setLatitude: (newVal) => {
    $store.latitude = newVal;
  },
  // 地区
  cityName:'苏州',
  setCityName: (newVal) => {
    $store.cityName = newVal;
  },

  //虚拟城市
  virtualCityName: '',
  setVirtualCityName: (newVal) => {
    $store.virtualCityName = newVal;
  },

  //虚拟经度
  virtualLng: '0',
  setVirtualLng: (newVal) => {
    $store.virtualLng = newVal;
  },

  //虚拟维度
  virtualLat: '0',
  setVirtualLat: (newVal) => {
    $store.virtualLat = newVal;
  },

  // 列表总数
  listTotal: 0,
  setListTotal: (newVal) => {
    $store.listTotal = newVal;
  },

  // 滚动条位置
  scrollTop:0,
  setScrollTop: (newVal) => {
    $store.scrollTop = newVal;
  },

  // 是否到顶部
  toTop:false,
  setToTop: (newVal) => {
    $store.toTop = newVal;
  },

  recordIndex:0,
  setRecordIndex: (newVal) => {
    $store.recordIndex = newVal;
  },

  choiceName: '全部职位',
  setChoiceName: (newVal) => {
    $store.choiceName = newVal;
  },

  // 选择职位右侧滚动条高度保存
  rightScrollTop:0,
  setRightScrollTop: (newVal) => {
    $store.rightScrollTop = newVal;
  },

  

  setListStatus: (newVal) => {
    $store.ToList = newVal.ToList;
    $store.scrollTop = newVal.scrollTop;
    $store.recordIndex = newVal.recordIndex;
    $store.listTotal = newVal.listTotal;
    $store.longitude = newVal.longitude;
    $store.latitude = newVal.latitude;
    $store.virtualLng = newVal.virtualLng;
    $store.virtualLat = newVal.virtualLat;
    $store.searchName = newVal.searchName;
    $store.SortId = newVal.SortId;
    $store.SalaryRoundId = newVal.SalaryRoundId;
    $store.postList = newVal.postList;
    $store.IndustryId = newVal.IndustryId;
    $store.choiceId = newVal.choiceId;
    $store.AreaId = newVal.AreaId;
    $store.isPneumonia = newVal.isPneumonia;
    $store.isEnd = newVal.isEnd;
  },

  getUserPos: () => {
    var geolocation = new window.qq.maps.Geolocation("MGPBZ-JMLWQ-UE754-GG7QE-FRW67-Z7BKD", "周薪薪直聘-h5");
    var citylocation = new window.qq.maps.CityService({
      complete : function(results){
        if (results.detail.name === '昆山市') {
          $store.setCityName(results.detail.name)
        } else {
          $store.setCityName(results.detail.detail.split(',')[1])
        }
      }
    });
    geolocation.getLocation(function(res){
      //设置经纬度信息
      var latLng = new window.qq.maps.LatLng(res.lat, res.lng);
      //调用城市经纬度查询接口实现经纬查询
      citylocation.searchCityByLatLng(latLng);
      setTimeout(() => {
        const currentTime = new Date(new Date()).getTime() + 1
        const maxTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        const expires = (maxTime - currentTime) / 1000
        const userLocationInfo = {
          bMap_lng: gcj02tobd09(res.lng, res.lat)[0],
          bMap_lat: gcj02tobd09(res.lng, res.lat)[1],
          aMap_lng: res.lng,
          aMap_lat: res.lat,
          province: res.province,
          city: res.city,
          district: $store.cityName,
          formattedAddress: res.addr
        }
        $store.setLongitude(userLocationInfo.bMap_lng)
        $store.setLatitude(userLocationInfo.bMap_lat)
        // $store.setCityName(userLocationInfo.district)
        setStorage('userLocationInfo', userLocationInfo, 1800000)
        gio('track','getLocation',{
          'getLocationResult_var': '允许'})
        $store.geListData('search')
      }, 1000);
    }, function(err){
      localStorage.removeItem('userLocationInfo')
      gio('track','getLocation',{
        'getLocationResult_var': '拒绝'})
      // $store.geListData('search')
    }, 10000)

    // window.AMap.plugin('AMap.Geolocation', function() {
    //   let geolocation = new window.AMap.Geolocation({
    //     enableHighAccuracy: true,//是否使用高精度定位，默认:true
    //     timeout: 10000,          //超过10秒后停止定位，默认：5s
    //     buttonPosition:'RB',    //定位按钮的停靠位置
    //     buttonOffset: new window.AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    //     zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

    //   });
    //   geolocation.getCurrentPosition(function(status,result){
    //     if(status === 'complete'){
    //       console.log(status, result)
    //       const currentTime = new Date(new Date()).getTime() + 1
    //       const maxTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
    //       const expires = (maxTime - currentTime) / 1000
    //       let cityName = !isEmpty(result.addressComponent.district) ? result.addressComponent.district : (!isEmpty(result.addressComponent.city) ? result.addressComponent.city : result.addressComponent.province)
    //       if (cityName.indexOf('台湾') !== -1) {
    //         cityName = '台湾'
    //       }
    //       const userLocationInfo = {
    //         bMap_lng: gcj02tobd09(result.position.lng, result.position.lat)[0],
    //         bMap_lat: gcj02tobd09(result.position.lng, result.position.lat)[1],
    //         aMap_lng: result.position.lng,
    //         aMap_lat: result.position.lat,
    //         province: result.addressComponent.province,
    //         city: result.addressComponent.city,
    //         district: result.addressComponent.district,
    //         formattedAddress: result.formattedAddress
    //       }
    //       $store.setLongitude(userLocationInfo.bMap_lng)
    //       $store.setLatitude(userLocationInfo.bMap_lat)
    //       $store.setCityName(userLocationInfo.district)
    //       setStorage('userLocationInfo', userLocationInfo, 1800000)
    //       $store.geListData('search')
    //     }else{
    //       // toastClick('定位失败，默认为您定位苏州', 'warning','info');
    //       localStorage.removeItem('userLocationInfo')
    //       $store.setLongitude(120.6174)
    //       $store.setLatitude(31.335106)
    //       $store.setCityName('苏州')
    //       $store.geListData('search')
    //     }
    //   });
    // });
  },

  // 获取用户来源
  getFromAndCome: async () => {
    if (isEmpty(cookie.load('userFrom'))) {
      const come = getUrlParam('come') ? getUrlParam('come') : 'robot'
      const query = {
        HappenModule: 'Browse_Link',
        HappenValue: localStorage.getItem('ownerBrokerInfo') ? JSON.parse(localStorage.getItem('ownerBrokerInfo')).BrokerId.toString() : "0" , // 经纪人ID
        HappenPerson: localStorage.getItem('resumeDetail') ? JSON.parse(localStorage.getItem('resumeDetail')).Id.toString() : "0", // 用户ID
        HappenDevice: localStorage.getItem('UA'), // 设备系统
        Happensource: come, // 来源 群聊/朋友圈
        HappenDate: getUrlParam('sharedate') ? getUrlParam('sharedate') : ''
      }
      try {
        const response = await happenCounts(query);
        console.log(response)
        if (response.Code === 0) {
          console.log('存')
          cookie.save('userFrom', come, {
            path: '/',
            maxAge: getRTime(),
          });
        }
      } catch (err) {
        console.log(err.Desc);
      }
    }
  },

  // 是否到底了
  isEnd: false,
  geListData: async type => {
    // localStorage.removeItem('userLocationInfo')
    if (isEmpty(getStorage('userLocationInfo')) && $store.longitude === '0') {
      $store.setLongitude(120.6174)
      $store.setLatitude(31.335106)
      $store.setCityName('苏州')
    } else if (!isEmpty(getStorage('userLocationInfo'))) {
      console.log(getStorage('userLocationInfo'))
      $store.setLongitude(getStorage('userLocationInfo').bMap_lng)
      $store.setLatitude(getStorage('userLocationInfo').bMap_lat)
      $store.setCityName(getStorage('userLocationInfo').district)
    }
    let choiceId = 
    $store.choiceList.length > 0
      ? $store.choiceList.map((v) => v.professional_id)
      : $store.firstPostSearch.map((v) => v.professional_id);
      console.log('================',choiceId)
    if(choiceId.length === 1 && choiceId[0] === 0) {
      choiceId = []
    }
    const query = {
      RecordIndex: type==="search" ? 0 : $store.recordIndex,
      RecordSize: 10,
      Lng: Number($store.longitude),
      Lat: Number($store.latitude),
      VirtualLng: Number($store.virtualLng),
      VirtualLat: Number($store.virtualLat),
      SearchName: $store.searchName,
      SortType: $store.SortId,
      SalaryRoundId: $store.SalaryRoundId,
      IndustryId: choiceId.length > 0 ||
      ($store.postList.length > 0 &&
        $store.IndustryId === $store.postList[0].industry_id)
        ? 0
        : (choiceId.length < 1 ? 0 : $store.IndustryId),
      ProfessionalIds: choiceId,
      AreaId: $store.AreaId,
      Pneumonia: $store.isPneumonia ? 1 : 0
    };

    try {
      const res = await getList(query);
      if ($store.isFirst) {
        $store.setIsFirst(false)
        const load = Date.now() - performance.timing.navigationStart
        gio('track','onloadTime',{
          'onloadTime_var': `${load}ms`
        })
      }
      if (res.Code === 0) {
        // 使用runInAction
        runInAction(() => {
          if ($store.searchName.length > 0) {
            gio('track','searchSucess',{
              'searchWords_var': $store.searchName,
              'searchResult_var': res.Data.RecordList.length > 0 && res.Data.RecordList[0].Type !== 1 ? '是' : '否',})
          }
          $store.setListTotal(res.Data.RecordCount)
          if (type === TypeForGetListData.Search) {
            $store.ToList = res.Data.RecordList || [];
          } else {
            if ($store.ToList.length === res.Data.RecordCount) return
            $store.ToList = $store.ToList.concat(
              res.Data.RecordList || []
            );
          }
          const realData = res.Data.RecordList.filter(e => {
            return e.Type === 0
          })
          $store.isEnd = realData.length < query.RecordSize ? true : false;
          window.ontouchmove="";
        })
      }
    } catch (e) {}
  },
  // 获取职位列表
  getPostList: async () => {
    if ($store.postList.length > 0) return
    const query = {
      UserSign: localStorage.getItem('userSign'),
    };
    try {
      const response = await getPost(query);
      if (response.Code === 0) {
        runInAction(() => {
          $store.postList = response.Data.RecordList;
          if ($store.isFrom !== 'personal') {
            const addAll = {
              industry_id: 0,
              industry_name: '全部职位',
              professionals: [
                {
                  professional_id: 0,
                  professional_name: '全部职位'
                }
              ]
            }
            $store.postList.unshift(addAll)
          }
          $store.IndustryId = $store.postList[0].industry_id;
          $store.PersonalIndustryId = $store.postList[0].industry_id;
          toJS($store.postList).map((v) => {
            if (v.industry_id === $store.IndustryId) {
              $store.allPost = v.professionals;
            }
          });
        })
      }
    } catch (err) {
      console.log(err);
    }
  },
  // 是否经纪人分享进入
  isFromApp: async () => {
    localStorage.removeItem('ownerBrokerInfo')
    if (getUrlParam('broker_name') && getUrlParam('mobile') && getUrlParam('sign') && getUrlParam('hiredate')) {
      const _brokerName = getUrlParam('broker_name');
      const _mobile = getUrlParam('mobile');
      const _sign = getUrlParam('sign');
      const _hiredate = getUrlParam('hiredate');
      const mySign = md5(
        `wodedagong${_brokerName}${_mobile}${_hiredate}`
      );
      if (mySign === _sign) {
        const query = { BrokerPhone: _mobile }
        gio('track','visitH5',{
          'visitSource_var': '专属经纪人进入'})
        try {
          const response = await getBroker(query);
          if (response.Code === 0) {
            runInAction(() => {
              localStorage.setItem('ownerBrokerInfo', JSON.stringify(response.Data))
              $store.getFromAndCome()
            })
            $store.brokerShareBind(_mobile)
          }
        } catch (err) {
          console.log(err.Desc);
        }
      }
    } else if (getUrlParam('from') === 'gzh') {
      gio('track','visitH5',{
        'visitSource_var': '公众号进入'})
    }else {
      gio('track','visitH5',{
        'visitSource_var': '常规进入'})
    }
  },
  brokerShareBind: async (mobile) => {
    const query = { BrokerPhone: mobile, UserSign: localStorage.getItem('userSign') }
    try {
      const response = await brokerShareBind(query);
      if (response.Code === 0) {
        runInAction(() => {
          localStorage.setItem('userSign', response.Data.UserSign);
          $store.happenCountsFunc(mobile)
        })
      }
    } catch (err) {
      console.log(err.Desc);
    }
  },
  // 用户行为埋点
  happenCountsFunc: async  (mobile) => {
    if (isEmpty(cookie.load('shareBrowse'))) {
      const query = {
        HappenModule: 'BrokerShare',
        HappenValue: 'browse',
        HappenPerson: mobile,
        HappenDevice: localStorage.getItem('UA'),
        Happensource: 'H5',
      }
      try {
        const response = await happenCounts(query);
        if (response.Code === 0) {
          runInAction(() => {
            cookie.save('shareBrowse', mobile, {
              path: '/',
              maxAge: getRTime(),
            });
          })
        }
      } catch (err) {
        console.log(err.Desc);
      }
    }
  },

  // 微信分享配置
  wxShareConfig: async () => {
    // 对url进行编码
    let localUrl = window.location.href.split('#')[0]
    // url传到后台格式
    let url = localUrl
    // 后台需要从微信公众平台获取的参数
    try {
      const response = await getWXShareParam({url});
      if (response.Code === 0) {
        // 得到参数
        let appId = response.Data.Signature.Sppid
        let nonceStr = response.Data.Signature.NonceStr
        let signature = response.Data.Signature.Signature
        let timestamp = response.Data.Signature.TimeStamp
        // 通过微信config接口注入配置
        wx.config({
          debug: false, // 默认为false  为true的时候是调试模式，会打印出日志
          appId: appId,
          timestamp: timestamp,
          nonceStr: nonceStr,
          signature: signature,
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo'
          ]
        })
        try {
          const response2 = await getShareText({});
          let brokerName = getUrlParam('broker_name')
          let content = !isEmpty(brokerName) ? (brokerName + '良心推荐：' + response2.Data.Content) : response2.Data.Content
          // 配置自定义分享内容
          window.share_config = {
            share: {
              imgUrl: 'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/4c5529b4ae4723c3a8920976225526fb.jpg', // 这里是需要展示的图标
              desc: content, // 这是分享展示的摘要
              title: response2.Data.Title, // 这是分享展示卡片的标题
              link: window.location.href.split('#')[0], // 这里是分享的网址
            }
          }
          console.log(share_config)
          wx.ready(function() {
            wx.onMenuShareAppMessage(share_config.share)//  分享给好友
            wx.onMenuShareTimeline(share_config.share)//  分享到朋友圈
            wx.onMenuShareQQ(share_config.share)//  分享给手机QQ
          })
          wx.error(function(res) {
            console.log(res)
          })
        } catch (err) {

        }
      }
    } catch (err) {
      console.log('error:' + err.Desc);
    }
  }
}, {
  geListData: action,
  getPostList: action,
  isFromApp: action,
  getFromAndCome: action,
  wxShareConfig: action
});

export default $store;
