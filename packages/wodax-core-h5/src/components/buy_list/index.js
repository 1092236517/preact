import React from 'preact/compat';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';

import ListItem from '@material-ui/core/ListItem';
import Skeleton from '@material-ui/lab/Skeleton';
import { getStorage, setStorage } from "@/lib/base/storage";
import { getImgFormatUrl, isEmpty, PH, VW } from "@/lib/base/common";

import * as styles from './index.less';
import { route } from 'preact-router';
import StoreForList from './store/index';
import AdvDetailStore from '../../pages/advDetail/store';
import DetailStore from '../../pages/detail/store';
import LoginStore from '@/components/login/store';

// import Login from "../../login"
import cookie from 'react-cookies'

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

export default observer((context) => {
  // const { index, store, classes } = props
  const { setFromPage } = DetailStore
  const {geListData, ToList, isEnd, scrollTop, setScrollTop,recordIndex,setRecordIndex, setBuyListStatus, toTop, setToTop, searchName} = StoreForList;
  const [loading, setLoading] = useState(false);
  const elRef = useRef();

  const onscroll = e =>{
    e.preventDefault();
    localStorage.removeItem('buyListStatus')
    if (isEnd) {
      event.preventDefault();
    } else {
      setScrollTop(e.target.scrollTop)
      if ( !isEnd && !loading && e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 1) {
        setRecordIndex(recordIndex+10)
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem('buyListStatus')) {
      setBuyListStatus(JSON.parse(localStorage.getItem('buyListStatus')))
      elRef.current.scrollTop = scrollTop;
      setLoading(false)
    } else {
      if(!loading){
        setLoading(true)
        geListData(recordIndex === 0 ? 'search' : 'normal').then(()=>{
          setTimeout(() => {
            setLoading(false)
          }, 500);
        });
      }
    }
  },[recordIndex]);

  useEffect(()=>{
    elRef.current.scrollTop = scrollTop;
    setToTop(false)
  },[elRef,toTop])

  const toAdvDetail = useCallback((img,BrokerPhone,ManufacturingName)=>{
    AdvDetailStore.mainImg = img
    localStorage.setItem('currentAdvImg', img);
    AdvDetailStore.setBrokerPhone(BrokerPhone)
    route(`/advDetail`);
  })

  const toDetail = useCallback((id, ShowName, ShopName)=>{
    setFromPage('buy')
    route(`/detail?${id}`);
  })

  const { setShowLogin, setClickWhere } = LoginStore;

  const callEnterprise = useCallback((e, ContactsPhone, RecordId, ShopName, ShowName) => {
    e.stopPropagation();
    localStorage.setItem('detailCallPhone', ContactsPhone);
    localStorage.setItem('detailId', RecordId);
    const resume = localStorage.getItem('resumeDetail');
    if (!isEmpty(resume)) {
      // getApply({ WayType: 2 });
      window.location.href = `tel:${ContactsPhone}`
    } else {
      setShowLogin(true);
      setClickWhere('resume')
    }
  })

  const BottomDom = () => {
    if (!loading && StoreForList.ToList.length > 0  && isEnd) {
      return (
        '到底了...'
      );
    } else if (!loading && StoreForList.ToList.length === 0  && isEnd) {
      return (
        '暂无数据...'
      );
    } else if (loading && StoreForList.ToList.length > 0){
      return (
        <div style={{display: 'flex',flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
          <img src={'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/e083a050268bca744b7fca5df8acd790.jpg'} style={{width: '5vw',height: '5vw',zIndex: '10',marginRight: '2vw'}}/>
          <div>加载中...</div>
        </div>
      );
    }

  };
  return (
    <div className={styles.listBox} ref={elRef} onScroll={onscroll}>
      <div style={{minHeight:'101%'}} >
        {
          ToList.length === 0 && loading &&
          <div>
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                marginTop: "40vw",
                textAlign: 'center',
                color: '#777777'
              }}
            >
              <div style={{ fontSize: "6vw" }}>
                数据加载中...
              </div>
            </div>
          </div>
        }
        {
          ToList.length>0 && ToList.map((dataItem,index)=> {
            const {
              Type
            } = dataItem;
            if (Type === 1) {
              const {
                RecordId,
                ListBgPic,
                ManufacturingName,
                Description,
                Tags,
                Salary,
                DetailsUrl,
                BrokerPhone,
                Type
              } = dataItem;
              return (
                <ListItem key={index} className={styles.listItem} onClick={() => toAdvDetail(DetailsUrl, BrokerPhone, ManufacturingName)}>
                  <div className={styles.manufacturing_modal} key={RecordId}>
                    {!isEmpty(ListBgPic) ? (
                      <img
                        src={`${optImageUrl(ListBgPic, {w: 414, h: 0})}`}
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
              )
            } else {
              const {
                RecordId,
                ShowName,
                ImgUrl,
                ShopName,
                TagNames,
                WagesView,
                Distance,
                ContactsPhone,
                WagesType,
                ApplyRecruitTime
              } = dataItem;
              return (
                <ListItem key={index} className={styles.listItem} onClick={() => toDetail(RecordId, ShowName, ShopName)}>
                  <div className={styles.job_item} key={RecordId}>
                    <div className={styles.job_left}>
                      <div className={styles.job_name}>{ShowName}</div>
                      <div className={styles.tags_list}>
                        {TagNames.length > 0 && TagNames.split(",").slice(0, 3).map((tagItem, tagIndex) => (
                          <div className={styles.tag} key={tagIndex}>
                            {tagItem}
                          </div>
                        ))}
                      </div>
                      <div className={styles.enterprise_info}>
                        <div className={styles.enterprise_name}>
                          {`${ApplyRecruitTime.substring(0, 10)} 申请`}
                        </div>
                      </div>
                    </div>
                    <div className={styles.job_right}>
                      <div className={styles.job_salary}>
                        {WagesView}{WagesView !== '面议' ? (WagesType === 1 ? '元/月' : (WagesType == 2 ? '元/天' : '元/时')) : ''}
                      </div>
                      <div
                        className={styles.call_enterprise}
                        onClick={(e) => callEnterprise(e, ContactsPhone, RecordId, ShopName, ShowName)}
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
                          {/* <img
                            src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/682f9c174117c42323ebc4c82569455f.jpg', {
                              w: 64,
                              h: 0
                            })}`} alt="周薪薪直聘"/> */}
                        </div>
                      }
                    </div>
                  </div>
                </ListItem>
              )
            }

          })
        }
        <div className={styles.footer} style={{textAlign: 'center',height:"40px", lineHeight: '40px'}}>
          <BottomDom />
        </div>
      </div>
    </div>


  )
});
