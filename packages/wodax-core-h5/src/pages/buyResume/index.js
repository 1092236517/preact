import { makeStyles } from '@material-ui/core/styles';
import { observer, useLocalStore } from 'mobx-react-lite';

import { route } from 'preact-router'
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';
import { isEmpty, getImgFormatUrl, getUrlParam } from '@/lib/base/common';
import { getStorage, setStorage } from "@/lib/base/storage";
import { Upload, Icon, Modal } from 'antd';
import LoginStore from '@/components/login/store';
import Input from '@material-ui/core/Input';
import ToastStore from '@/components/toast/store'
import Toast from "@/components/toast";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Index from "@/components/buy_list"

import FeedBackStore from './store';

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const profileclasses = makeStyles({
    detailInfo: {
        height:'100vh',
        paddingBottom: '0.5vw',
        backgroundColor: 'rgba(242, 242, 242, 1)'
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
    },
    jobInfo: {
        padding: '12vw 3.6vw 3.6vw'
    },
    formRow:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: '6vw',
        position: 'relative',
        width:'100%',
        minHeight:'8vw',
        '& span':{
            width:'28%',
            textAlign:'left',
        }
    },
    inp:{
        fontSize: '4vw',
        textIndent: '1vw',
        marginLeft: '5px',
        borderBottom: '1px solid #ccc',
        width:'70%',
        height:'100%',
        lineHeight:'6vw',
        outline: 'none',
        border: 'none'
    },
    textarea: {
        height: '30vw !important',
        width: '68%',
        fontSize: '4vw',
        marginLeft: '1vw',
        resize: 'none',
        outline: 'none',
        border: '1px solid #ccc'
    },
    submit: {
        width: '90%',
        height: '12vw',
        margin: '0 auto',
        background: 'rgba(78,145,255,1)',
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: '12vw',
        borderRadius: '8px',
        marginTop: '7vw',
        fontSize: '4.5vw'
    },
    uploadImg: {
        width: '18vw',
        height: '18vw'
    },
    imgView: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: '2vw',
        width: '68%',
    },
    imgView2: {
        position: 'relative',
        width: '18vw',
        height: '18vw',
        marginLeft: '4vw',
    },
    searchX: {
        position: 'absolute',
        top: '-2.4vw',
        right: '-2.4vw',
        width: '6vw',
        height: '6vw',
        zIndex: '2'
    },
    mainImg: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '18vw',
        height: '18vw',
    },
    mask: {
        position: 'fixed',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: '100'
    },
    maskContent: {
        width: '80vw',
        background: '#fff',
        borderRadius: '5px',
        padding: '3vw 3.2vw 4.4vw 3.2vw',
        zIndex: '100',
        position: 'relative',
        textAlign: 'center'
    },
    contentTitle: {
        fontSize: '6vw',
    },
    contentText: {
        fontSize: '5vw',
        marginTop: '4vw'
    },
    ok: {
        width: '42vw',
        height: '12vw',
        margin: '0 auto',
        background: 'rgba(78,145,255,1)',
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: '12vw',
        borderRadius: '8px',
        marginTop: '7vw',
        fontSize: '4.5vw'
    }
});

const FeedBack = observer(() => {
  const classes = profileclasses()

  const [initialed, setInitialed] = useState(false);
  const { toastClick } = ToastStore;

  const { subFeedBack, detailPics, uploaddata, ImgList, setImgList, submitStatus, from, setFrom, setSubmitStatusm, initData } = FeedBackStore;
  const { showLogin } = LoginStore;

  const [myName, setMyName] = useState('');
  const [myMobile, setMyMobile] = useState('');
  const [opinion, setOpinion] = useState('');

  useEffect(() => {
    
  }, []);

  return <div className={classes.detailInfo} id='search_detail' style={`${showLogin?'position:fixed':''}`}>
      {
          from !== 'gzh' &&
          <div className={classes.backPage}>
            <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/963b1bf6ac8c47f464c952cb6e589a88.jpg', { w: 20, h: 0 })}`} alt="周薪薪直聘" className={classes.backImg} onClick={() => {route(`/profile`)}}/>
            <div className={classes.indexName}>我申请的职位</div>
            <div className={classes.right} />
        </div>
      }
      <Index></Index>
</div>;
});

export default FeedBack;
