import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
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
import ToastStore from '@/components/toast/store'
const { toastClick } = ToastStore;

import DetailStore from './store';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
        background: 'linear-gradient(135deg,rgba(255,227,0,1) 0%,rgba(255,218,0,1) 100%)'
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
        color: '#f95e5a',
        fontSize: '4vw',
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
        marginRight: '3vw',
        padding: '1.5vw 1.5vw',
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
        marginTop: '3vw',
        marginBottom: '2vw',
        color: 'rgba(39, 39, 39, 1)',
        fontWeight: 'bold',
        fontSize: '5vw',
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
        padding: '1vw 4.2vw 6vw'
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
      marginTop: '3vw',
        marginBottom: '3vw',
        color: 'rgba(39, 39, 39, 1)',
        fontWeight: 'bold',
        fontSize: '5vw',
        marginTop: '3vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    },
    addressDistance: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5vw'
    },
    addressInfo: {
        width: '50vw',
        color: '#7F7F7F',
        fontWeight: '600',
        fontSize: '3.4vw',
        lineHeight: '4vw',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    },
    distance: {
        overflow: 'hidden',
        color: '#7F7F7F',
        fontWeight: '600',
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
        color: '#0978E3',
        fontWeight: 'bold',
    },
    bottomBtn: {
        position: 'fixed',
        right: '0',
        bottom: '0',
        left: '0',
        zIndex: '99999',
        display: 'flex',
        height: '15vw'
    },
    phone: {
        width: '50%',
        color: '#fff',
        fontSize: '4.2vw',
        lineHeight: '15vw',
        textAlign: 'center',
        backgroundColor: 'rgba(204, 95, 22, 0.980392156862745)'
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
        backgroundColor: 'rgba(2, 167, 240, 1)'
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
      fontSize: '5vw',
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
    mask: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:'rgba(155,155,155,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      zIndex: 99
    },
    maskContent: {
      width: '85vw',
      background: '#fff',
      borderRadius: '5px',
      zIndex: 100,
      position: 'relative'
    },
    maskTitle: {
      width: '100%',
      height: '12vw',
      lineHeight: '12vw',
      textAlign: 'center',
      fontSize: '5vw',
      borderBottom: '1px solid rgba(228, 228, 228, 1)'
    },
    redFont: {
      width: '100%',
      fontSize: '3vw',
      color: '#D9001B',
      textIndent: '3vw'
    },
    subBtn: {
      color: '#fff',
      width: '24vw',
      height: '10vw',
      lineHeight: '10vw',
      backgroundColor: '#02a7f0',
      textAlign: 'center',
      margin: '0 auto',
      marginBottom: '3vw',
      marginTop: '3vw',
      borderRadius: '3px'
    },
    checkView: {
      padding: '3vw 6vw'
    },
    root: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    icon: {
      borderRadius: 3,
      width: 16,
      height: 16,
      boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
      backgroundColor: '#f5f8fa',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
      '$root.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
      },
      'input:hover ~ &': {
        backgroundColor: '#ebf1f5',
      },
      'input:disabled ~ &': {
        boxShadow: 'none',
        background: 'rgba(206,217,224,.5)',
      },
    },
    checkedIcon: {
      backgroundColor: '#137cbd',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
      '&:before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
          " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
          "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
      },
      'input:hover ~ &': {
        backgroundColor: '#106ba3',
      },
    },
});

