import { action, observable, runInAction } from 'mobx';
import { getDetail, getCode, applyPost, saveResume, getResume, newPersonalFeedbackMessage } from "@/services/detail";
import cookie from 'react-cookies'
import ToastStore from '@/components/toast/store'
const { toastClick } = ToastStore;
import { getStorage, setStorage } from "@/lib/base/storage";
import StoreForList from '../../../components/index_list/store';

const $store = observable({
    detailInfo: {},
    feedBackType: 0,
    fromPage: 'index',
    setFromPage: (newVal) => {
      $store.fromPage = newVal;
    },
    setFeedBackType: (newVal) => {
      $store.feedBackType = newVal;
    },
    getDetail: async type => {
        const id = Number(location.search.replace('?', ''))
        const query = {
            RecruitId: id,
            Lng: getStorage('userLocationInfo') ? getStorage('userLocationInfo').bMap_lng.toString() : StoreForList.virtualLng,
            Lat: getStorage('userLocationInfo') ? getStorage('userLocationInfo').bMap_lat.toString() : StoreForList.virtualLat,
            Address: "",
            UserSign: null
        };

        try {
            const res = await getDetail(query);
            if (res.Code === 0) {
                // 使用runInAction
                runInAction(() => {
                  gio('page.set', {
                    'pageType_pvar': '职位详情页',
                    'companyName_pvar': res.Data.EnterpriseName,
                    'postName_pvar': res.Data.ShowName
                    });
                    $store.detailInfo = res.Data
                })
            }
        } catch (e) {}
    },

    subFeedBack: async arg => {
      toastClick('正在提交...','loading','loading');
        const query = {
          RecruitId: $store.detailInfo.RecruitId,
          FeedbackType: parseInt($store.feedBackType)
        };
        try {
          const response = await newPersonalFeedbackMessage(query);
          if (response.Code === 0) {
            toastClick('提交成功','success','info');
          } else {
            toastClick(response.Desc,'warning','info');
          }
        } catch (err) {
          toastClick(err,'error','info');
        }
      },
      getApply: async arg => {
        toastClick('正在投递...','loading','loading');
          const query = {
            RecruitId: $store.detailInfo.RecruitId,
            WayType: arg.WayType,
            Lng: getStorage('userLocationInfo')
              ? `${getStorage('userLocationInfo').bMap_lng}`
              : '',
            Lat: getStorage('userLocationInfo')
              ? `${getStorage('userLocationInfo').bMap_lat}`
              : '',
            Address: getStorage('userLocationInfo')
              ? getStorage('userLocationInfo').formattedAddress
              : '',
          };
          try {
            const response = await applyPost(query);
            if (response.Code === 0) {
              toastClick('申请成功','success','info');
              if (response.Data.WayType === 1 || response.Data.WayType === 2) {
                window.location.href = `tel:${localStorage.getItem(
                  'detailCallPhone'
                )}`;
              }
            } else {
              toastClick(response.Desc,'warning','info');
            }
          } catch (err) {
            toastClick(err,'error','info');
          }
        }
}, {
    getDetail: action,
    getApply: action,
    subFeedBack: action
});

export default $store;
