// Enable Debug
// Must be the first import
if (process.env.NODE_ENV === "development") {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require("preact/debug");
}

import { Component } from "preact";
import { useState, useEffect, useCallback } from "preact/hooks";
import { Router } from "preact-router";
import ListStore from "./components/index_list/store";

// 内置Store
import { useLocalStore, observer  } from "mobx-react-lite";

import Provider, { MergingProvider } from "@/lib/base/context-provider";

import TabBar, { getTabIndexByRoutePattern } from "@/components/tab_bar"

// var EventEmitter = require('wolfy87-eventemitter');

// 各个路由页面
// Code-splitting is automated for routes
import Home from "@/pages/home";
import WdHome from "@/pages/wdHome";
import WdDetail from "@/pages/wdDetail";
import WdAdvDetail from "@/pages/wdAdvDetail";
import Profile from "@/pages/profile";
import Detail from "@/pages/detail";
import AdvDetail from "@/pages/advDetail";
import Personal from '@/pages/personal/view';
import Location from '@/pages/location';
import FeedBack from '@/pages/feedBack';
import BuyResume from '@/pages/buyResume';
import PersonalJob from '@/pages/personalJob';
// import Toast, {handleClick} from '@/components/toast';

// var ee = new EventEmitter();
// ee.addListener('Toast', handleClick);
// ee.emitEvent('Toast');
/**
 * Main App
 */
const MainApp = observer((props, context) => {
  const [initialed, setInitialed] = useState(false);

  const { store: AppStore } = context;
  const { changeActiveTab, bottomTabsIsHide, hideBottomTabs } = AppStore;

  const { wxShareConfig } = ListStore

  useEffect(() => {
    if (!initialed) {
      setInitialed(true)
      wxShareConfig()
    }
  }, [initialed]);

  useEffect(() => {
    return (()=> {
      // Note: 哪些资源不需要，可以释放了
    })
  }, []);

  const handleRoute = useCallback((e) => {
    const curActiveTab = getTabIndexByRoutePattern(e.url)
    if (curActiveTab > -1) {
      changeActiveTab(curActiveTab)
    }

    if (e.url.indexOf('/detail') > -1 || e.url.indexOf('/advDetail') > -1 || e.url.indexOf('/feedBack') > -1 || e.url.indexOf('/location') > -1 || e.url.indexOf('/wdHome') > -1 || e.url.indexOf('/wdDetail') > -1 || e.url.indexOf('/wdAdvDetail') > -1 || e.url.indexOf('/buyResume') > -1 || e.url.indexOf('/personalJob') > -1) {
      hideBottomTabs(true)
    } else {
      hideBottomTabs(false)
    }
  }, [initialed]);


  return (
    <div id="app">
      {/* <Header /> */}
      <Router onChange={handleRoute}>
          <Home path="/" />
          <WdHome path="/wdHome/" />
          <WdDetail path="/wdDetail/" />
          <WdAdvDetail path="/wdAdvDetail/" />
          <Profile path="/profile/" />
          <Personal path="/personal/" />
          <Detail path="/detail/" />
          <AdvDetail path="/advDetail/" />
          <Location path="/location/" />
          <FeedBack path="/feedBack/" />
          <BuyResume path="/buyResume/" />
          <PersonalJob path="/personalJob/" />
      </Router>
      { !bottomTabsIsHide ? <TabBar/> : null }
      {/* <Bottom /> */}
    </div>
  )
});


/**
 * Main App Connector
 */
const AppConnector = () => {
  // 使用Hook中定义Store的方式
  const store = useLocalStore(() => (
    {
      // 存储底部TarBar的数据
      activeTab: 0,
      changeActiveTab(tabIndex) {
        store.activeTab = tabIndex
      },

      bottomTabsIsHide: false,
      hideBottomTabs(newVal){
        store.bottomTabsIsHide = newVal
      }
    }
  ));


  // 使用 Context 方式传递给子孙组件相关内容
  return (
    <Provider store={store}>
      <MergingProvider>
        <MainApp />
      </MergingProvider>
    </Provider>
  );
};

export default AppConnector;
