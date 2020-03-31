import { action, observable, runInAction } from 'mobx';
import { collectPersonalFeedbackDataFromClinet, uploadFileToOss } from "@/services/detail";
import cookie from 'react-cookies'
import ToastStore from '@/components/toast/store'
const { toastClick } = ToastStore;
import { getStorage, setStorage } from "@/lib/base/storage";
import StoreForList from '../../../components/index_list/store';

const $store = observable({
    detailPics: [],
    ImgList: [],
    submitStatus: false,
    from: 'H5',
    setFrom: (newVal) => {
      $store.from = newVal;
    },
    setSubmitStatus: (newVal) => {
      $store.submitStatus = newVal;
    },
    setImgList: (newVal) => {
      $store.ImgList = newVal;
    },
    subFeedBack: async arg => {
      toastClick('正在提交...','loading','loading');
      const query = {
          ...arg
      };
      try {
        const response = await collectPersonalFeedbackDataFromClinet(query);
        toastClick('正在提交...','loading','loading', false);
        if (response.Code === 0) {
          $store.submitStatus = true
        } else {
          toastClick(response.Desc,'warning','info');
        }
      } catch (err) {
        toastClick(err,'error','info');
      }
    },
    // 图片上传的函数
    uploaddata : async (data) => {
        toastClick('正在上传...','loading','loading');
        const query = {
          FileData: data,
          FileType: 'image'
        }
        try {
          const response = await uploadFileToOss(query);
          if (response.Code === 0) {
            $store.ImgList.push(response.Data.FileUrl)
          } else {
            toastClick(response.Desc,'warning','info');
          }
        } catch (err) {
          toastClick(err,'error','info');
        }
    }
}, {
   subFeedBack: action,
   uploaddata: action
});

export default $store;
