import React, { useMemo } from 'preact/compat';
import { toJS } from 'mobx';
import { useCallback, useEffect, useState, useRef } from 'preact/hooks';
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import Store from './store';
import PostSearch from '../wd_search_contain';
import ListStore, { TypeForGetListData } from '../wd_index_list/store'
import ViewManagerStore from '@/components/wd_index_list/store/view.manager'


const searchBoxStyles = makeStyles({
	detailInfo: {
		height: '12vw'
	},
	infoContent:{
		zIndex:'2',
		position:"relative",
	},
	searchTab: {
		display: 'flex',
		justifyContent: 'space-around',
		height: '10vw',
		padding: '1vw 0',
		backgroundColor: '#fff',
		borderBottom: '0.2vw solid #d4d4d4',
	  },
	  tabWrapper: {
		// position: relative;
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '0 2.5vw',
		fontSize: '3.5vw',
		backgroundColor: '#f4f4f4',
		cursor:'pointer',
    },
    tabWrapperActive: {
      backgroundColor: '#dbf3f7',
      color: '#2084b1'
    },
	  tabActive: {
		color: '#4e91ff',
		border: '0.1vw solid #4e91ff',
	  },
	  searchArea: {
		position: 'absolute',
		zIndex: '5',
		display: 'flex',
		width: '100%',
		height: 'auto',
		backgroundColor: '#fff',
		maxHeight:'150vw',
	  },
	  left: {
		background: 'rgba(249, 249, 249, 1)',
	  },
	  salary: {
		padding: '1.6vw 0',
		color: 'rgba(106, 106, 106, 1)',
		fontWeight: '400',
		fontSize: '4vw',
		fontFamily: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
		textAlign: 'center',
		borderBottom: '.1vw solid #ededed',
	  },
	  salaryActive: {
		color: '#4e91ff',
	  },
	  leftActive: {
		color: '#4e91ff !important',
		borderLeft: '.1vw solid #4e91ff',
	  },
	  areaStyle: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '33.33%',
		textAlign: 'center',
		borderRight: '.1vw solid rgba(203, 203, 203, 1)',
		overflow:'hidden',
		overflowY:'auto',
	  },
	  leftCommon: {
		margin: '1.6vw 3.2vw 3.2vw 0',
		color: 'rgba(106, 106, 106, 1)',
		fontWeight: '400',
		fontSize: '4vw',
		fontFamily: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
	  },
	  mask: {
		position: 'fixed',
		top: '2.9vw',
		right: '0',
		bottom: '0',
		left: '0',
		zIndex: '1',
		overflow: 'hidden',
		background: 'rgba(0, 0, 0, 0.5)',
	  }
  });

