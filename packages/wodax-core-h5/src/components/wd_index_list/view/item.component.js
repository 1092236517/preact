import React from 'preact/compat';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';

import ListItem from '@material-ui/core/ListItem';
import Skeleton from '@material-ui/lab/Skeleton';
import { getStorage, setStorage } from "@/lib/base/storage";
import { getImgFormatUrl, isEmpty, PH, VW } from "@/lib/base/common";

import * as styles from './item.component.less';
import { route } from 'preact-router';
import AdvDetailStore from '../../../pages/wdAdvDetail/store';
import DetailStore from '../../../pages/wdDetail/store';
import LoginStore from '@/components/login/store';

// import Login from "../../login"
import cookie from 'react-cookies'

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

export const renderSkeletonItem = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        marginTop: "5vw",
        marginLeft: "10vw"
      }}
    >
      <div style={{ display: "flex" }}>
        <Skeleton variant="circle" width={10 * VW} height={10 * VW} />
        <Skeleton
          variant="rect"
          style={{ marginLeft: "5vw" }}
          width={65 * VW}
          height={10 * VW}
        />
      </div>
      <Skeleton
        variant="rect"
        style={{ marginTop: "5vw" }}
        width={80 * VW}
        height={20 * VW}
      />
    </div>
  );
};

const _renderSubItemWithType0 = ({ dataItem, index, context }) => {
  const {
    RecordId,
    ShowName,
    ImgUrl,
    ShopName,
    TagNames,
    WagesView,
    Distance,
    ContactsPhone,
    WagesType
  } = dataItem;

  const { store: AppStore } = context;
  const { changeActiveTab, hideBottomTabs } = AppStore;
  const { getApply } = DetailStore;
  const { setShowLogin, setClickWhere } = LoginStore;

  const toDetail = useCallback((id)=>{
    _czc.push(['_trackEvent', 'C端首页', '点击商家详情'])
    route(`/wdDetail?${id}`);
  })

  const callEnterprise = useCallback((e, ContactsPhone,RecordId) => {
    _czc.push(['_trackEvent', '我打首页', '咨询电话'])
    e.stopPropagation();
    window.location.href = `tel:${ContactsPhone}`
  })

  return (
    <ListItem key={index} className={styles.listItem} onClick={() => toDetail(RecordId)}>
      <div className={styles.job_item} key={RecordId}>
        <div className={styles.job_left}>
          <div className={styles.job_name}>{ShowName}</div>
          <div className={styles.tags_list}>
            {TagNames.length > 0 && TagNames.split(",").slice(0,3).map((tagItem, tagIndex) => (
              <div className={styles.tag} key={tagIndex}>
                {tagItem}
                </div>
              ))}
            </div>
            <div className={styles.enterprise_info}>
              {!isEmpty(ImgUrl) ? (
                <img
                  src={`${optImageUrl(ImgUrl, { w: 64, h: 0 })}`}
                  className={styles.enterprise_logo}
                  alt="周薪薪直聘"
                />
              ) : null}
              <div className={styles.enterprise_name}>
                {ShopName.length > 13
                  ? `${ShopName.substring(0, 10)}...`
                  : ShopName}
              </div>
            </div>
          </div>
          <div className={styles.job_right}>
            <div className={styles.job_salary}>
              {WagesView}{WagesView !== '面议' ? (WagesType=== 1 ? '元/月' : (WagesType == 2 ? '元/天' : '元/时')) : ''}
            </div>
            <div
              className={styles.call_enterprise}
              onClick={(e) => callEnterprise(e, ContactsPhone,RecordId)}
            >
              咨询电话
            </div>
            {
              getStorage('userLocationInfo') && Distance &&
              <div className={styles.distance_model}>
                <div className={styles.distance}>
                  {Distance / 1000 > 1
                    ? `${(Distance / 1000).toFixed(1)}公里`
                    : `${Distance.toFixed(0)}米`}
                </div>
                <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/682f9c174117c42323ebc4c82569455f.jpg', { w: 64, h: 0 })}`} alt="周薪薪直聘" />
              </div>
            }
          </div>
        </div>
      </ListItem>
  );
};

const _renderSubItemWithType1 = ({ dataItem, index, context}) => {
  const { store: AppStore } = context;
  const { hideBottomTabs } = AppStore;
  const {
    RecordId,
    ListBgPic,
    ManufacturingName,
    Description,
    Tags,
    Salary,
    DetailsUrl,
    BrokerPhone
  } = dataItem;

  const toAdvDetail = useCallback((img,BrokerPhone)=>{
    AdvDetailStore.mainImg = img
    localStorage.setItem('currentAdvImg', img);
    AdvDetailStore.setBrokerPhone(BrokerPhone)
    route(`/wdAdvDetail`);
    _czc.push(['_trackEvent', 'C端首页', '点击制造业详情'])
  })

  return (
    <ListItem key={index} className={styles.listItem} onClick={() => toAdvDetail(DetailsUrl,BrokerPhone)}>
      <div className={styles.manufacturing_modal} key={RecordId}>
        {!isEmpty(ListBgPic) ? (
          <img
            src={`${optImageUrl(ListBgPic, { w: 414, h: 0 })}`}
            className={styles.manufacturing_img}
            alt="周薪薪直聘"
          />
        ) : null}
        <div className={styles.manufacturing_name}>{ManufacturingName}</div>
        <div className={styles.manufacturing_description}>{Description}</div>
        <div className={styles.manufacturing_tags}>
          <div className={styles.tag}>{Tags.split(",")[0]}</div>
          <div className={styles.tag}>{Tags.split(",")[1]}</div>
        </div>
        <div className={styles.manufacturing_salary}>
          <div>{Salary.split(",")[0]}</div>
          <div>{Salary.split(",")[1]}</div>
        </div>
      </div>
    </ListItem>
  );
};

export default observer(( props, context ) => {
  const { index, store, classes } = props
  let renderHandler = renderSkeletonItem;
  try {
    const { ToList } = store;
    if(ToList.length === 0) {
      renderHandler = <span>AAAA</span>
    } else {
      const dataItem = ToList[index];
      if (dataItem) {
        const { Type } = dataItem;
        renderHandler =
          Type === 1 ? _renderSubItemWithType1 : _renderSubItemWithType0;
  
        return renderHandler({
          dataItem: dataItem,
          index: index,
          context
        });
      }
    }
   
  } catch (e) {
    console.error(e);
  }
  return renderHandler();
});
