import { action, observable, runInAction } from 'mobx';

export const TRecoveringState = {
  WORKING: 1,
  IDLE: 2
};


const $store = observable({
  // 优化加载更多的处理标记
  enableReloadMore: true,
  disableReloadMoreData: () => {
    $store.enableReloadMore = false
  },

  // 记录当前渲染的信息
  lastRenderList: [],
  recordLastRenderList: (renderList) => {
    $store.lastRenderList = renderList;
  },
  // 前一次的渲染列表
  preRenderedList: [],
  preSliceDataList: [],
  cachePreRenderedList: (newVal, bigDataList) => {
    $store.preRenderedList = newVal;
    $store.preSliceDataList = [];
    const preIndexs = (newVal || []).map((ele) => {
      return ele.index;
    });
    bigDataList.forEach((ele, index) => {
      if (preIndexs.includes(index)) {
        $store.preSliceDataList.push(ele)
      }
    })
  },
  // 记录滑动/滚动的信息
  preLastScrollTop: 0,
  cachePreLastScrollTop: (newVal) => {
    $store.preLastScrollTop = newVal
  },
  backToTop: false,
  setBackToTop: (val) => {
    $store.preLastScrollTop = 0;
    $store.resetData()
    $store.backToTop = val;
  },  
  recoveringState: TRecoveringState.IDLE,
  enableRecover: false,
  recoverNexTime: () => {
    $store.enableRecover = $store.preLastScrollTop >0 && $store.preRenderedList.length > 0;
  },
  recoverStart:() => {
    $store.recoveringState = TRecoveringState.WORKING;
  },
  recoverFinished: () => {
    $store.recoveringState = TRecoveringState.IDLE;
    $store.preLastScrollTop = 0;
    $store.preRenderedList = [];
  },
  isRecovering: () => {
    return $store.recoveringState === TRecoveringState.WORKING
  },
  resetData: () => {
    $store.preLastScrollTop = 0;
    $store.enableRecover = false;
    $store.preRenderedList = [];
  },  

  // 获得重新恢复列表状态的信息
  getRecoverInfo: () => {
    const curEnable = ($store.preLastScrollTop > 0 && $store.preRenderedList.length > 0);
    let enable = $store.enableRecover || curEnable;
    let itemIndex = 0;
    let retinaViewScrollTop = 0;

    if ($store.preRenderedList.length > 0) {
      const item = $store.preRenderedList[0];
      const { index, offset } = item;
      itemIndex = index;
      retinaViewScrollTop = $store.preLastScrollTop - offset;
    }

    return {
      enableRecover: enable,
      scrollTop: $store.preLastScrollTop,
      itemIndex,
      itemCount: $store.preRenderedList.length,
      items:$store.preRenderedList,
      retinaViewScrollTop
    }
  },
  reload:false,
  setReload: (val) => {
    $store.reload = val;
  },  
}, {
  disableReloadMoreData: action,
  recordLastRenderList: action,
  cachePreRenderedList: action,
  cachePreLastScrollTop: action,
  getRecoverInfo: action,
  recoverNexTime: action,
  recoverStart: action,
  recoverFinished: action,
  isRecovering: action,
  setReload: action
});

export default $store;
