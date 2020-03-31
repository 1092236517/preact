import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { route } from 'preact-router'
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';
import CopyToClipboard from 'react-copy-to-clipboard';
import cookie from "react-cookies"
import Login from '@/components/login'
import ToastStore from '@/components/toast/store'
import Toast from "@/components/toast";

import AdvDetailStore from './store';
import LoginStore from '@/components/login/store';
import { getImgFormatUrl } from "@/lib/base/common";

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const profileclasses = makeStyles({
    page: {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ff0',
        top: '0',
        left: '0',
    },
    mainPic: {
        width: '100%',
        height: '100%',
        marginTop: '12vw',
    },
    mainPicFromGzh: {
        width: '100%',
        height: '100%',
    },
    bottomInfo: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '10vw',
      width: '100%',
      height: '20vw',
      backgroundColor: '#ff0',
      boxShadow: '0 0 12px 4px rgb(184, 182, 182)'
    },
    brokerName: {
        width: '28%',
        color: '#2d2d2d',
        fontSize: '7vw',
        textAlign: 'center'
    },
    options: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '72%'
    },
    brokerPhone: {
        width: '30vw',
        height: '9vw',
        '& img':{
          height:'100%',
          width:'100%',
        }
    },
    brokerWeChat: {
        width: '30vw',
        height: '9vw',
        marginLeft: '5vw',
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
    contactView: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '100',
        position: 'fixed',
        bottom: '25vw',
        right: '3vw'
    },
    contactImg: {
        width: '20vw',
        height: '20vw'
    },
    contactMe: {
      backgroundColor: 'red',
      border: '2px solid #fff',
      borderRadius: '3.5vw',
      color: '#fff',
      fontSize: '2.8vw',
      padding: '0.5vw 2vw'
    }
});

