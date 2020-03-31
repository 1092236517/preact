import React from 'preact/compat';
import { toJS } from 'mobx';
import { useCallback, useEffect, useState, useRef } from 'preact/hooks';
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import ListStore, { TypeForGetListData } from '../list/store';
import PersonalStore from '../../pages/personal/store';
import { happenCounts } from '@/services/detail';
import ToastStore from '@/components/toast/store'
import Toast from "@/components/toast";
import { getImgFormatUrl } from "@/lib/base/common";

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};


const searchBoxStyles = makeStyles({
    screen: {},
    ischoice: {
        width: '100%',
        minHeight: '20vw',
        margin: '0 auto',
        color: 'rgba(65, 65, 65, 1)',
        paddingBottom: '2vw',
        fontWeight: '400',
        fontSize: '2.4vw',
        backgroundColor: '#fafafa',
    },
    title: {
        display: 'block',
        margin: '0',
        paddingTop: '2vw',
        textAlign: 'left',
        textIndent: '2vw',
    },
    searchLine: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 2vw',
    },
    searchTags: {
        position: 'relative',
        display: 'inline-block',
        height: '8vw',
        margin: '1.3vw 3.4vw 1.3vw 0',
        // width: 21%;
        padding: '0 4vw',
        color: 'rgba(65, 65, 65, 1)',
        fontWeight: '400',
        fontSize: '4vw',
        lineHeight: '8vw',
        textAlign: 'center',
        background: 'rgba(245, 245, 245, 1)',
        borderRadius: '0.8vw',
    },
    searchX: {
        position: 'absolute',
        top: '-1vw',
        right: '-1vw',
        width: '4vw',
        height: '4vw',
    },
    tagsNum: {
        position: 'absolute',
        top: '-1vw',
        right: '-1vw',
        width: '2.8vw',
        height: '2.8vw',
        color: '#fff',
        fontSize: '2vw',
        lineHeight: '2.8vw',
        backgroundColor: '#ff0101',
        borderRadius: '50%',
    },
    tagsActive: {
        color: 'rgba(255, 255, 255, 1) !important',
        background: '#4e91ff !important',
    },
    searchPosition: {
        zIndex: '5',
        display: 'flex',
        width: '100%',
        height: '80vw',
        backgroundColor: '#fff',
    },
    left: {
        background: 'rgba(249, 249, 249, 1)',
    },
    leftCommon: {
        display: 'flex',
        height: '5vw',
        padding: '2vw 0',
        color: '#333333',
        fontWeight: '400',
        fontSize: '4.4vw',
        fontFamily: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
        lineHeight: '5vw',
        cursor:"pointer"
    },
    positionfirstStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        overflow: 'hidden',
        overflowY: 'scroll',
        textAlign: 'center',
        borderRight: '1px solid #ede9e9',
        '& a:link, a:visited, a:hover, a:active': {
          textDecoration: 'none',
          color:'#333333'
      }
    },
    leftLine: {
        width: '0.4vw',
        marginRight: '2vw',
        opacity: '0',
    },
    positionfirstActive: {
        color: '#D46F15',
        backgroundColor: '#D46F15',
        opacity: 1,
    },
    positionnameActive: {
        color: '#D46F15',
    },
    positionsecondStyle: {
        overflow: 'scroll',
        position: 'relative',
        flexDirection: 'column',
        /* display: flex; */
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        textAlign: 'center',
        borderRight: '0.02rem solid rgba(203, 203, 203, 1)',
    },
    postionList: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        boxSizing: 'border-box',
        padding: '1vw',
        overflow: 'hidden',
        overflowY: 'scroll',
        background: 'rgba(249, 249, 249, 1)',
    },
    leftPost: {
        display: 'flex',
        backgroundColor: '#F2F2F2',
        letterSpacing: '0.3vw',
        alignItems: 'center',
        justifyContent: 'center',
        height: '5vw',
        marginRight: '2vw',
        marginBottom: '2.5vw',
        padding: '0.9vw 2.5vw',
        color: '#333333',
        fontWeight: '400',
        fontSize: '4vw !important',
        fontFamily: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
        borderRadius: '0.8vw',
    },
    rightActive: {
        color: '#4e91ff',
        border: '1px solid #4e91ff',
    },
    searchBtns: {
        position: 'fixed',
        bottom: '0',
        right: '0',
        display: 'flex',
        width: '70%',
        height: '10vw',
        '& button': {
            width: '50%',
            height: '10vw',
            fontSize: '4vw',
            lineHeight: '10vw',
            border: 'none',
        },
    },
    confirmBtn: {
        color: '#fff',
        backgroundColor: '#4e91ff',
    },
    personalPositional: {
        height: '6vw',
    },
    personalPostionList: {
        height: '5.4vw !important',
    },
    postView: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
      borderBottom: '1px solid #ede9e9',
      padding: '0vw 4vw',
      marginBottom: '3vw',
      paddingBottom: '1vw'
    },
    postViewChild: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: '3vw'
    }
  });

