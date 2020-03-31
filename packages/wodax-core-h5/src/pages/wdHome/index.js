import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';

import Header from "@/components/wd_header";
import IndexList from "@/components/wd_index_list";
import SearchBox from "@/components/wd_search_box";
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';
import StoreForList from '@/components/wd_index_list/store';
import ViewManagerStore from '@/components/wd_index_list/store/view.manager'
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


const Home = observer((props, context) => {
  const classes = homeStyles();
  const [initialed, setInitialed] = useState(false);
  const { isFromApp, setIsFrom } = StoreForList

  useEffect(() => {
    if (!initialed) {
      document.title = "周薪薪直聘";
      document.getElementsByTagName("meta")[5].content =
        "招聘，服务业，招聘，服务业，制造业招聘，制造业，昆山，苏州，打工，昆山打工，昆山招聘，苏州打工，苏州招聘，临时工，日结，兼职，仁宝，纬创，纬视晶，华硕，蓝领，蓝领招人，临时工招人，我的打工，我的打工网，打工网，服务业打工，苏州制造业，苏州服务业，昆山打工，苏州招聘，昆山招聘，苏州求职，昆山求职，司机，服务员，收银员，保安，文员，房产，销售，酒店，客服，推荐，分享，奖金";
      document.getElementsByTagName("meta")[6].content =
        "周薪薪直聘是我打科技集团旗下，专门为服务业蓝领人群提供免费招聘的互联网平台机构。秉承我的打工网“让打工路上天下无贼”的理念，我们人工线下审核每一家招聘商家信息，确保周薪薪直聘上绝对不会有一家黄牛或骗子及传销机构。我们用自己的实际行动保证每一个用户在平台上可以直接联系到最真实的招聘商家，尽力及时为合法商家解决相关招人需求。";
      setInitialed(true);
      isFromApp()
    }
    setIsFrom('index')
    _czc.push(['_trackEvent', '浏览来源', '我打APP'])
  }, [initialed]);

  const toTop = useCallback(()=>{
    const { setBackToTop } = ViewManagerStore;
    setBackToTop(true);
  })

  return (
    <div>
      {
        window.location.href.split('#')[0].indexOf('feedBack') === -1 &&
        <div class={classes.root}>
          <Header></Header>
          <SearchBox></SearchBox>
          <IndexList></IndexList>
          <div className={classes.toTop} onClick={()=>toTop()}>
            <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/4fcc77ca91c23c3a48c3572e7bbafab2.jpg', { w: 69, h: 0 })}`} alt="周薪薪直聘" />
          </div>
          <Toast></Toast>
        </div>
      }
    </div>
  );
});

export default Home;
