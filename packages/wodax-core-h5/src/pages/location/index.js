import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { route } from 'preact-router'
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';
import ListStore from '../../components/list/store';
import { getImgFormatUrl } from "@/lib/base/common";
import { getStorage, setStorage } from "@/lib/base/storage";

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const profileclasses = makeStyles({
  geoContainer: {
    boxSizing: 'border-box',
    height: '100%',
    backgroundColor: '#f6f6f6'
  },
  geoHead: {
    color: '#464646',
    width: '100%',
    padding: '2vw 4vw',
    fontSize: '4vw',
    marginTop: '12vw',
  },
  geoBody: {
    padding: '2vw 4vw',
    color: '#464646',
    fontSize: '4vw',
    width: '100%',
    height: '100vh'
  },
  hotTitle: {
    marginBottom: '2vw',
    fontSize: '4vw;',
    color: '#999999'
  },
  hotLabelList: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  hotLabelCell: {
    width: '27vw',
    height: '9vw',
    marginRight: '2vw',
    marginBottom: '2vw',
    lineHeight: '9vw',
    textAlign: 'center',
    background: '#fff',
    border: '0.2vw solid rgba(239, 239, 239, 1)',
    borderRadius: '0.4vw'
  },
  hotLabelCell2: {
    width: '18vw',
    height: '5.6vw',
    marginRight: '2vw',
    marginBottom: '2vw',
    lineHeight: '5.6vw',
    textAlign: 'center',
    background: '#ff0',
    border: '0.2vw solid rgba(239, 239, 239, 1)',
    borderRadius: '0.4vw'
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
  }
});

const Location = observer(() => {
  const classes = profileclasses()
  const [initialed, setInitialed] = useState(false);

  const { cityName, setVirtualCityName, setVirtualLat, setVirtualLng, geListData, setScrollTop, setToTop } = ListStore

  let currentCityName = ''
  useEffect(() => {
    gio('page.set', {
      'pageType_pvar': '选择城市页',
      'companyName_pvar': '无',
      'postName_pvar': '无'
      });
    // if(!initialed) {
    //   setInitialed(true);
    // }
    localStorage.setItem('isListInit', "false")
  }, []);

  const currentLocation = useCallback(()=> {
    setVirtualCityName('')
    setVirtualLat(0)
    setVirtualLng(0)
    route(`/${localStorage.getItem('locationSearch')}`)
    geListData('search')
    toTop()
  })

  const changeCity = useCallback((e) => {
    const curLocation = { ...e.target.dataset };
    setVirtualCityName(curLocation.name)
    setVirtualLat(curLocation.lat)
    setVirtualLng(curLocation.lng)
    route(`/${localStorage.getItem('locationSearch')}`)
    geListData('search')
    toTop()
  })

  const toTop = useCallback(()=>{
    // todo: 回到顶部
    setScrollTop(0);
    setToTop(true)
  })

  return <div className={classes.geoContainer}>
    <div className={classes.backPage}>
      <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/963b1bf6ac8c47f464c952cb6e589a88.jpg', { w: 20, h: 0 })}`} alt="周薪薪直聘" className={classes.backImg} onClick={() => {route(`/`)}}/>
      <div className={classes.indexName}>选择城市</div>
      <div className={classes.right} />
    </div>
    <div className={classes.geoHead}>
      <div className={classes.hotTitle}>所在城市</div>
      <div className={classes.hotLabelList}>
        <span className={classes.hotLabelCell} onClick={() => currentLocation()}>
          {getStorage('userLocationInfo') ? cityName : '未授权 (默认苏州)'}
        </span>
      </div>
    </div>
    <div className={classes.geoBody}>
      <div className={classes.hotTitle}>热门城市</div>
      <div className={classes.hotLabelList} onClick={(e) => changeCity(e)}>
        <span className={classes.hotLabelCell} data-id={0} data-name="苏州" data-lat="31.335106" data-lng="120.6174">
              苏州
        </span>
        <span className={classes.hotLabelCell} data-id={1} data-name="昆山" data-lat="31.355063" data-lng="120.979345">
              昆山
        </span>
        <span className={classes.hotLabelCell} data-id={2} data-name="上海" data-lat="31.01901" data-lng="121.326622">
              上海
        </span>
        <span className={classes.hotLabelCell} data-id={3} data-name="深圳" data-lat="22.666775" data-lng="114.029876">
              深圳
        </span>
      </div>
    </div>
  </div>
});

export default Location;