const SearchBox = observer(() => {
	const styles = searchBoxStyles();

	const { getAreaList, areaList } = Store;
	const { setTabId, updateFirstAreaId, updateSecondAreaId, updateThirdAreaId, tabId, firstAreaId, secondAreaId, thirdAreaId, postList, IndustryId } = ListStore;
	const { SortId, updateSortId, SalaryRoundId, updateSalaryRoundId, AreaId, updateAreaId, choiceList, geListData, isPneumonia, setIsPneumonia } = ListStore;

	const [secondArea, setSecondArea] = useState([]);
	const [thirdArea, setThirdArea] = useState([]);
	const [isTrue,setIsTrue]  = useState(false);

	// 薪资范围
	const salaryWige = [
        {
          id: 0,
          name: '不限',
        },
        // {
        //   id: 1,
        //   name: '面议',
        // },
        {
          id: 2,
          name: '1500-3000',
        },
        {
          id: 3,
          name: '3000-4000',
        },
        {
          id: 4,
          name: '4000-6000',
        },
        {
          id: 5,
          name: '6000-8000',
        },
        {
          id: 6,
          name: '8000-10000',
        },
        {
          id: 7,
          name: '10000以上',
        },
      ];
      // 排序
  const orderBy = [
    // {
    //   id: 0,
    //   name: '智能排序',
    // },
    {
      id: 1,
      name: '距离最近',
    },
    {
      id: 2,
      name: '最新发布',
    },
    {
      id: 3,
      name: '薪资最高',
    },
  ];

  const toTop = useCallback(()=>{
    const { setBackToTop } = ViewManagerStore;
    setBackToTop(true);
  })

	// 搜索tab 点击事件
	const tab = useCallback((tabActive)=>{
    if (tabActive === tabId) {
      setTabId(0)
    } else {
      setTabId(tabActive)
    }
	});

	// 区域点击事件级联一级区域
	const clickAreaLevelFirst = useCallback ((id, list) => {
		updateFirstAreaId(id);
		list.map((v) => {
			if (v.id === id) {
				setSecondArea(v.sub);
				if (v.sub.length === 0) {
					updateAreaId(id);
					geListData(TypeForGetListData.Search);
					setTabId(0);
          toTop()
          _czc.push(['_trackEvent', 'C端首页', '通过商圈查询'])
				}
			}
			return true;
		});
	})

	// 区域点击事件级联二级区域
	const clickAreaLevelSecond = useCallback((id) => {
		updateSecondAreaId(id);
		secondArea.map((v) => {
		  if (v.id === id) {
			setThirdArea(v.sub);
			if (v.sub.length === 0) {
				updateAreaId(id);
				geListData(TypeForGetListData.Search);
				setTabId(0);
        toTop()
        _czc.push(['_trackEvent', 'C端首页', '通过商圈查询'])
			}
		  }
		  return true;
		});
	  })

	  // 区域点击事件级联三级区域
	  const clickAreaLevelThird = useCallback((id) => {
      updateAreaId(id);
      updateThirdAreaId(id);
      geListData(TypeForGetListData.Search);
      setTabId(0);
      toTop()
      _czc.push(['_trackEvent', 'C端首页', '通过商圈查询'])
	  })

	  // 点击薪资范围
	  const clickSalary = useCallback((id) => {
      updateSalaryRoundId(id);
      geListData(TypeForGetListData.Search);
      setTabId(0);
      toTop()
      _czc.push(['_trackEvent', 'C端首页', '通过薪资范围查询'])
	  })

	  // 点击智能排序
	  const clickOrder = useCallback((id) => {
      updateSortId(id);
      geListData(TypeForGetListData.Search);
      setTabId(0);
      toTop()
      _czc.push(['_trackEvent', 'C端首页', '通过排序查询'])
    })
    
    // 点击疫情岗位
	  const clickPneumonia = useCallback(() => {
      setIsPneumonia(!isPneumonia);
      geListData(TypeForGetListData.Search);
      toTop()
      _czc.push(['_trackEvent', 'C端首页', '通过疫情岗位查询'])
    })
    
	  //
	  const hiddenMask = useCallback(() => {
		  setTabId(0);
	  })

	useEffect(() => {
		getAreaList();
    if (postList[0]) {
      setIsTrue(postList[0].industry_id !== IndustryId && IndustryId !== 0);
    }
	}, []);

    return (
        <div className={styles.detailInfo}>
          <div className={styles.infoContent}>
                  <div className={styles.searchTab}>
              <div
              onClick={()=> {tab(1)}}
              className={`${styles.tabWrapper} ${
                tabId === 1 || choiceList.length > 0 || isTrue
                ? styles.tabActive
                : ''
              }`}
              >
              <div>
                全部职位 {tabId === 1 ? <span>▼</span> : <span>▲</span>}
              </div>
              </div>
              <div
              onClick={()=>{clickPneumonia()}}
              className={`${styles.tabWrapper} ${isPneumonia ? styles.tabWrapperActive : ''}`}
              style={{ padding: '0 5vw'}}
              >
              <div>
                疫情专区
              </div>
              </div>
              <div
              onClick={()=>{tab(2)}}
              className={`${styles.tabWrapper} ${
                tabId === 2 || AreaId > 0 ? styles.tabActive : ''
              }`}
              >
              <div>
                区域/商圈 {tabId === 2 ? <span>▼</span> : <span>▲</span>}
              </div>
              </div>
              <div
              onClick={()=>{tab(3)}}
              className={`${styles.tabWrapper} ${
                tabId === 3 || SalaryRoundId > 0
                ? styles.tabActive
                : ''
              }`}
              >
              <div>
                薪资范围 {tabId === 3 ? <span>▼</span> : <span>▲</span>}
              </div>
              </div>
              {/* <div
              onClick={()=>{tab(4)}}
              className={`${styles.tabWrapper} ${
                tabId === 4 || SortId > 0 ? styles.tabActive : ''
              }`}
              >
              <div>
                智能排序 {tabId === 4 ? <span>▼</span> : <span>▲</span>}
              </div>
              </div> */}
            </div>
            {tabId === 1 && (
              <div className={styles.searchContent}>
                <PostSearch />
              </div>
            )}
            {tabId === 2 && (
              <div className={styles.searchArea}>
              <div className={`${styles.left} ${styles.areaStyle}`}>
                {toJS(areaList) &&
                toJS(areaList).map((item) => (
                  <div
                  key={item.id}
                  onClick={() =>
                    clickAreaLevelFirst(item.id, toJS(areaList))
                  }
                  className={`${styles.leftCommon} ${
                    firstAreaId === item.id ? styles.leftActive : ''
                  }`}
                  >
                  {item.name}
                  </div>
                ))}
              </div>
              {secondArea.length > 0 && (
                <div className={`${styles.left} ${styles.areaStyle}`}>
                {secondArea &&
                  secondArea.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => clickAreaLevelSecond(item.id)}
                    className={`${styles.leftCommon} ${
                    secondAreaId === item.id ? styles.leftActive : ''
                    }`}
                  >
                    {item.name}
                  </div>
                  ))}
                </div>
              )}
              {thirdArea.length > 0 && (
                <div className={`${styles.left} ${styles.areaStyle}`}>
                {thirdArea &&
                  thirdArea.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => clickAreaLevelThird(item.id)}
                    className={`${styles.leftCommon}  ${
                    thirdAreaId === item.id ? styles.lefActive : ''
                    }`}
                  >
                    {item.name}
                  </div>
                  ))}
                </div>
              )}
              </div>
            )}
            {tabId === 3 && (
              <div className={styles.searchArea}>
                <div className={styles.left} style={{ width: '100%' }}>
                  {salaryWige &&
                  salaryWige.map((item) => (
                    <div
                    key={item.id}
                    onClick={() => clickSalary(item.id)}
                    className={`${styles.salary} ${
                      SalaryRoundId === item.id
                      ? styles['salaryActive']
                      : ''
                    }`}
                    >
                    {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tabId === 4 && (
              <div className={styles.searchArea}>
              <div className={styles.left} style={{ width: '100%' }}>
                {orderBy &&
                orderBy.map((item) => (
                  <div
                  key={item.id}
                  onClick={() => clickOrder(item.id)}
                  className={`${styles.salary} ${
                    SortId === item.id ? styles['salaryActive'] : ''
                  }`}
                  >
                  {item.name}
                  </div>
                ))}
              </div>
              </div>
            )}
          </div>
          {tabId > 0 && (
            <div className={styles.mask} onClick={hiddenMask} />
          )}
        </div>
    )
})

export default SearchBox;
