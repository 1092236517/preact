import React, { useMemo } from 'preact/compat';
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { Virtuoso } from 'wodax-react-virtuoso-ex';

import StoreForList from '../store';
import ViewManagerStore from '../store/view.manager';

import useStyles from '../style'
import ListViewItem, { renderSkeletonItem } from './item.component';
import { toJS } from "mobx";

import { VW } from '@/lib/base/common'

export default observer(( props, context ) => {
  const classes = useStyles();
  const { geListData, isEnd } = StoreForList;
  const { getRecoverInfo, recordLastRenderList, cachePreRenderedList, cachePreLastScrollTop, disableReloadMoreData, reload, setReload, backToTop, setBackToTop } = ViewManagerStore;

  // 状态/引用
  const [initialed, setInitialed] = useState(false);
  const [height, setHeight] = useState(0);

  const virtuosoRef = useRef(null);
  const virtuosoForRetinaRef = useRef(null);
  const elRef = useRef(null);
  const ref = useCallback(
    (theRef) => {
      if (theRef) {
        window.addEventListener('resize', onResize, { passive: true, capture: true });
        elRef.current = theRef
      } else {
        window.removeEventListener('resize', onResize);
      }
    },
    [elRef]
  );

  const onResize = useCallback(() => {
    setHeight(helper._getViewPortHeight());
  }, [elRef]);

  const loading = useRef(false);
  const loadMore = useCallback(() => {
    if (loading.current || (StoreForList.ToList.length < 10 && StoreForList.ToList.length > 0)) {
      return;
    }

    (async () => {
      loading.current = true;
      // window.ontouchmove=function(e){
      //     e.preventDefault && e.preventDefault();
      //     e.returnValue=false;
      //     e.stopPropagation && e.stopPropagation();    return false;
      // };
      await geListData('normal');
      loading.current = false;
    })();
  }, [loading, elRef, virtuosoRef]);

  const hideRetainView = useCallback(()=> {
    if(virtuosoForRetinaRef.current) {
      virtuosoForRetinaRef.current.base.hidden = true;
    }
    if(virtuosoRef.current) {
      virtuosoRef.current.base.style['z-index']= 0;
      // virtuosoRef.current.base.style['scroll-behavior']= 'smooth';
    }
  }, [elRef, virtuosoRef]);

  const autoCheckRecover = useCallback((haveRenderItems)=> {
    const { preRenderedList, recoverStart } = ViewManagerStore;
    const recoverInfo = getRecoverInfo();
    const { enableRecover, itemIndex, scrollTop} = recoverInfo;


    if (enableRecover && virtuosoRef.current && haveRenderItems.length > 0) {
      let canReset = virtuosoRef.current.base.scrollTop !== scrollTop;
      canReset = canReset && (scrollTop !== 0);
      canReset = canReset && (haveRenderItems.length >= Math.max(1, toJS(preRenderedList).length - 1)); // 容差范围内

      if (canReset) {
        recoverStart();
        virtuosoRef.current.scrollToPos({top: scrollTop, left: 0, behavior: 'auto'});
      }

    }
  }, [initialed, elRef, virtuosoRef]);

  useEffect(() => {
    if (!initialed) {
      setInitialed(true);
      onResize();
      const { enableReloadMore } = ViewManagerStore;
      if (enableReloadMore) {
        loadMore();
      }
    }
  }, [initialed, elRef]);

  useEffect(() => {
    return (()=> {
      if (elRef) {
        // TODO: 需要存储到store中相关的数据，例如：滚动的位置及滚动的Item位置等
        // 处理恢复
        const { ToList: allItems } = StoreForList;
        const { lastRenderList, recoverNexTime, isRecovering } = ViewManagerStore;
        if(!isRecovering()) {
          cachePreRenderedList(lastRenderList, allItems);
          cachePreLastScrollTop(virtuosoRef.current.base.scrollTop);
        }
        recoverNexTime();

        // 页面离开后，如果已经有很多数据了，(应要求切换回来之后，不向服务器再请求数据了)，有助于节省带宽
        if (allItems.length > 0) {
          disableReloadMoreData();
        }
      }
    })
  }, [elRef]);

  useEffect(() => {
    if(backToTop) {
      virtuosoRef.current.scrollToPos({top: 0, left: 0, behavior: 'auto'});
      setBackToTop(false)
    }
  }, [backToTop])


  /////////////////////////////
  // 封装Helper
  ////////////////////////////
  const helper = useMemo(() => {
    return {
    _getViewPortHeight: () => {
      let height = 0;
      const bottom = window.document.querySelector('.MuiBottomNavigation-root');
      if (bottom) {
        height = window.innerHeight - window.document.querySelector('.MuiBottomNavigation-root').offsetHeight - 36*VW;
      } else {
        height = window.innerHeight - 65  - 51*VW;
      }

      return height;
    },

    _getOverScanCount: () => {
      const { ToList: allItems } = StoreForList;
      // TODO: 可以根据网络环境，变更OverScanCount的数量
      return Math.max(12, allItems.length);
    },

    _noRowsRenderer: () => {
      return (
        <div className={classes.footer} style={{textAlign: 'center'}}>
          { loading.current && StoreForList.ToList.length > 0  && `加载中...` }
          { !loading.current && StoreForList.ToList.length > 0  && isEnd && `到底了...` }
          { !loading.current && StoreForList.ToList.length === 0  && isEnd && `暂无数据` }
        </div>
      )
    },

    _reLoadRenderer: () => {
      return (
        <div className={classes.reload} style={{ padding: '2rem', textAlign: 'center'}}>
          重新加载...
        </div>
      )
    },

    _loadNew: ({touchMoveDistance, scrollTop}) => {
      if(touchMoveDistance > 0 && scrollTop === 0) {
        setReload(true);
        (async () => {
          loading.current = true;
          await geListData('search');
          loading.current = false;
          setReload(false);
        })();
      }
    },

    _makeRenderRowFunc: (index, store) => {
      // 子组件渲染处理
      const classes = useStyles();
      const handler = (_index, _store, _classes) => (
        <ListViewItem
          index={_index}
          store={_store}
          classes={_classes}
        />
      );
      return handler(index, store, classes)
    },

    _renderRow: index => {
      return helper._makeRenderRowFunc(index, StoreForList);
    },

    _renderRetinaRow: index => {
      const { preSliceDataList } = ViewManagerStore;
      return helper._makeRenderRowFunc(index, {ToList: preSliceDataList});
    },

    _itemsHaveRendered: (list) => {
      recordLastRenderList(list);
      // 检测自动恢复
      autoCheckRecover(list)
    },

    _itemsLastRendered: (list) => {
      // console.log(`_itemsLastRendered`, list)
      // recordLastRenderList(list);
      // 检测自动恢复
      // autoCheckRecover(list)
    },

    _loadMore: () => {
      loadMore('normal')
    },

    _onScrollEventChange: (event) => {
      // console.log(`!!!!!!!!!!!`, event)
    },

    _onScrollChange: ({ isScrolling, scrollingTop}) => {
      // console.log(`---------->`, { isScrolling, scrollingTop})
    },

    _onQuickScrollingStateChange: ({state, scrollTop}) => {
      const { isRecovering, recoverFinished, recoverNexTime } = ViewManagerStore;
      // console.log(`_onQuickScrollingStateChange`, {state, scrollTop}, {isRecovering: isRecovering()});
      if (isRecovering()) { // 正在恢复中
        if(state === 0) {
        } else if (state === 1){
        } else if (state === 2){
        } else if (state === 3) { // 恢复结束，转入空闲
          hideRetainView();
          recoverFinished();
        } else if (state === 4) { // 恢复结束，转入空闲
          hideRetainView();
          recoverNexTime();
        }
      }
    }
  }}, [loading, isEnd]);

  /////////////////////////////
  // 渲染内容
  ////////////////////////////
  const { ToList: allItems } = StoreForList;

  const viewForReallyData = (styles={}) => {
    const recoverInfo = getRecoverInfo();
    const {
      enableRecover,
      scrollTop: recoverScrollTop,
      itemIndex: recoverIndex,
      itemCount: maybeRenderItemCount,
    } = recoverInfo;

    let rest =  {};
    if (enableRecover) {
      rest = { initialScrollToPos: {
          top: recoverScrollTop,
          index: recoverIndex,
          maybeRenderItemCount
        }};
    }

    return (
      <Virtuoso
        ref={virtuosoRef}
        style={{ width: `100%`, height: `${height}px`, ...styles }}
        totalCount={toJS(allItems).length}
        scrollTop={recoverScrollTop}
        scrollingStateChange={helper._onScrollChange}
        scrollEventChange={helper._onScrollEventChange}
        quickScrollingStateChange={helper._onQuickScrollingStateChange}
        item={helper._renderRow}
        itemsRendered={helper._itemsHaveRendered}
        itemsLastRendered={helper._itemsLastRendered}
        // startReached={helper._loadNew}
        endReached={helper._loadMore}
        footer={helper._noRowsRenderer}
        {...rest}
      />
    )
  };

  const viewRetinaForRecoverData = (styles={}) => {
    const recoverInfo = getRecoverInfo();
    const { itemCount: maybeRenderItemCount } = recoverInfo;

    return (
      <Virtuoso
        ref={virtuosoForRetinaRef}
        style={{ width: `100%`, height: `${height}px`, ...styles }}
        totalCount={maybeRenderItemCount}
        item={helper._renderRetinaRow}
      />
    )
  };

  const combineView = () => {
    const recoverInfo = getRecoverInfo();
    const { enableRecover, scrollTop } = recoverInfo;
    return enableRecover ? (
      <>
        {/* { viewRetinaForRecoverData() } */}
        { viewForReallyData({ zIndex: 0, scrollBehavior:'auto' }) }
      </>
    ) : (
      <>
        { reload && helper._reLoadRenderer() }
        { viewForReallyData()}
      </>
    );
  };

  return (
    <div ref={ref} className={classes.index_list}>
      {initialed && allItems.length === 0 && !isEnd ? (
        Array(5).fill(0).map((item, index) => {
          return renderSkeletonItem();
        })
      ) : (combineView())}
    </div>
  );
});
