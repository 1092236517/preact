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

import FeedBackStore from './store';

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const profileclasses = makeStyles({
    detailInfo: {
        paddingBottom: '0.5vw',
        backgroundColor: '#fff'
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

  const { subFeedBack, detailPics, uploaddata, ImgList, setImgList, submitStatus, from, setFrom, setSubmitStatus, initData } = FeedBackStore;
  const { showLogin } = LoginStore;

  const [myName, setMyName] = useState('');
  const [myMobile, setMyMobile] = useState('');
  const [opinion, setOpinion] = useState('');

  const subLogin = useCallback(() => {
        if (isEmpty(myName)) {
        toastClick('请填写姓名','warning','info')
            return
        }
        if (isEmpty(myMobile)) {
        toastClick('请填写手机号','warning','info')
        return
        } else {
        if (!/^1[3456789]\d{9}$/i.test(myMobile)) {
            toastClick('请填写有效的手机号','warning','info')
            return
        }
        }
        if (isEmpty(opinion)) {
            toastClick('请输入您的意见或建议','warning','info')
            return
        }
        subFeedBack({ Phone: myMobile, Name: myName, DataSource: from === 'gzh' ? 2 : 1, Opinion: opinion, ImageList: ImgList });
  })

  // 上传图片的操作
  const handleUpload = useCallback(() => {
    const file = document.getElementById('pic')
    console.log(file.files)
    if(ImgList.length >= 3) {
        toastClick('最多只能上传三张图片','warning','info')
    } else if (file.files.length > 1) {
        toastClick('请单张上传','warning','info')
    } else {
        for (let i = 0; i < file.files.length; i++) {
            var reader = new FileReader();
            reader.readAsDataURL(file.files[i]); // 读出 base64
            reader.onloadend = function () {
                // 图片的 base64 格式, 可以直接当成 img 的 src 属性值        
                var dataURL = reader.result.replace('data:image/png;base64,','').replace('data:image/jpeg;base64,','');
                // 下面逻辑处理
                uploaddata(dataURL)
            };
        }
    }
  })

  const removeImg = useCallback((index) => {
    ImgList.splice(index, 1)
    setImgList(ImgList)
  })

  const submitOk = useCallback(() => {
    setSubmitStatus(false)
    setImgList([])
    setOpinion('')
    if (from !== 'gzh') {
      route(`/profile`)
    }
  })

  useEffect(() => {
    gio('page.set', {
        'pageType_pvar': '我要反馈页',
        'companyName_pvar': '无',
        'postName_pvar': '无'
        });
    if(localStorage.getItem('resumeDetail')) {
        setMyName(JSON.parse(localStorage.getItem('resumeDetail')).Name)
        setMyMobile(JSON.parse(localStorage.getItem('resumeDetail')).Phone)
      }
      if (getUrlParam('from') === 'gzh'){
        setFrom('gzh')
      }
  }, []);

  return <div className={classes.detailInfo} id='search_detail' style={`${showLogin?'position:fixed':''}`}>
      {
          from !== 'gzh' &&
          <div className={classes.backPage}>
            <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/963b1bf6ac8c47f464c952cb6e589a88.jpg', { w: 20, h: 0 })}`} alt="周薪薪直聘" className={classes.backImg} onClick={() => {route(`/profile`)}}/>
            <div className={classes.indexName}>我要反馈</div>
            <div className={classes.right} />
        </div>
      }
    <div className={classes.jobInfo} style={from === 'gzh' ? { paddingTop : 0 } : ''}>
        <div className={classes.formRow}>
            <span>姓名：</span>
            <input value={myName} onChange={(e)=>{setMyName(e.target.value)}} placeholder="请输入你的姓名" maxLength={10} className={classes.inp} type='text'></input>
        </div>
        <div className={classes.formRow}>
            <span>手机号：</span>
            <input value={myMobile} onChange={(e)=>{setMyMobile(e.target.value)}} placeholder="请输入你的手机号" inputProps={{ 'aria-label': 'description' }} className={classes.inp} type='tel' maxLength={11}></input>
        </div>
        <div className={classes.formRow}>
            <span>反馈内容：</span>
            <TextareaAutosize
                rowsMin={3}
                rowsMax={10}
                aria-label="请输入您的意见或建议"
                placeholder="请输入您的意见或建议"
                defaultValue=""
                className={classes.textarea}
                value={opinion}
                onChange={(e)=>{setOpinion(e.target.value)}}
                />
        </div>
        <div className={classes.formRow}>
            <span>图片上传：</span>
            <div className={classes.imgView}>
                {
                    ImgList.length > 0 && ImgList.map((item, index) => (
                        <div className={classes.imgView2} style={index === 0 ? { marginLeft : 0} : {}}>
                            <img src="http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/1cb2a79c99e10d05328f9ed423d0d8b6.jpg" className={classes.searchX} onClick={() => removeImg(index)} />
                            <img src={item} className={classes.mainImg} />
                        </div>
                    ))
                }
                {
                    ImgList.length < 3 &&
                    <div className={classes.imgView2} style={ImgList.length < 1 ? { marginLeft : 0} : {}}>
                        <img src="http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/e792adeb319ca9cce05c0e5e7d12d7d8.jpg" className={classes.mainImg}/>
                        <input type="file" accept='image/*' id="pic" name="pic" multiple onChange={() => handleUpload()} className={classes.uploadImg} style={{ opacity: 0 }} />
                    </div>
                }
            </div>
        </div>
        
    </div>
    <div className={classes.submit} onClick={() => subLogin()}>提交</div>
    {
        submitStatus &&
        <div className={classes.mask}>
            <div className={classes.maskContent}>
                <div className={classes.contentTitle}>提交成功</div>
                <div className={classes.contentText}>感谢你的反馈，我们会尽快与你联系</div>
                <div className={classes.ok} onClick={() => {submitOk()}}>确定</div>
            </div>
        </div>
    }
    <Toast/>
</div>;
});

export default FeedBack;
