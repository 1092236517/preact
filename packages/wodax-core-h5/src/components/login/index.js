import React from 'preact/compat';
import { toJS } from 'mobx';
import { useCallback, useEffect, useState, useRef } from 'preact/hooks';
import { observer } from "mobx-react-lite";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import ToastStore from '@/components/toast/store'
import Toast from "@/components/toast";

import Store from './store'
import { getImgFormatUrl, isEmpty, PH, VW } from "@/lib/base/common";
import { makeStyles } from "@material-ui/core/styles";

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};


const LoginStyles = makeStyles({
    loginView:{
        position: 'fixed',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0, 0, 0, 0.15)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: '100000',
    },
    maskContent:{
        width: '70%',
        background: '#fff',
        borderRadius: '5px',
        padding: '6vw',
        zIndex: '100',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    title:{
        textAlign: 'center',
        fontSize:'6vw',
        fontFamily:'PingFangSC-Medium',
        fontWeight:'550',
        color:'rgba(45,45,45,1)',
    },
    close:{
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '6vw',
        height: '6vw',
    },
    formRow:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '6vw',
        position: 'relative',
        width:'100%',
        height:'8vw',
        '& img':{
            width: '5vw',
            height: '7vw',
        },
        '& span':{
            width:'28%',
            textAlign:'left',
        }
    },
    'popUp-window-name-inp':{
        fontSize: '4vw',
        textIndent: '10px',
        marginLeft: '5px',
        border: '0',
        borderBottom: '1px solid #E9E9E9',
        width:'70%',
        height:'100%',
        lineHeight:'6vw',
    },
    valide: {
        color: '#4E91FF',
        right: '0',
        bottom: '2.2vw',
        padding: '0 0 0 2vw',
        position: 'absolute',
        fontSize: '3.5vw',
        borderLeft: '1px solid #E9E9E9',
    },
    subLogin:{
        marginTop: '10vw',
        width: '100%',
        height: '10vw',
        lineHeight: '10vw',
        color: '#ffffff',
        fontSize: '5vw',
        background:'rgba(78,145,255,1)',
        borderRadius:'8px',
        textAlign: 'center',
    }


})

