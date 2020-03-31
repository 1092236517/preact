import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { route } from 'preact-router'
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';
import { time, bgps_gps } from '@/lib/base/common';
import cookie from "react-cookies"
import { isEmpty, getImgFormatUrl } from '@/lib/base/common';
import Login from '@/components/login';
import { getStorage, setStorage } from "@/lib/base/storage";
import LoginStore from '@/components/login/store';
import AMap from "@/components/amap";
import Toast from "@/components/toast";

import DetailStore from './store';

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const profileclasses = makeStyles({
    detailInfo: {
        paddingBottom: '0.5vw',
        backgroundColor: '#fff'
    },
    isHaveRisk: {
      borderRadius: '4vw',
      border:'0.3vw solid rgba(255,90,110,1)',
      display: 'flex',
      flexDirection: 'row',
      marginTop: '2vw',
      alignItems: 'center',
      color: '#FF5A6E',
      fontSize: '4vw',
      width: '100%',
    },
    isHaveRiskImg: {
      width: '5vw',
      height: '4vw',
      marginRight: '1vw',
      paddingLeft: '2vw'
    },
    backPage: {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '99',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '12vw',
        backgroundColor: '#ff0'
    },
    backImg: {
        position: 'fixed',
        top: '4vw',
        left: '4.2vw',
        width: '3vw',
        height: '4.5vw'
    },
    indexName: {
        flex: 2,
        color: '#000',
        fontWeight: '550',
        fontSize: '4.6vw',
        textAlign: 'center'
    },
    jobInfo: {
        padding: '12vw 3.6vw 3.6vw'
    },
    jobName: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '2vw',
        paddingTop: '2vw'
    },
    jobPost: {
        height: '4vw',
        color: 'rgba(20, 20, 20, 1)',
        fontWeight: '600',
        fontSize: '6.4vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        lineHeight: '4vw'
    },
    jobTime: {
        color: 'rgba(120, 120, 120, 1)',
        fontWeight: '400',
        fontSize: '4vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        lineHeight: '6vw'
    },
    jobMoney: {
        marginTop: '2.5vw',
        marginBottom: '2.2vw',
        color: '#ff0538',
        fontWeight: 'bold',
        fontSize: '5vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    },
    jobTag: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: '1.5vw',
        paddingBottom: '3vw',
        // borderBottom: '0.1vw solid rgba(240, 240, 240, 1)'
    },
    conditionCommon: {
        height: '3.2vw',
        marginRight: '1.5vw',
        padding: '0.8vw 1vw',
        color: '#6091ff',
        fontWeight: '400',
        fontSize: '3vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        lineHeight: '3.2vw',
        background: '#e5f2ff',
        borderRadius: '0.4vw'
    },
    jobRequest: {
        padding: '1vw 4.2vw 2.2vw',
        borderBottom: '0.1vw solid rgba(240, 240, 240, 1)'
    },
    pneumoniaView: {
      padding: '1vw 4.2vw 2.2vw',
      borderBottom: '0.1vw solid rgba(240, 240, 240, 1)',
      fontSize: '3.5vw',
      color: 'rgba(39, 39, 39, 1)'
    },
    pneumoniaRow: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '2vw'
    },
    requestTitle: {
        marginBottom: '2vw',
        color: 'rgba(39, 39, 39, 1)',
        fontWeight: 'bold',
        fontSize: '4vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    },
    requestName: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '2.5vw',
        color: 'rgba(39, 39, 39, 1)',
        fontWeight: '400',
        fontSize: '3.5vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        lineHeight: '5.5vw',
        whiteSpace: 'pre-wrap'
    },
    video: {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '888',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)'
    },
    videoV: {
        position: 'fixed',
        top: '30%',
        zIndex: '999',
        width: '100%',
        height: '50vw'
    },
    numImg: {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '100',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)'
    },
    workAddress: {
        marginTop: '1.5vw',
        padding: '1vw 4.2vw 6vw',
        backgroundColor: '#f9f9f9'
    },
    mapNormal: {
        width: '100%',
        height: '3.2vw',
        marginTop: '0.2vw'
    },
    allmap: {
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
    },
    addressStyle: {
        marginBottom: '3vw',
        color: 'rgba(39, 39, 39, 1)',
        fontWeight: 'bold',
        fontSize: '4vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    },
    addressDistance: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5vw'
    },
    addressInfo: {
        width: '50vw',
        color: 'rgba(39, 39, 39, 1)',
        fontWeight: '400',
        fontSize: '3.4vw',
        lineHeight: '4vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    },
    distance: {
        overflow: 'hidden',
        color: 'rgba(120, 120, 120, 1)',
        fontWeight: '400',
        fontSize: '3.4vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    jobBodyguard: {
        padding: '1.6vw 4.2vw',
        borderBottom: '0.1vw solid rgba(240, 240, 240, 1)'
    },
    bodyguardTitle: {
        paddingBottom: '1vw',
        color: '#2ba985',
        fontWeight: 'bold',
        fontSize: '3.6vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    },
    bodyguardContent: {
        marginTop: '1.5vw',
        marginBottom: '0.5vw',
        paddingLeft: '2vw',
        fontWeight: '300',
        fontSize: '3.2vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        lineHeight: '4vw'
    },
    tipDetailPhone: {
        marginLeft: '1vw',
        color: '#ff0538',
        fontWeight: 'bold',
        textDecoration: 'underline'
    },
    bottomBtn: {
        zIndex: '99999',
        display: 'flex',
        height: '15vw',
        marginBottom: '10vw'
    },
    phone: {
        width: '100%',
        color: 'black',
        fontSize: '4.2vw',
        lineHeight: '15vw',
        textAlign: 'center',
        backgroundColor: '#ff0'
    },
    post: {
        display: 'flex',
        flex: '1',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '400',
        fontSize: '4.2vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        background: '#ff6634'
    },
    emptyLine: {
        width: '100%',
        height: '15vw'
    },
    videoBox: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: '100000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  "video_v": {
    position: 'fixed',
    top: '30%',
    zIndex: '999',
    width: '100%',
    height: '100vw',
  },
  "num_img":{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: '100000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      "& img":{
        width: '80%',
        // margin-left:10%;
        // margin-top: 30%;
      }
    },
    arrimg: {
      marginTop: '3vw',
      marginBottom: '2vw',
      paddingLeft: '0.6vw',
    },
    arrimgTitle:{
      marginLeft: '3.4vw',
      color:'#272727',
      fontWeight: 'bold',
      fontSize: '4vw',
    },
    arrimgImg:{
      position: 'relative',
      zIndex: '90',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: '3vw',
      '& img':{
        width: '25vw',
        height: '25vw',
        marginBottom: '2vw',
        marginLeft: '6vw',
        borderRadius: '5%',
      }
    },
    videoTop:{
      position: 'absolute',
      top: '8vw',
      left: '8vw',
      width: '8vw !important',
      height: '8vw !important',
      opacity: '1',
    },

});

