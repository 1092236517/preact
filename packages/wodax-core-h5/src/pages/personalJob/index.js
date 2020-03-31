import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { route } from 'preact-router'
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';
import ListStore from '../../components/list/store';
import { getImgFormatUrl } from "@/lib/base/common";
import { getStorage, setStorage } from "@/lib/base/storage";
import PostSearch from '@/components/search_contain2';
import StorePersonal from '../personal/store'

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const profileclasses = makeStyles({
  backPage: {
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
  postSearch: {
    width: '100%'
  },
  submit_btn: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    color: '#333333',
    textAlign: 'center',
    background: 'linear-gradient(135deg,rgba(255,227,0,1) 0%,rgba(255,218,0,1) 100%)',
    height: '15vw',
    lineHeight: '15vw',
    fontSize: '5vw'
  }
});

const Location = observer(() => {
  const classes = profileclasses()
  const [initialed, setInitialed] = useState(false);

  const { cityName, setVirtualCityName, setVirtualLat, setVirtualLng, geListData, setScrollTop, setToTop } = ListStore

  const { setShowSelectJobPop } = StorePersonal

  useEffect(() => {
    
  }, []);

  const toTop = useCallback(()=>{
    // todo: 回到顶部
    setScrollTop(0);
    setToTop(true)
  })

  const submit = useCallback(()=>{
    setShowSelectJobPop(false)
  })

  return <div className={classes.geoContainer}>
    <div className={classes.backPage}>
      <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/963b1bf6ac8c47f464c952cb6e589a88.jpg', { w: 20, h: 0 })}`} alt="周薪薪直聘" className={classes.backImg} onClick={() => submit()}/>
      <div className={classes.indexName}>选择岗位</div>
      <div className={classes.right} />
    </div>
    <div className={classes.postSearch}>
      <PostSearch />
    </div>
    <div className={classes.submit_btn} onClick={() => submit()}>
      保存
    </div>
  </div>
});

export default Location;
