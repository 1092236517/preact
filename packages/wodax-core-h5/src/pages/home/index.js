import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';

import IndexList from "@/components/index_list";
import Index from "@/components/list"
import Header from "@/components/header";
import SearchBox from "@/components/search_box";
import Login from '@/components/login';
import LoginStore from '@/components/login/store';
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';
import {route} from "preact-router";
import StoreForList from '@/components/list/store';
import ViewManagerStore from '@/components/index_list/store/view.manager'
import listStore from '@/components/list/store'
import Toast from "@/components/toast";

import { getImgFormatUrl } from "@/lib/base/common";

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const homeStyles = makeStyles({
  root: {
    position: "fixed",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    backgroundColor: '#f9f9f9'
  },
  search: {
    position: 'absolute',
    top: '120px',
    zIndex: '99',
    width: '100%',
  },
  toTop: {
    position: 'fixed',
    right: '5vw',
    bottom: '18vw',
    zIndex: '3',
    width: '15vw',
    height: '15vw',
    '& img': {
      width: '100%',
      height: '100%',
    }
  },
  toPersonal: {
    position: 'fixed',
    right: '5vw',
    bottom: '36vw',
    zIndex: '3',
    width: '15vw',
    height: '15vw',
    '& img': {
      width: '100%',
      height: '100%',
    }
  }

});

function getShareLocation() {
  localStorage.removeItem('brokerShareInfo');
  const shareLocation = window.location.href.split('#')[0].split('?')[0];
  localStorage.setItem('shareLocation', shareLocation);
}

// function getUserPos() {
//   AMap.plugin('AMap.Geolocation', function () {
//     let geolocation = new AMap.Geolocation({
//       enableHighAccuracy: true, // 是否使用高精度定位，默认:true
//       timeout: 1000,           // 超过10秒后停止定位，默认：5s
//       buttonPosition: 'RB',     // 定位按钮的停靠位置
//       buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
//       zoomToAccuracy: true,   // 定位成功后是否自动调整地图视野到定位点
//     })
//     geolocation.getCurrentPosition(function (status, result) {
//       if (status === 'complete') {
//       } else {
//         // Toast.info('定位失败,请确认您的定位是否开启', 2)
//         // that.getPosition()
//         if (cookie.load('newLongitude') && cookie.load('newLatitude')) {
//           that.getZpList({ page: 1, mark: 'search' })
//         } else {
//           that.setState({
//             longitude: 0,
//             latitude: 0,
//             cityModal: true
//           }, () => {
//             that.getZpList({ page: 1, mark: 'search' })
//           })
//         }
//       }
//     })
//   })
// }

const Home = observer((props, context) => {
  const classes = homeStyles();
  const [initialed, setInitialed] = useState(false);
  const { showLogin, setShowLogin, setClickWhere, from } = LoginStore;
  const { isFromApp, setIsFrom, getPostList } = StoreForList

  useEffect(() => {
    if (!initialed) {
      document.title = "周薪薪直聘";
      document.getElementsByTagName("meta")[5].content =
        "招聘，服务业，招聘，服务业，制造业招聘，制造业，昆山，苏州，打工，昆山打工，昆山招聘，苏州打工，苏州招聘，临时工，日结，兼职，仁宝，纬创，纬视晶，华硕，蓝领，蓝领招人，临时工招人，我的打工，我的打工网，打工网，服务业打工，苏州制造业，苏州服务业，昆山打工，苏州招聘，昆山招聘，苏州求职，昆山求职，司机，服务员，收银员，保安，文员，房产，销售，酒店，客服，推荐，分享，奖金";
      document.getElementsByTagName("meta")[6].content =
        "周薪薪直聘是我打科技集团旗下，专门为服务业蓝领人群提供免费招聘的互联网平台机构。秉承我的打工网“让打工路上天下无贼”的理念，我们人工线下审核每一家招聘商家信息，确保周薪薪直聘上绝对不会有一家黄牛或骗子及传销机构。我们用自己的实际行动保证每一个用户在平台上可以直接联系到最真实的招聘商家，尽力及时为合法商家解决相关招人需求。";
      setInitialed(true);
      isFromApp()
      getPostList()
    }setShowLogin(false);
    setIsFrom('index')
  }, [initialed]);

  const toTop = useCallback(()=>{
    // const { setBackToTop } = ViewManagerStore;
    // setBackToTop(true);
    const { setScrollTop, setToTop } = listStore;
    setScrollTop(0);
    setToTop(true)
  })

  const toPersonal = useCallback(()=>{
    localStorage.setItem('isFrom', 'index');
    gio('track', 'callme');
    const personalFrom = {page: '首页', button: '让老板联系我'}
    localStorage.setItem('personalFrom', JSON.stringify(personalFrom));
    route('/personal');

  })

  return (
    <div>
      {
        window.location.href.split('#')[0].indexOf('feedBack') === -1 &&
        <div class={classes.root}>
          <Header />
          <SearchBox></SearchBox>
          <Index/>
          {/*<IndexList></IndexList>*/}
          <div className={classes.toTop} onClick={()=>toTop()}>
            <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/4fcc77ca91c23c3a48c3572e7bbafab2.jpg', { w: 69, h: 0 })}`} alt="周薪薪直聘" />
          </div>
          <div className={classes.toPersonal} onClick={()=>toPersonal()}>
            <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/02a7cac9b988ce35294a73cb8df33654.jpg', { w: 112, h: 0 })}`} alt="周薪薪直聘" />
          </div>
          {
            showLogin && from !== 'gzh' &&
            <Login></Login>
          }
          <Toast></Toast>
        </div>
      }
    </div>
  );
});

export default Home;
