import { h } from 'preact';
import { Link } from 'preact-router/match';
import { InputBase } from '@material-ui/core';
import * as styles from './style.less';
import {route} from "preact-router";

import ListStore, { TypeForGetListData } from '../wd_index_list/store';
import { getStorage, setStorage } from "@/lib/base/storage";
import ViewManagerStore from '../wd_index_list/store/view.manager';
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
  const { searchName, setSearchName, geListData, cityName, virtualCityName } = ListStore;
  // alert(`virtualCityName:${virtualCityName},cityName:${cityName}`)
  const currentCity = virtualCityName ? virtualCityName : (getStorage('userLocationInfo') ?  getStorage('userLocationInfo').district : cityName)

  const search = useCallback((type)=>{
    event.preventDefault();
    const { setBackToTop } = ViewManagerStore;
    setBackToTop(true);
    document.getElementById('searchInp').blur()
    geListData(type)
    _czc.push(['_trackEvent', 'C端首页', '通过模糊查询'])
  })
  return (
    <div className={styles.list_page}>
      <div className={styles.header}>
        <div className={styles.search_line}>
          <div className={styles.input_search}>
            <form className={styles.search_form} onSubmit={()=> {search(TypeForGetListData.Search)}} action="#">
              <input
                className={styles.search_value}
                defaultValue=""
                placeholder="疫情期间热岗"
                inputProps={{ 'aria-label': 'naked' }}
                value={searchName}
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
      </div>
    </div>
  );
})

export default Header;
