import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';

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
    width: '5vw',
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

const Personal = observer(() => {
  const classes = profileStyles()
  const lineInfo = [
    {
      icon: 'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/542850abe8a09018d7709dc95362164c.jpg',
      title: '我的简历',
      route: '/personal'
    },
    {
      icon: 'http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/e8fb1a63a0a1b7c7b8686d383b8fbf5b.jpg',
      title: '我的账户',
      route: '/account'
    }
  ];
  return <div className={classes.profile}>
    <div className={classes.avatar}>
          <div className={classes.title}>虾子</div>
          <img className={classes.avatarImg} src='https://wx.qlogo.cn/mmopen/vi_32/YflLdCdbUAlF0DLZ9xCBgia6rLfGNNE3KUtanRTmp7cjxyjk2XoTAcF39raibn9NDKbibEPUYSMHjczOU8SOsyEyA/132' alt='头像' />
        </div>
        {
          lineInfo.length > 0 &&
          lineInfo.map((item, index) => (
            <div className={classes.mainLine} key={index}>
              <div className={classes.lineLeft}>
                <img className={classes.lineImg} src={item.icon} alt='' />
                <div className={classes.lineTitle}>{item.title}</div>
              </div>
              <img className={classes.lineRight} src='http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/d35072ea3053457a38cc495aaa085a31.jpg' alt='' />
            </div>
            ))
        }
    <Toast></Toast>
  </div>;
});

export default Personal;