const AdvDetail = observer(() => {
  const classes = profileclasses();

  const { toastClick } = ToastStore;

  const { setShowLogin, setClickWhere, showLogin, from } = LoginStore;
  const [initialed, setInitialed] = useState(false);
  // const [option, setOption] = useState('')
  const {
    getBrokerByPhone, brokerHaveMemberIs, setOption,
     option, happenCounts, brokerId, brokerIdCardId, brokerName, brokerPhone, brokerWechat
  } = AdvDetailStore;

  const initDid = useCallback(()=>{
    // const BrokerInfo = JSON.parse(localStorage.getItem('brokerInfo')); // 专属经纪人信息
    // setBrokerInfo(BrokerInfo);
    //
    // const ownBroker = JSON.parse(localStorage.getItem('ownBroker')); // 专属经纪人信息
    // if (isEmpty(ownBroker)) {
    //   getBroker({ BrokerPhone: BrokerInfo.BrokerPhone }).then((res) => {
    //     this.setState(
    //       {
    //         currentBrokerId: res.Data.BrokerId,
    //       },
    //       () => {
    //         this.recordOptions('browse');
    //       }
    //     );
    //   });
    // } else {
    //   this.setState({
    //     ownBrokerName: ownBroker.name,
    //     ownBrokerPhone: ownBroker.mobile,
    //     ownBrokerWeChat: ownBroker.wechat,
    //   });
    //   getBroker({ BrokerPhone: ownBroker.mobile }).then((res) => {
    //     this.setState(
    //       {
    //         currentBrokerId: res.Data.BrokerId,
    //       },
    //       () => {
    //         this.recordOptions('browse');
    //       }
    //     );
    //   });
    // }
  })

  const createRandomId = useCallback(() => {
    return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5)
  })

  const brokerHaveMember = useCallback(() => {
    if (!cookie.load('userPhone')) return
    brokerHaveMemberIs({ MemberPhone: cookie.load('userPhone'), BrokerPhone: brokerPhone })
  })

  const setCookie = useCallback((phone) => {
    const currentTime = new Date(new Date()).getTime() + 1
    const maxTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
    let expires = (maxTime - currentTime) / 1000
    cookie.save(phone, phone, { path: '/', maxAge: expires })
  })

  // 复制微信号
  const onCopy = useCallback((text, result) => {
    toastClick('复制成功', 'success','info')
    // AdvDetailStore.recordOptions('YellowDetail', 'copy', AdvDetailStore.from === 'gzh' ? 'gzh' : 'H5');
    // if (cookie.load(`YellowDetail-options-${AdvDetailStore.from === 'gzh' ? 'gzh' : 'H5'}`)) return
    // AdvDetailStore.recordOptions('YellowDetail', 'options', AdvDetailStore.from === 'gzh' ? 'gzh' : 'H5');
    _czc.push(['_trackEvent', '我打制造业详情', '复制微信'])
  })

  // 打电话
  const callPhone = useCallback( ()=> {
    // AdvDetailStore.recordOptions('YellowDetail', 'call', AdvDetailStore.from === 'gzh' ? 'gzh' : 'H5');
    // if (cookie.load(`YellowDetail-options-${AdvDetailStore.from === 'gzh' ? 'gzh' : 'H5'}`)) return
    // AdvDetailStore.recordOptions('YellowDetail', 'options', AdvDetailStore.from === 'gzh' ? 'gzh' : 'H5');
    _czc.push(['_trackEvent', '我打制造业详情', '拨打电话'])
  })

  // 让经纪人联系我
  const contactMe = useCallback( ()=> {
    if (cookie.load('userPhone') || localStorage.getItem('resumeDetail')) {
      brokerHaveMember()
    } else {
      setShowLogin(true);
      setClickWhere('login')
    }
  })

  useEffect(() => {
    if(!initialed) {
        setInitialed(true);
    }
    // 公众号进入 获取当前排行第一经纪人信息
    if (location.search.includes('gzh')) {
      console.log('gzh')
      AdvDetailStore.setFrom('gzh')
      AdvDetailStore.getTopAdvertisementInfo()
      setTimeout(()=>{AdvDetailStore.recordOptions('YellowDetail','browse','gzh')}, 2000)
      _czc.push(['_trackEvent', '浏览来源', '公众号进入'])
    } else if (localStorage.getItem('ownerBrokerInfo')){
      // 专属经纪人进入 读取专属经纪人信息
      AdvDetailStore.getOwnerBrokerInfo()
      setTimeout(()=>{AdvDetailStore.recordOptions('YellowDetail','browse','H5')}, 2000)
      _czc.push(['_trackEvent', '浏览来源', '专属经纪人进入'])
    } else {
      // 列表进入
      setShowLogin(false);
      getBrokerByPhone();
      setTimeout(()=>{AdvDetailStore.recordOptions('YellowDetail','browse','H5')}, 2000)
      _czc.push(['_trackEvent', '浏览来源', '常规进入'])
    }
  }, [initialed]);


  const { mainImg } = AdvDetailStore;

  return <div className={classes.page}>
    {
      !location.search.includes('gzh') &&
      <div className={classes.backPage}>
        <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/963b1bf6ac8c47f464c952cb6e589a88.jpg', { w: 20, h: 0 })}`} className={classes.backImg} alt="周薪薪直聘" onClick={() => {route(`/wdHome${localStorage.getItem('locationSearch')}`)}}/>
        <div className={classes.indexName}>职位详情</div>
        <div className={classes.right} />
      </div>
    }
  <img src={`${optImageUrl(mainImg ? mainImg : localStorage.getItem('currentAdvImg'), { w: 750, h: 0 })}`} className={!location.search.includes('gzh') ? classes.mainPic : classes.mainPicFromGzh} alt="周薪薪直聘" />
  <div className={classes.bottomInfo}>
    <div className={classes.brokerName}>
      {brokerName}
    </div>

    <div className={classes.options}>
      <a
        href={`tel:${brokerPhone}`}
        className={classes.brokerPhone}
        onClick={() => {callPhone()}}
      >
        <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/a0c9e771bea866a1c7684ab2dbfbb728.jpg', { w: 220, h: 0 })}`} alt="周薪薪直聘" />
      </a>
      <CopyToClipboard
        text={brokerWechat}
        className={classes.brokerWeChat}
        onCopy={() => {onCopy()}}
      >
        <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/a3df0b57bc3223f90b1850469b98210a.jpg', { w: 220, h: 0 })}`} alt="周薪薪直聘" />
      </CopyToClipboard>
    </div>
  </div>
  {
    showLogin && from !== 'gzh' &&
    <Login></Login>
  }
  {/* <div className={classes.contactView} onclick={()=>{contactMe()}} >
    <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/df80ddcb03975afae8db9ad483df69cb.jpg', { w: 136, h: 0 })}`} alt={"经纪人"} className={classes.contactImg}/>
    <div className={classes.contactMe}>让{brokerName}联系我</div>
  </div> */}
  <Toast></Toast>
</div>
});

export default AdvDetail;
