import React from 'preact/compat';
import { toJS } from 'mobx';
import { useCallback, useEffect, useState, useRef } from 'preact/hooks';
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import ListStore, { TypeForGetListData } from '../wd_index_list/store';
import PersonalStore from '../../pages/personal/store';
import ViewManagerStore from '@/components/wd_index_list/store/view.manager'
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
        margin: '0 auto',
        color: 'rgba(65, 65, 65, 1)',
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
        height: '6vw',
        margin: '1.3vw 3.4vw 1.3vw 0',
        // width: 21%;
        padding: '0 2vw',
        color: 'rgba(65, 65, 65, 1)',
        fontWeight: '400',
        fontSize: '4vw',
        lineHeight: '6vw',
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
        height: '50vw',
        backgroundColor: '#fff',
    },
    left: {
        background: 'rgba(249, 249, 249, 1)',
    },
    leftCommon: {
        display: 'flex',
        height: '5vw',
        marginBottom: '3vw',
        color: 'rgba(106, 106, 106, 1)',
        fontWeight: '400',
        fontSize: '4vw',
        fontFamily: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
        lineHeight: '5vw',
        cursor:"pointer",
    },
    positionfirstStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        overflow: 'hidden',
        overflowY: 'scroll',
        textAlign: 'center',
        borderRight: '0.2vw solid rgba(203, 203, 203, 1)',
    },
    leftLine: {
        width: '0.4vw',
        marginRight: '2vw',
        opacity: '0',
    },
    positionfirstActive: {
        color: '#4e91ff',
        backgroundColor: '#4e91ff',
        opacity: 1,
    },
    positionnameActive: {
        color: '#4e91ff',
    },
    positionsecondStyle: {
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
        height: '40.4vw',
        padding: '1vw',
        overflow: 'hidden',
        overflowY: 'scroll',
        background: 'rgba(249, 249, 249, 1)',
    },
    leftPost: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '5vw',
        marginRight: '2vw',
        marginBottom: '2vw',
        padding: '0.5vw 2.5vw',
        color: 'rgba(106, 106, 106, 1)',
        fontWeight: '400',
        fontSize: '4vw !important',
        fontFamily: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
        border: '0.2vw solid rgb(203, 203, 203)',
        borderRadius: '0.8vw',
    },
    rightActive: {
        color: '#4e91ff',
        border: '1px solid #4e91ff',
    },
    searchBtns: {
        position: 'absolute',
        bottom: '0',
        display: 'flex',
        width: '100%',
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
    }
  });

const SearchContain = observer(() => {
  const styles = searchBoxStyles();

  // const [allPost,setAllPost] = useState([])
  const { toastClick } = ToastStore;
  const { personalChoiceList , getPersonalIndustryId, addPersonalPost, isFrom } = ListStore;
  const { setProfessionalTypeList2, setShowSelectJobPop } = PersonalStore
  const { addChoicePost, setTabId } = ListStore;
  const { choiceId, updateChoiceId, IndustryId, getIndustryId, choiceList, getFirstPostSearch, getPostList, postList, geListData, allPost,setAllPost } = ListStore;
  // 点击一级
  const clickPostFirst = useCallback((id) => {
    if (isFrom === 'personal') {
      getPersonalIndustryId(id);
    } else {
      getIndustryId(id);
    }
    getIndustryId(id);
    toJS(postList).map((v) => {
      if (v.industry_id === id) {
        setAllPost(v.professionals);
      }
      return true;
    });
  })

  const toTop = useCallback(()=>{
    const { setBackToTop } = ViewManagerStore;
    setBackToTop(true);
  })

  const clickPostSecond = useCallback((item) => {
    const industryArr =
      isFrom === 'personal'
        ? toJS(personalChoiceList)
        : toJS(choiceList);
    const idArr = industryArr.map((v) => v.professional_id);
    const index = idArr.indexOf(item.professional_id);
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
    _czc.push(['_trackEvent', 'C端首页', '通过商圈查询'])
    toTop();
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

  const renderList = isFrom === 'personal' ? personalChoiceList : choiceList
  const renderChoiceId = []
  renderList.map((item) => {
    renderChoiceId.push(item.professional_id);
    return true;
  });

	useEffect(() => {
    getPostList();
  }, []);

    return (
        <div className={styles.screen}>
        <div className={styles.ischoice}>
          <div className={styles.title}>
            {renderList.length > 0 && (
              <span>已选择{renderList.length}，最多能选5个</span>
            )}
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
        {/* 列表内容 */}
        <div
          className={`${styles.searchPosition}`}
          style={{ background: 'rgba(249,249,249,1)' }}
        >
          <div className={`${styles.left} ${styles.positionfirstStyle}`}>
            {toJS(postList) && isFrom === 'index' &&
              toJS(postList).length > 0 &&
              toJS(postList).map((item) => (
                <div
                  key={item.industry_id}
                  onClick={() => clickPostFirst(item.industry_id)}
                  className={`${styles['leftCommon']}`}
                >
                  <div
                    className={`${styles.leftLine} ${
                      IndustryId === item.industry_id
                        ? styles.positionfirstActive
                        : ''
                    }`}
                  />
                  <div
                    className={`${
                      IndustryId === item.industry_id
                        ? styles.positionnameActive
                        : ''
                    }`}
                  >
                    {item.industry_name}
                  </div>
                </div>
              ))}
              {toJS(postList) && isFrom === 'personal' &&
              toJS(postList).length > 0 &&
              toJS(postList).map((item) => (
                <div
                  key={item.industry_id}
                  onClick={() => clickPostFirst(item.industry_id)}
                  className={`${styles['leftCommon']}`}
                >
                  <div
                    className={`${styles.leftLine} ${
                      getPersonalIndustryId === item.industry_id
                        ? styles.positionfirstActive
                        : ''
                    }`}
                  />
                  <div
                    className={`${
                      getPersonalIndustryId === item.industry_id
                        ? styles.positionnameActive
                        : ''
                    }`}
                  >
                    {item.industry_name}
                  </div>
                </div>
              ))}
          </div>
          <div className={`${styles.left} ${styles.positionsecondStyle}`}>
            <div
              className={`${styles.postionList}`}
            >
              {allPost &&
                allPost.map((item) => (
                  <div
                    key={item.professional_id}
                    onClick={() => clickPostSecond(item)}
                    className={`${styles.leftPost} ${
                      renderChoiceId.includes(item.professional_id)
                        ? styles.rightActive
                        : ''
                    }`}
                  >
                    {item.professional_name}
                  </div>
                ))}
            </div>
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
          </div>
        </div>
        <Toast></Toast>
      </div>
    )
})

export default SearchContain;
