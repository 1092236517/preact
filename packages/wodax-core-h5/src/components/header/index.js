import { h } from 'preact';
import { Link } from 'preact-router/match';
import { InputBase } from '@material-ui/core';
import * as styles from './style.less';
import {route} from "preact-router";

import ListStore, { TypeForGetListData } from '../list/store';
import { getStorage, setStorage } from "@/lib/base/storage";
import Input from "@material-ui/core/Input";
import React from "preact/compat";
import {observer} from "mobx-react-lite";
import {useCallback} from "preact/hooks";
import { getImgFormatUrl } from "@/lib/base/common";


const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const Header = observer(() => {
  const { searchName, setSearchName, geListData, cityName, virtualCityName, setToTop, setScrollTop, ToList } = ListStore;
  // alert(`virtualCityName:${virtualCityName},cityName:${cityName}`)
  const currentCity = virtualCityName ? virtualCityName : (getStorage('userLocationInfo') ?  getStorage('userLocationInfo').district : cityName)

  const search = useCallback((type)=>{
    event.preventDefault();
    document.getElementById('searchInp').blur()
    geListData(type)
    setToTop(true)
    setScrollTop(0)
    _czc.push(['_trackEvent', 'C端首页', '通过模糊查询'])
  })

  const onfocus = useCallback(()=> {
    gio('track','searchboxClick')
  })

  return (
    <div className={styles.list_page}>
      <div className={styles.header}>
        {/* <div className={styles.location} onClick={() => {route('/location')}}>
          <div>{currentCity}</div>
           <img src={`${optImageUrl('http://woda-app-public-test.oss-cn-shanghai.aliyuncs.com/tmp/6575af268cf43f7780d9afc753716969.jpg', { w: 28, h: 0 })}`} alt="周薪薪直聘" />
        </div> */}
        <div className={styles.title}>
          <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/e1c2f97330e4ad0408977c1fd5060ccf.jpg', { w: 60, h: 0 })}`} className={styles.logo} alt="周薪薪直聘" />
          <div className={styles.name}>周薪薪直聘</div>
        </div>
        <div className={styles.pneumoniaView}>
          <div className={styles.search_line}>
            <div className={styles.input_search}>
              <form className={styles.search_form} onSubmit={()=> {search(TypeForGetListData.Search)}} action="#">
                <div className={styles.currentCity} onClick={() => {route('/location')}}>
                  {currentCity}
                </div>
                <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/3cf0d5de7cf1f3729a7c5de0228805d6.jpg', { w: 21, h: 0 })}`} className={styles.down} />
                <input
                  className={styles.search_value}

                  defaultValue=""
                  placeholder="服务员 / 网管"
                  inputProps={{ 'aria-label': 'naked' }}
                  value={searchName}
                  onChange={(e)=>{setSearchName(e.target.value)}}
                  onfocus={() =>{onfocus()}}
                  id="searchInp"
                  type="search"
                />
                <img
                  className={styles.search_icon}
                  alt="周薪薪直聘"
                  // onClick={this.searchList}
                  src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/87e6b51b801154618cbb09fefb3b2f80.jpg', { w: 40, h: 0 })}`}
                  onClick={()=> {search(TypeForGetListData.Search)}}
                />
              </form>
            </div>
          </div>
        </div>
        </div>
        {/* <div className={styles.search_line}>
          <div className={styles.input_search}>
            <form className={styles.search_form} onSubmit={()=> {search(TypeForGetListData.Search)}} action="#">
              <InputBase
                className={styles.search_value}
                defaultValue=""
                placeholder="服务员"
                inputProps={{ 'aria-label': 'naked' }}
                value={myName}
                onChange={(e)=>{setSearchName(e.target.value)}}
                id="searchInp"
                type="search"
              />
              <img
                className={styles.search_icon}
                alt="周薪薪直聘"
                // onClick={this.searchList}
                src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/87e6b51b801154618cbb09fefb3b2f80.jpg', { w: 40, h: 0 })}`}
                onClick={()=> {search(TypeForGetListData.Search)}}
              />
            </form>
          </div>
        </div>
      </div> */}
    </div>
  );
})

export default Header;