const SearchContain = observer(() => {
  const styles = searchBoxStyles();

  const scrollRef = useRef()
  const rightRef = useRef()
  

  // const [allPost,setAllPost] = useState([])
  const { toastClick } = ToastStore;
  const { personalChoiceList , getPersonalIndustryId, addPersonalPost, isFrom } = ListStore;
  const { setProfessionalTypeList2, setShowSelectJobPop } = PersonalStore
  const { addChoicePost, setTabId, rightScrollTop, setRightScrollTop } = ListStore;
  const [ leftIndex, setLeftIndex ] = useState(9);
  const { statusId, setStatusId, choiceId, updateChoiceId, IndustryId, getIndustryId, choiceList, setChoiceName, choiceName, getFirstPostSearch, getPostList, postList, geListData, allPost,setAllPost, setScrollTop, setToTop  } = ListStore;
  // 点击一级
  const clickPostFirst = useCallback((item) => {
    if (item.industry_id === 0) {
      const obj = {
        professional_id: 0,
        professional_name: '全部职位'
      }
      getIndustryId(item.industry_id);
      clickPostSecond(obj)
    } else {
      if (isFrom === 'personal') {
        getPersonalIndustryId(item.industry_id);
      } else {
        getIndustryId(item.industry_id);
      }
      toJS(postList).map((v) => {
        if (v.industry_id === item.industry_id) {
          setAllPost(v.professionals);
        }
        return true;
      });
    }
  })

  const toTop = useCallback(()=>{
    // todo: 回到顶部
    setScrollTop(0);
    setToTop(true)
  })

  const clickPostSecond = useCallback((item, industry_id ) => {
    setStatusId(industry_id)
    console.log(`industry_id:${industry_id}`)
    const industryArr =
      isFrom === 'personal'
        ? toJS(personalChoiceList)
        : toJS(choiceList);
    const idArr = industryArr.map((v) => v.professional_id);
    const index = idArr.indexOf(item.professional_id);
    if (isFrom !== 'personal') {
      const choiceIndustry = [];
        if (index === -1) {
          choiceIndustry.push(item);
          setChoiceName(item.professional_name)
        } else {
          choiceIndustry.splice(index, 1);
          setChoiceName('')
        }
        addChoicePost(choiceIndustry);
        const choiceId = [];
        choiceIndustry.map((item) => {
          choiceId.push(item.professional_id);
        });
        updateChoiceId(choiceId)
        affirmBox()
    } else {
      if (industryArr.length === 5 && index === -1) {
        toastClick('最多能选5个', 'warning','info');
      } else {
        const choiceIndustry = [...industryArr];
        if (index === -1) {
          choiceIndustry.push(item);
        } else {
          choiceIndustry.splice(index, 1);
        }
        if (isFrom === 'personal') {
          addPersonalPost(choiceIndustry);
        } else {
          addChoicePost(choiceIndustry);
        }
        const choiceId = [];
        choiceIndustry.map((item) => {
          choiceId.push(item.professional_id);
        });
        updateChoiceId(choiceId)
      }
    }
  })

  // 删除
  const delSelect = useCallback((e, index) => {
    e.stopPropagation();
    if (isFrom === 'personal') {
      const personalParams = toJS(personalChoiceList);
      personalParams.splice(index, 1);
      addPersonalPost(personalParams);
      const choiceId = [];
      personalParams.map((item) => {
        choiceId.push(item.professional_id);
      });
      updateChoiceId(choiceId)
    } else {
      const params = toJS(choiceList);
      params.splice(index, 1);
      addChoicePost(params);
      const choiceId = [];
      params.map((item) => {
        choiceId.push(item.professional_id);
      });
      updateChoiceId(choiceId)
    }

  })

   // 重置
   const cancelBox = useCallback(() => {
    if (isFrom === 'personal') {
      addPersonalPost([]);
      updateChoiceId([])
      getPersonalIndustryId(postList[0].industry_id);
    } else {
      addChoicePost([]);
      getIndustryId(postList[0].industry_id);
      geListData(TypeForGetListData.Search);
      setTabId(0);
    }
  })

  // 确认
  const affirmBox = useCallback(() => {
    if (isFrom === 'personal') {
      // 再次进入的时候显示第一条选中的那一项
      if (personalChoiceList.length > 0) {
        index: for (let i = 0; i < postList.length; i += 1) {
          for (
            let j = 0;
            j < postList[i].professionals.length;
            j += 1
          ) {
            if (
              postList[i].professionals[j].professional_id ===
              personalChoiceList[0].professional_id
            ) {
              getPersonalIndustryId(
                postList[i].industry_id
              );
              // eslint-disable-next-line no-labels
              break index;
            }
          }
        }
      }
      setShowSelectJobPop(false)
      // confirmPosition();
    } else {
      // 再次进入的时候显示第一条选中的那一项
      _czc.push(['_trackEvent', 'C端首页', '全部职位'])
      gio('track','filterClick',{
        'filterName_var': '全部职位'})
      toTop();
      if (choiceList.length > 0) {
        // eslint-disable-next-line no-labels
        index: for (let i = 0; i < postList.length; i += 1) {
          for (
            let j = 0;
            j < postList[i].professionals.length;
            j += 1
          ) {
            if (
              postList[i].professionals[j].professional_id ===
              choiceList[0].professional_id
            ) {
              getIndustryId(postList[i].industry_id);
              // eslint-disable-next-line no-labels
              break index;
            }
          }
        }
      } else if (IndustryId !== postList[0].industry_id) {
        // 处理搜索行业的情况
        // 不是热门
        postList.map((val) => {
          if (IndustryId === val.industry_id) {
            getFirstPostSearch(val.professionals);
          }
          return true;
        });
      } else {
        // 热门的时候 => 搜索全部
        getFirstPostSearch([]);
      }
      // 埋点处理
      if (IndustryId !== postList[0].industry_id) {
        happenCounts({
          HappenModule: 'firstTab',
          HappenValue: 'search',
          HappenPerson: IndustryId.toString(),
          HappenDevice: localStorage.getItem('UA'),
          Happensource: 'H5',
        });
      }
      if (choiceList.length > 0) {
        const choiceId = choiceList.map((v) => v.professional_id);
        happenCounts({
          HappenModule: 'secondTab',
          HappenValue: 'search',
          HappenPerson: choiceId.join(','),
          HappenDevice: localStorage.getItem('UA'),
          Happensource: 'H5',
        });
      }
      // setLoadingMore(true);
      // getNewestData();
      // saveScrollOffset(0);
      // handlerForRestoreList();
      geListData(TypeForGetListData.Search);
      // setLoadingMore(false);
      setTabId(0);
    }
  })
  
  let renderList = isFrom === 'personal' ? personalChoiceList : choiceList
  console.log(renderList)
  if (isFrom === 'personal' && renderList.length > 0 && renderList[0].professional_id == 0) {
    addPersonalPost([])
    renderList = []
  }
  const renderChoiceId = []
  renderList.map((item) => {
    renderChoiceId.push(item.professional_id);
    return true;
  });

	useEffect(() => {
    console.log(statusId)
    if (isFrom === 'personal') {
      // document.getElementById(`industry${IndustryId}`).click();
    } else {
      if (statusId !== 0 && isFrom != 'personal') {
        console.log('进来了,', statusId)
        // document.getElementById(`industry${statusId}`).click();
        rightRef.current.scrollTop = rightScrollTop
      }
    }
  }, [isFrom]);

  const onscroll = e =>{
    e.preventDefault();
    if (isFrom === 'index') {
      setRightScrollTop(rightRef.current.scrollTop)
    }
    console.log(toJS(postList))
    for (let j = 0; j < toJS(postList).length; j++) {
      document.getElementById(`industryCss1${toJS(postList)[j].industry_id}`).className = `${styles.leftLine}`
      document.getElementById(`industryCss2${toJS(postList)[j].industry_id}`).className = ''
    }
    let currentId = 0
    let currentIndex = 0
    for (let i = 0; i < toJS(postList).length; i++) {
      if (document.getElementById(toJS(postList)[i].industry_id).getBoundingClientRect().top <= 141.515625 ) {
        currentId = toJS(postList)[i].industry_id
        currentIndex = i + 1
      }
    }
    document.getElementById(`industryCss1${currentId}`).className = `${styles.leftLine} ${styles.positionfirstActive}`
    document.getElementById(`industryCss2${currentId}`).className = styles.positionnameActive

    // if (document.getElementById(`industry${currentId}`).getBoundingClientRect().top >= 480.765625 ) {
    if ( currentIndex > leftIndex || currentIndex <= leftIndex - 9 ) {
      setLeftIndex(currentIndex)
      const aHeight = document.getElementById(`industry${currentId}`).offsetHeight
      scrollRef.current.scrollTop = (currentIndex - 9) * aHeight
    }
    console.log(document.getElementById(`industry${currentId}`).getBoundingClientRect().top)
  }

    return (
        <div className={styles.screen}>
          {
            isFrom === 'personal' &&
            <div className={styles.ischoice}>
              <div className={styles.title}>
                <span>已选择{renderList.length}，最多能选5个</span>
              </div>
              <div className={styles.searchLine}>
                {renderList.length > 0 &&
                  renderList.map((item, index) => (
                    <div
                      className={`${styles.searchTags} ${styles.tagsActive}`}
                      key={item.industry_id}
                      onClick={(e) => delSelect(e, index)}
                    >
                      {item.professional_name}
                      <img
                        src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/eda1765d6e86d30ae566ac0f53faae98.jpg', { w: 40, h: 0 })}`}
                        alt="周薪薪直聘"
                        className={styles.searchX}
                        onClick={(e) => delSelect(e, index)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          }
        {/* 列表内容 */}
        <div
          className={`${styles.searchPosition}`}
          style={{ background: 'rgba(249,249,249,1)', height : isFrom === 'personal' ? '100vw' : '80vw'}}
        >
          <div className={`${styles.left} ${styles.positionfirstStyle}`} ref={scrollRef} >
            {toJS(postList) && isFrom === 'index' &&
              toJS(postList).length > 0 &&
              toJS(postList).map((item) => (
                <a
                  href={`#${item.industry_id}`}
                  key={item.industry_id}
                  className={`${styles['leftCommon']}`}
                  onClick={() => clickPostFirst(item)}
                  id={`industry${item.industry_id}`}
                >
                  <div
                    id={`industryCss1${item.industry_id}`}
                    className={`${styles.leftLine} ${
                      IndustryId === item.industry_id
                        ? styles.positionfirstActive
                        : ''
                    }`}
                  />
                  <div
                    id={`industryCss2${item.industry_id}`}
                    className={`${
                      IndustryId === item.industry_id
                        ? styles.positionnameActive
                        : ''
                    }`}
                  >
                    {item.industry_name}
                  </div>
                </a>
              ))}
              {toJS(postList) && isFrom === 'personal' &&
              toJS(postList).length > 0 &&
              toJS(postList).map((item) => (
                <a
                  href={`#${item.industry_id}`}
                  key={item.industry_id}
                  onClick={() => clickPostFirst(item)}
                  className={`${styles['leftCommon']}`}
                  id={`industry${item.industry_id}`}
                  style={{display: item.industry_id === 0 ? 'none' : 'block'}}
                >
                  <div
                    id={`industryCss1${item.industry_id}`}
                    className={`${styles.leftLine} ${
                      getPersonalIndustryId === item.industry_id
                        ? styles.positionfirstActive
                        : ''
                    }`}
                  />
                  <div
                    id={`industryCss2${item.industry_id}`}
                    className={`${
                      getPersonalIndustryId === item.industry_id
                        ? styles.positionnameActive
                        : ''
                    }`}
                  >
                    {item.industry_name}
                  </div>
                </a>
              ))}
          </div>
          <div className={`${styles.left} ${styles.positionsecondStyle}`} onScroll={onscroll} ref={rightRef}>
            <div
              className={`${styles.postionList}`}
            >
              {toJS(postList) &&
              toJS(postList).length > 0 &&
              toJS(postList).map((item) => (
                <a className={styles.postView} name={item.industry_id} id={item.industry_id} style={{display: item.industry_name === '全部职位' ? 'none' : 'block'}}>
                  <div style={{ color: '#333333', fontSize: '4.4vw'}}>{item.industry_name}</div>
                  <div className={styles.postViewChild}>
                  {
                    item.professionals && item.professionals.length > 0 && item.professionals.map((item2) => (
                    <div
                      key={item2.professional_id}
                      onClick={() => clickPostSecond(item2, item.industry_id)}
                      className={`${styles.leftPost} ${
                        renderChoiceId.includes(item2.professional_id)
                          ? styles.rightActive
                          : ''
                    }`}
                    >
                      {item2.professional_name}
                    </div>
                    ))
                  }
                  </div>
                </a>
                ))}
            </div>
            {/* {
              isFrom === 'personal' &&
              <div className={styles.searchBtns}>
                <button type="submit" onClick={() => cancelBox()}>
                  重置
                </button>
                <button
                  type="submit"
                  className={styles.confirmBtn}
                  onClick={() => affirmBox()}
                >
                  确定
                </button>
              </div>
            } */}
          </div>
        </div>
        <Toast></Toast>
      </div>
    )
})

export default SearchContain;