const Login = observer(() => {
    const styles = LoginStyles();

    const { getVCode, getLoginIn, getSave, setShowLogin, clickWhere } = Store;
  // toast.toastClick('成功','success','loading')
    const { toastClick } = ToastStore;

    const [myName, setMyName] = useState('');
    const [sex, setSex] = useState('');
    const [myMobile, setMyMobile] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [remainTime, setRemainTime] = useState(0);
    const [codeText2, setCodeText2] = useState('获取验证码');
    const inputRef = useRef();
    const codeRef = useRef();
    const nameRef = useRef();

    const closeMask = useCallback(() => {
        env.addEventListener('touchmove', (e) => {
          // 执行滚动回调
          e.preventDefault()
        }, {
          passive: true //  禁止 passive 效果
        })
        setShowLogin(false)
    })

    const getCode = useCallback(() => {
        if (isEmpty(myMobile)) {
          toastClick('请填写手机号','warning','info')
          inputRef.current.focus();
          return
        } else {
          if (!/^1[3456789]\d{9}$/i.test(myMobile)) {
            toastClick('请填写有效的手机号','warning','info')
            inputRef.current.focus();
            return
          }
        }
        if (remainTime > 0) {
          return
        }
        getVCode(myMobile).then(res => {
            setRemainTime(60);
            setCodeText2('剩余60s');
            let timeCount = 60;
            let timeInterval = setInterval(function () {
                timeCount-=1
                setRemainTime(timeCount)
                if ( timeCount <= 0) {
                    setRemainTime(0);
                    setCodeText2('获取验证码');
                    clearInterval(timeInterval)
                    return
                }
                setCodeText2(`剩余${timeCount}s`);
            }, 1000)
        })
    })

    const subLogin = useCallback((e) => {
        e.stopPropagation();
        if (isEmpty(myName)) {
          toastClick('请填写姓名','warning','info')
          nameRef.current.focus();
            return
        }
        if (isEmpty(myMobile)) {
          inputRef.current.focus();
          toastClick('请填写手机号','warning','info')
          return
        } else {
          if (!/^1[3456789]\d{9}$/i.test(myMobile)) {
            inputRef.current.focus();
            toastClick('请填写有效的手机号','warning','info')
            return
          }
        }
        if (isEmpty(smsCode)) {
          codeRef.current.focus();
          toastClick('请填写验证码','warning','info')
            return
        }
        getLoginIn({ Mobile: myMobile, Code: smsCode, Name: myName });
    })

    const getPost = useCallback((e)=>{
        e.stopPropagation();
        if (isEmpty(myName)) {
          nameRef.current.focus();
          toastClick('请填写姓名','warning','info')
            return
        }
        if(isEmpty(sex)) {
          toastClick('选择性别','warning','info')
            return
        }
        if (isEmpty(myMobile)) {
          inputRef.current.focus();
          toastClick('请填写手机号','warning','info')
            return
        } else {
        if (!/^1[3456789]\d{9}$/i.test(myMobile)) {
          inputRef.current.focus();
          toastClick('请填写有效的手机号','warning','info')
            return
        }
        }
        if (isEmpty(smsCode)) {
          codeRef.current.focus();
          toastClick('请填写验证码','warning','info')
            return
        }
        getSave({Phone:myMobile,Code:smsCode,Name:myName,Sex:sex});
    })

    return(
        <div className={styles.loginView}>
            <div className={styles.maskContent}>
            <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/03820501714ce5b86727033fbe1d26a3.jpg', { w: 40, h: 0 })}`} className={styles.close} onClick={()=> setShowLogin(false)}></img>
            <div className={styles.title}>登录周薪薪直聘</div>
            <div className={styles.formRow}>
                <span>姓名：</span>
                <Input value={myName} inputRef={nameRef} onChange={(e)=>{setMyName(e.target.value)}} placeholder="请输入你的姓名" inputProps={{ 'aria-label': 'description', 'maxlength': '10' }} className={styles['popUp-window-name-inp']} type='text'></Input>
            </div>
            {
                clickWhere === 'resume' &&
                <div style="width:100%">
                    <div className={styles.formRow}>
                        <span>性别：</span>
                        <RadioGroup aria-label="gender" name="sex" value={sex} onChange={(e)=>{setSex(e.target.value)}} row>
                            <FormControlLabel
                            value="1"
                            control={<Radio color="primary" />}
                            label="男"
                            />
                            <FormControlLabel
                            value="2"
                            control={<Radio color="primary" />}
                            label="女"
                            />
                        </RadioGroup>
                    </div>
                </div>
            }
            <div className={styles.formRow}>
                <span>手机号：</span>
                <Input value={myMobile} inputRef={inputRef} onChange={(e)=>{setMyMobile(e.target.value)}} placeholder="请输入你的手机号" inputProps={{ 'aria-label': 'description' }} className={styles['popUp-window-name-inp']} type='tel' inputProps={{maxLength: 11}}></Input>
            </div>
            <div className={styles.formRow}>
                <span>验证码：</span>
                <Input value={smsCode} inputRef={codeRef} onChange={(e)=>{setSmsCode(e.target.value)}} placeholder="请输入验证码" inputProps={{ 'aria-label': 'description' }} className={styles['popUp-window-name-inp']} type='tel' inputProps={{maxLength: 6}} style="width:53%"></Input>
                <div onClick={()=> getCode()} className={styles.valide}>
                    {codeText2}
                </div>
            </div>
            {
                clickWhere==='resume'?
                (<div className={styles.subLogin} onClick={(e)=> getPost(e)}>登录</div>):
                (<div className={styles.subLogin} onClick={(e)=> subLogin(e)}>登录</div>)

            }
            {/* <div className={styles.subLogin} onClick={()=> subLogin()} onClick={`${clickWhere==='resume'}?${()=>getPost()}:${()=>subLogin()}`}>登录</div> */}
            </div>
          <Toast></Toast>
        </div>
    )
})

export default Login;