const Detail = observer(() => {
  const classes = profileclasses()

  const [initialed, setInitialed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showFeedBack, setShowFeedback] = useState(false);
  const [showImg,setShowImg] = useState(false);
  const [imgNum, setImgNum] = useState('');

  const [value, setValue] = useState(-1);

  const { detailInfo, getDetail, getApply, setFeedBackType, subFeedBack, fromPage } = DetailStore;
  const { showLogin, from, setShowLogin, setClickWhere } = LoginStore;

  const handleChange = event => {
    setValue(event.target.value);
    // for (let i = 0; i < state.length; i++) {
    //   if (state[i] === true) {
    //     setFeedBackType(i + 1)
    //   }
    // }
  };

  const handleApply = useCallback(()=>{
    const detail = JSON.parse(localStorage.getItem('resumeDetail'));
    gio('track','applyPositionClick',{
      'companyName_var': detailInfo.EnterpriseName,
      'postName_var': detailInfo.ShowName,
      'buttonName_var':'申请职位'})
    if (!detail) {
      localStorage.setItem('isFrom', 'detail');
      const personalFrom = {
        page: '岗位详情页',
        button: '申请职位'
      }
      localStorage.setItem('personalFrom', JSON.stringify(personalFrom));
      route('/personal');
    } else {
      // PostDetailStore.setFrom('detail')
      // 判断从首页进入简历页还是从详情进入简历页，详情进入简历页需投递简历
      _czc.push(['_trackEvent', '详情页', '申请职位'])
      gio('track','applyPositionSucess',{
        'companyName_var': detailInfo.EnterpriseName,
        'postName_var': detailInfo.ShowName,
        'buttonName_var':'申请职位'})
      getApply({ WayType: 3 });
    }
  })
  
  const stop = useCallback((e)=>{
    e.stopPropagation();
  })

  const subFeedBackAction = useCallback((e)=>{
    e.stopPropagation();
    if (value === -1) {
      toastClick('请选择反馈原因','warning','info');
    } else {
      setFeedBackType(value)
      subFeedBack()
      setShowFeedback(false)
    }
  })

  const hideFeedBackView = useCallback((e)=>{
    setShowFeedback(false)
  })

  const showFeedBackView = useCallback((e)=>{
    const detail = JSON.parse(localStorage.getItem('resumeDetail'));
    if (isEmpty(cookie.load('userPhone')) && from !== 'gzh' && !detail) {
      setClickWhere('resume')
      setShowLogin(true)
      return
    } else {
      setShowFeedback(true)
    }
  })

  const handlePhone = useCallback((e)=>{
    gio('track','phoneClick',{
      'pageType_var':'岗位详情页',
      'companyName_var': detailInfo.EnterpriseName,
      'postName_var': detailInfo.ShowName,
      'buttonName_var':'咨询电话'})
    const detail = JSON.parse(localStorage.getItem('resumeDetail'));
    if (isEmpty(cookie.load('userPhone')) && from !== 'gzh' && !detail) {
        setClickWhere('resume')
        setShowLogin(true)
        return
    }
    if (!detail) {
      env.addEventListener('touchmove', (e) => {
        // 执行滚动回调
        e.preventDefault()
      }, {
        passive: false //  禁止 passive 效果
      })
      setClickWhere('resume')
      setShowLogin(true)
      // 显示简易简历拨打电话所需手机号
      localStorage.setItem(
        'detailCallPhone',
        detailInfo.ContanctsPhone
      );
    } else {
      // this.applyCall()
      window.location.href = `tel:${detailInfo.ContanctsPhone}`
      _czc.push(['_trackEvent', '详情页', '咨询电话'])
      gio('track','phoneSuccess',{
        'pageType_var':'岗位详情页',
        'companyName_var': detailInfo.EnterpriseName,
        'postName_var': detailInfo.ShowName,
        'buttonName_var':'咨询电话'})
      getApply({ WayType: 2 });
    }
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

  const back = useCallback((e) => {
    if (fromPage === 'index') {
      route(`/${localStorage.getItem('locationSearch')}`)
    } else {
      route(`/buyResume`)
    }
  })

  useEffect(() => {
    if(!initialed) {
        setInitialed(true);
        getDetail();
        localStorage.setItem('isListInit', "false")
    }
  }, [initialed]);
  // const { detailInfo } = DetailStore;

  return <div className={classes.detailInfo} id='search_detail' style={`${showLogin?'position:fixed':''}`}>
    <div className={classes.backPage}>
        <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/963b1bf6ac8c47f464c952cb6e589a88.jpg', { w: 20, h: 0 })}`} alt="周薪薪直聘" className={classes.backImg} onClick={() => back()}/>
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
                index < 4 && 
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
        <div className={classes.requestTitle}>基本要求</div>
        <div className={classes.requestName}>
        <div style={{ lineHeight: '7vw'}}>{detailInfo && detailInfo.WorkRequire}</div>
        </div>
    </div>
    <div className={classes.jobBodyguard}>
        <div className={classes.bodyguardTitle}>猩猩小卫士</div>
        <div className={classes.bodyguardContent} onClick={() => showFeedBackView()}>
            该店长承诺不收取任何费用。如遇停机、关机，联系人已离职，
            <span className={classes.tipDetailPhone}>点此反馈</span>，我们会及时与你联系哦。
        </div>
    </div>
    <div className={classes.workAddress}>
        <div className={classes.addressStyle}>工作地址</div>
        <div className={classes.addressDistance}>
            <div className={classes.addressInfo}>
                {detailInfo && detailInfo.EnterpriseName && 
                  detailInfo.EnterpriseName.length > 11 ?  detailInfo.EnterpriseName.substring(0, 11) + '...' : detailInfo.EnterpriseName
                }
            </div>
            <div className={classes.addressLength}>
                {getStorage('userLocationInfo') && detailInfo && detailInfo.Distance && detailInfo.Distance > 0 && (
                <div className={classes.distance}>
                    距离我
                    {Number(detailInfo.Distance) / 1000 > 1
                    ? `${(Number(detailInfo.Distance) / 1000).toFixed(1)}公里`
                    : `${Number(detailInfo.Distance).toFixed(0)}米`}
                </div>
                )}
            </div>
        </div>
        <div style={{ width: '100%', height: '110px'}}>
          <div style={{ background: 'linear-gradient(90deg,rgba(255,255,255,1) 0%,rgba(255,255,255,2.62) 75%,rgba(255,255,255,0) 100%)',width: '70%', height: '110px', position: 'absolute', zIndex: '2', display: 'flex', alignItems: 'center'}}>
              <div>{detailInfo.WorkAddress}</div> 
          </div>
          <div style={{ width: '45%', height: '110px', position: 'absolute', zIndex: '1', right: '0'}}>
            <AMap
          address={[{name:detailInfo.EnterpriseName,position:[bgps_gps(detailInfo.Longitude,detailInfo.Latitude).lng,bgps_gps(detailInfo.Longitude,detailInfo.Latitude).lat]}]}
          height="110px"
          />
          </div>
        </div>
    </div>
    {
      detailInfo && (detailInfo.VideoUrl || (detailInfo.ImageList && detailInfo.ImageList.length > 0)) &&
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
    }
    <div className={classes.emptyLine}></div>
    <div className={classes.bottomBtn}>
        <div onClick={(e) => handleApply(e)} className={classes.post}>
        申请职位
        </div>
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
    <Toast></Toast>
    {
      showFeedBack &&
      <div className={classes.mask} onClick={() => hideFeedBackView()}>
        <div className={classes.maskContent} onClick={(e) => stop(e)}>
          <div className={classes.maskTitle}>反馈给我们</div>
          <div className={classes.checkView}>
          <FormControl component="fieldset">
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
              <FormControlLabel style={{ width: '35vw'}} value="1" control={<Radio />} label="不招聘" />
              <FormControlLabel style={{ width: '35vw'}} value="2" control={<Radio />} label="电话不通" />
              <FormControlLabel style={{ width: '35vw'}} value="3" control={<Radio />} label="空号" />
              <FormControlLabel style={{ width: '35vw'}} value="4" control={<Radio />} label="其他" />
            </RadioGroup>
          </FormControl>
            {/* <FormControl row>
              <FormControlLabel
                style={{ width: '35vw'}}
                control={
                  <Checkbox
                    className={classes.root}
                    checked={state.checkedA} onChange={handleChange}
                    name="checkedA"
                    disableRipple
                    color="default"
                    checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                    icon={<span className={classes.icon} />}
                    inputProps={{ 'aria-label': 'decorative checkbox' }}
                  />
                }
                label="不招聘"
              />
              <FormControlLabel
                style={{ width: '35vw'}}
                control={
                  <Checkbox
                    className={classes.root}
                    checked={state.checkedB} onChange={handleChange}
                    name="checkedB"
                    disableRipple
                    color="default"
                    checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                    icon={<span className={classes.icon} />}
                    inputProps={{ 'aria-label': 'decorative checkbox' }}
                  />
                }
                label="电话不通"
              />
              <FormControlLabel
                style={{ width: '35vw'}}
                control={
                  <Checkbox
                    className={classes.root}
                    checked={state.checkedC} onChange={handleChange}
                    name="checkedC"
                    disableRipple
                    color="default"
                    checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                    icon={<span className={classes.icon} />}
                    inputProps={{ 'aria-label': 'decorative checkbox' }}
                  />
                }
                label="空号"
              />
              <FormControlLabel
                style={{ width: '35vw'}}
                control={
                  <Checkbox
                    className={classes.root}
                    name="checkedD"
                    checked={state.checkedD} onChange={handleChange}
                    disableRipple
                    color="default"
                    checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                    icon={<span className={classes.icon} />}
                    inputProps={{ 'aria-label': 'decorative checkbox' }}
                  />
                }
                label="其他"
              />
            </FormControl> */}
          </div>
          <div className={classes.redFont}>宝宝，如果遇到无法打通电话、不招，反馈给我们哟。</div>
          <div className={classes.subBtn}  onClick={(e) => subFeedBackAction(e)}>提交</div>

        </div>
      </div>
    }
</div>;
});

export default Detail;
