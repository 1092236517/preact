import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { route } from 'preact-router'
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';
import MyStore from './store'

import Login from '@/components/login'
import LoginStore from '@/components/login/store';
import Toast from "@/components/toast";

import { getImgFormatUrl } from "@/lib/base/common";

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const profileStyles = makeStyles({
  profile: {
    boxSizing: 'border-box',
    height: '100vh',
    backgroundColor: 'rgba(249,249,249,1)'
  },
  avatar: {
    padding: '1.1vw 3.9vw 1.1vw 6vw',
    background: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '6vw',
    fontWeight: '600',
    color: 'rgba(46,46,46,1)'
  },
  avatarImg: {
    width: '18vw',
    height: '18vw',
    borderRadius: '50%'
  },
  mainLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1vw',
    padding: '2vw 5vw 2vw 6.4vw',
    backgroundColor: '#fff'
  },
  lineLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  lineImg: {
    width: '8vw',
    height: '6vw',
    marginRight: '3vw'
  },
  lineTitle: {
    fontSize: '5vw',
    fontWeight: '400',
    color: 'rgba(27,27,27,1)'
  },
  lineRight: {
    width: '2.1vw',
    height: '3.7vw'
  }
});

const Profile = observer(() => {
  const classes = profileStyles()
  const { titleName, avatar } = MyStore;
  const { showLogin, setShowLogin, setClickWhere, from } = LoginStore;
  const { getUserInfo } = MyStore;

  useEffect(() => {
    gio('page.set', {
      'pageType_pvar': '我的页',
      'companyName_pvar': '无',
      'postName_pvar': '无'
      });
    getUserInfo();
    localStorage.setItem('isListInit', "false")
  }, []);

  const toLogin = useCallback(()=>{
    setShowLogin(true);
    setClickWhere('my')
  })

  const login = useCallback(()=>{
    if (!localStorage.getItem('resumeDetail')) {
      toLogin()
    }
  })

  const toPage = useCallback((rout)=>{
    if (rout !== '/buyResume') {
      route(rout)
    } else {
      if (!localStorage.getItem('resumeDetail')) {
        toLogin()
      } else {
        route(rout)
      }
    }
  })

  const lineInfo = [
    {
      icon: 'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/f25c221235b8b4212202c354c2027df5.jpg',
      title: '我的简历',
      route: '/personal'
    },
    {
      icon: 'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/2a869ef17ec9658d377521855e72d8e1.jpg',
      title: '我申请的职位',
      route: '/buyResume'
    },
    {
      icon: 'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/1e6e0b14456cf74890877d608889b87c.jpg',
      title: '我要反馈',
      route: '/feedBack'
    }
  ];
  const defaultAvatar = 'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/08b35c75b56c0a13a205ca6c8a700242.jpg'
  return <div className={classes.profile}>
    <div className={classes.avatar} onClick={() => login()}>
        <div className={classes.title}>{localStorage.getItem('resumeDetail')?JSON.parse(localStorage.getItem('resumeDetail')).Name:'未登录'}</div>
        <img className={classes.avatarImg} src={`${optImageUrl(avatar ? avatar : defaultAvatar, { w: 136, h: 0 })}`} alt='头像' />
    </div>
        {
          lineInfo.length > 0 &&
          lineInfo.map((item, index) => (
            <div className={classes.mainLine} key={index} onClick={() => toPage(item.route)}>
              <div className={classes.lineLeft}>
                <img className={classes.lineImg} src={item.icon} alt='' />
                <div className={classes.lineTitle}>{item.title}</div>
              </div>
              <img className={classes.lineRight} src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/d35072ea3053457a38cc495aaa085a31.jpg', { w: 22, h: 0 })}`} alt='' />
            </div>
            ))
        }
    {
      showLogin && from !== 'gzh' &&
      <Login></Login>
    }
    <Toast/>
  </div>;
});

export default Profile;