const Detail = observer(() => {
  const classes = profileclasses()

  const [initialed, setInitialed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showImg,setShowImg] = useState(false);
  const [imgNum, setImgNum] = useState('');

  const { detailInfo, getDetail, getApply } = DetailStore;
  const { showLogin, from, setShowLogin, setClickWhere } = LoginStore;

  const handleApply = useCallback(()=>{
    const detail = JSON.parse(localStorage.getItem('resumeDetail'));
    if (!detail) {
      localStorage.setItem('isFrom', 'detail');
      route('/personal');
    } else {
      // PostDetailStore.setFrom('detail')
      // 判断从首页进入简历页还是从详情进入简历页，详情进入简历页需投递简历
      _czc.push(['_trackEvent', '详情页', '申请职位'])
      getApply({ WayType: 3 });
    }
  })

  const handlePhone = useCallback((e)=>{
    // this.applyCall()
    window.location.href = `tel:${detailInfo.ContanctsPhone}`
    _czc.push(['_trackEvent', '我打岗位详情', '联系商家'])
  })

  const onVideo = useCallback(() => {
    const env = document.getElementById('search_detail')
    env.addEventListener('touchmove', (e) => {
      // 执行滚动回调
      e.preventDefault()
    }, {
      passive: false //  禁止 passive 效果
    })
    setShowVideo(true);
  })

  const offVideo = useCallback(() => {
    const env = document.getElementById('search_detail')
    env.addEventListener('touchmove', function (e) {
      e.returnValue = true
    }, false)
    setShowVideo(false);
  })

  const onImg = useCallback((id) => {
    const env = document.getElementById('search_detail')
    env.addEventListener('touchmove', (e) => {
      // 执行滚动回调
      e.preventDefault()
    }, {
      passive: false //  禁止 passive 效果
    })
    setShowImg(true);
    setImgNum(id)
  })

  const offImg = useCallback((e) => {
    const env = document.getElementById('search_detail')
    env.addEventListener('touchmove', function (e) {
      e.returnValue = true
    }, false)
    setShowImg(false);
  })


  useEffect(() => {
    if(!initialed) {
        setInitialed(true);
        getDetail();
    }
  }, [initialed]);
  // const { detailInfo } = DetailStore;

  return <div className={classes.detailInfo} id='search_detail' style={`${showLogin?'position:fixed':''}`}>
    <div className={classes.backPage}>
        <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/963b1bf6ac8c47f464c952cb6e589a88.jpg', { w: 20, h: 0 })}`} alt="周薪薪直聘" className={classes.backImg} onClick={() => {route(`/wdHome${localStorage.getItem('locationSearch')}`)}}/>
        <div className={classes.indexName}>职位详情</div>
        <div className={classes.right} />
    </div>
    <div className={classes.jobInfo}>
        <div className={classes.jobName}>
          <div className={classes.jobPost}>{detailInfo.ShowName}</div>
          <div className={classes.jobTime}>
              {time(detailInfo.RefreshTime)}
          </div>
        </div>
        {
          detailInfo.IsHaveRisk === 1 && 
          <div className={classes.isHaveRisk}>
            <img className={classes.isHaveRiskImg} src={`${optImageUrl('http://woda-app-public-test.oss-cn-shanghai.aliyuncs.com/tmp/faf51a4ba9831f59d9e53a3f8f47954a.jpg', { w: 40, h: 0 })}`} alt=''></img>
            <div>本岗位可能存在高竞争风险，请谨慎选择</div>
          </div>
        }
        <div className={classes.jobMoney}>
          {detailInfo.WagesView}{detailInfo.WagesView !== '面议' ? (detailInfo.WagesType=== 1 ? '元/月' : (detailInfo.WagesType == 2 ? '元/天' : '元/时')) : ''}
        </div>
        <div className={classes.jobTag}>
        {detailInfo &&
            detailInfo.TagNames &&
            detailInfo.TagNames.map((item, index) => (
            <div
                key={`${item}${'name'}`}
                className={classes.conditionCommon}
            >
                {item}
            </div>
            ))}
        </div>
    </div>
    {
      detailInfo.Pneumonia === 1 &&
      <div className={classes.pneumoniaView}>
        <div className={classes.pneumoniaRow}>
          <div style={{color: '#000', fontWeight: 'bold', width: '25vw'}}>开工时间：</div>
          <div style={{width: '100vw'}}>{detailInfo.StartTime}</div>
        </div>
        <div className={classes.pneumoniaRow}>
          <div style={{color: '#000', fontWeight: 'bold', width: '25vw'}}>防疫手段：</div>
          <div style={{width: '100vw'}}>{detailInfo.PreventPneumonia}</div>
        </div>
        <div className={classes.pneumoniaRow}>
          <div style={{color: '#000', fontWeight: 'bold', width: '25vw'}}>食宿福利：</div>
          <div style={{width: '100vw'}}>{detailInfo.Accommodation}</div>
        </div>
      </div>
    }
    <div className={classes.jobRequest}>
        <div className={classes.requestTitle}>职位描述</div>
        <div className={classes.requestName}>
        <div>{detailInfo && detailInfo.WorkRequire}</div>
        </div>
    </div>
    <div className={classes.jobBodyguard}>
        <div className={classes.bodyguardTitle}>猩猩小卫士</div>
        <div className={classes.bodyguardContent}>
        <span>
            该店长承诺不收取任何费用，如有疑问，请
            <a
            className={classes.tipDetailPhone}
            href={`tel:${17351420197}`}
            >
            电话客服
            </a>
        </span>
        </div>
    </div>
     <div className={classes.arrimg}>
        <div className={classes.arrimgTitle}>工作环境</div>
        <div className={classes.arrimgImg}>
        {detailInfo && detailInfo.VideoUrl && (
            <div onClick={()=>onVideo()}>
            <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/55305edd8497c556f8dae5e5acf386cb.jpg', { w: 49, h: 0 })}`} className={classes.videoTop} alt="周薪薪直聘" />
            <img
                src={`${
                detailInfo.VideoUrl
                }${'?x-oss-process=video/snapshot,t_1000,f_jpg,m_fast'}`}
                alt="周薪薪直聘"
            />
            </div>
        )}
        {detailInfo.ImageList &&
            detailInfo.ImageList.length > 0 &&
            detailInfo.ImageList.map((item, index) => (
            <div key={`${item}${'name'}`}>
                <img
                onClick={() => onImg(index)}
                src={`${optImageUrl(item, { w: 172, h: 0 })}`}
                alt="周薪薪直聘"
                />
            </div>
            ))
        }
        </div>
    </div>
    <div className={classes.workAddress}>
        <div className={classes.addressStyle}>工作地址</div>
        <div className={classes.addressDistance}>
            <div className={classes.addressInfo}>
                {detailInfo && detailInfo.WorkAddress}
            </div>
            <div className={classes.addressLength}>
                {getStorage('userLocationInfo') && detailInfo && detailInfo.Distance && (
                <div className={classes.distance}>
                    距离我
                    {Number(detailInfo.Distance) / 1000 > 1
                    ? `${(Number(detailInfo.Distance) / 1000).toFixed(1)}公里`
                    : `${Number(detailInfo.Distance).toFixed(0)}米`}
                </div>
                )}
            </div>
        </div>
        <AMap
        address={[{name:detailInfo.EnterpriseName,position:[bgps_gps(detailInfo.Longitude,detailInfo.Latitude).lng,bgps_gps(detailInfo.Longitude,detailInfo.Latitude).lat]}]}
        height="200px"
        />
    </div>
    <div className={classes.emptyLine}></div>
    <div className={classes.bottomBtn}>
        <div onClick={(e) => handlePhone(e)} className={classes.phone}>
        咨询电话
        </div>
    </div>
    {detailInfo && showVideo && detailInfo.VideoUrl &&
    <div className={classes.videoBox} onClick={()=>offVideo()} >
      <video className={classes['video_v']} controls>
        <source src={detailInfo.VideoUrl}  />
      </video>
    </div>}
    {detailInfo && detailInfo.ImageList && showImg &&
    <div onClick={() => offImg()} className={classes['num_img']} >
      <img  src={`${detailInfo.ImageList[imgNum]}`} />
      {/* <img  src={`${'http://recruit-public.oss-cn-shanghai.aliyuncs.com'}${detailInfo.ImageList[this.state.imgNum]}`} /> */}
    </div>}
    {
        showLogin && from !== 'gzh' &&
        <Login></Login>
    }
    <Toast/>
</div>;
});

export default Detail;
