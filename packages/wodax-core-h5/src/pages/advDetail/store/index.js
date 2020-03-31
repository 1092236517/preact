import { action, observable, runInAction } from 'mobx';
import { getBroker, addClickSumInBrokerADAction, brokerHaveMember, getRecordBrokerVisterDetail, getTopAdvertisementInfo, happenCounts } from "@/services/detail";
import ToastStore from '@/components/toast/store'
import { getRTime } from "@/lib/base/common";
import cookie from 'react-cookies';
const { toastClick } = ToastStore;

const $store = observable({
    brokerId: 0,
    brokerIdCardId: 0,
    brokerName: '',
    brokerPhone: '',
    brokerWechat: '',
    clickWhere:'',
    setClickWhere: (newVal) => {
        $store.clickWhere = newVal;
    },
    mainImg: null,
    from:'',
    setFrom: (newVal) => {
      $store.from = newVal;
    },
    setBrokerPhone: (newVal) => {
      $store.brokerPhone = newVal;
    },
    agentPhone:'',
    option:'',
    setOption: (newVal) => {
        $store.option = newVal;
    },
    showLogin:false,
    setShowLogin: (newVal) => {
        $store.showLogin = newVal;
    },
    getTopAdvertisementInfo: async arg => {
      try {
        const res = await getTopAdvertisementInfo({});
        if (res.Code === 0) {
          // 使用runInAction
          runInAction(() => {
            $store.mainImg = res.Data.Detail
            $store.brokerId = res.Data.BrokerId
            $store.brokerIdCardId = 0 // BrokerIdCardId
            $store.brokerName = res.Data.AgentMajia
            $store.brokerPhone = res.Data.AgentPhone
            $store.brokerWechat = res.Data.AgentWechat
          })
        }
      } catch (e) {}

    },
    getBrokerByPhone: async type => {
      const BrokerInfo = JSON.parse(localStorage.getItem('brokerInfo')); // 专属经纪人信息
      console.log(BrokerInfo)
      $store.brokerInfo = BrokerInfo;
      const query = {
        BrokerPhone: $store.brokerPhone ? $store.brokerPhone : localStorage.getItem('listCurrentBrokerPhone')
      };
      try {
        const res = await getBroker(query);
        if (res.Code === 0) {
          // 使用runInAction
          runInAction(() => {
            // $store.mainImg = res.Data.Detail
            $store.brokerId = res.Data.BrokerId
            $store.brokerIdCardId = res.Data.BrokerIdCardId
            $store.brokerName = res.Data.BrokerName
            $store.brokerPhone = res.Data.BrokerPhone
            $store.brokerWechat = res.Data.BrokerWechat
            localStorage.setItem('listCurrentBrokerPhone', res.Data.BrokerPhone)
          })
        }
      } catch (e) {}
    },
    getOwnerBrokerInfo: async type => {
        const ownerBrokerInfo = JSON.parse(localStorage.getItem('ownerBrokerInfo'))
        $store.brokerId = ownerBrokerInfo.BrokerId
        $store.brokerIdCardId = ownerBrokerInfo.BrokerIdCardId
        $store.brokerName = ownerBrokerInfo.BrokerName
        $store.brokerPhone = ownerBrokerInfo.BrokerPhone
        $store.brokerWechat = ownerBrokerInfo.BrokerWechat
    },
    // 会员联系经纪人
    brokerHaveMemberIs: async arg => {
        const query = {
            ...arg
        };
        try {
            const res = await brokerHaveMember(query);
            if (res.Code === 0) {
                // 使用runInAction
                runInAction(() => {
                    toastClick('连线成功，请耐心等候回复','success','info');
                })
            } else {
              toastClick(res.Desc,'warning','info');
            }
        } catch (e) {
        }
    },
    // 操作埋点
    recordOptions: async (happenModule, happenValue, happensource) => {

      if (cookie.load(`${happenModule}-${happenValue}-${happensource}`)) return
      const query = {
        HappenModule: happenModule,
        HappenValue: happenValue,
        HappenPerson: $store.brokerId.toString(),
        HappenDevice: localStorage.getItem('UA'),
        Happensource: happensource
      }
      try {
        const res = await happenCounts(query);
        if (res.Code === 0) {
          // 使用runInAction
          runInAction(() => {
            cookie.save(`${happenModule}-${happenValue}-${happensource}`, `${happenModule},${happenValue},${happensource}`, {
              path: '/',
              maxAge: getRTime(),
            });
          })
        }
      } catch (e) {}

      if (happenValue === 'options') {
        const query = {
          HappenModule: "BrokerADPage",
          HappenValue:  "Click",
          HappenPerson: $store.brokerId.toString(),
          HappenDevice: "recruit",
          HappenSource: "SYSTEM",
        }
        try {
          const res = await happenCounts(query);
          if (res.Code === 0) {
            // 使用runInAction
          }
        } catch (e) {}
      }
    }
}, {
    brokerHaveMemberIs:action,
    recordOptions: action
});

export default $store;
