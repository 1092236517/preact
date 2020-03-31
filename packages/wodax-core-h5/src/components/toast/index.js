import React from 'preact/compat';
import { toJS } from 'mobx';
import { useCallback, useEffect, useState, useRef } from 'preact/hooks';
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import Store from "./store"


import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import { Alert } from '@material-ui/lab';
import { getImgFormatUrl } from "@/lib/base/common";

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const toastStyle = makeStyles({
  mask:{
    position:'fixed',
    top:'0',
    left:'0',
    backgroundColor:'rgba(0,0,0,0.15)',
    height: '100%',
    width: '100%',
    zIndex: '999',
    display: 'flex',
    flexDirection: 'column',
    alignContent:'center',
    textAlign:'center',
    '& img':{
      width: '30%',
      margin: '0 auto',
      transform: 'translateY(-50%)',
      position: 'relative',
      top: '50%',
    },
    '& span':{
      color:' #333',
      fontSize:' 4vw',
      transform: 'translateY(-60%)',
      position: 'relative',
      top: '50%',
    }
  },
  'mask2': {
    position:'fixed',
    top:'0',
    left:'0',
    height: '100%',
    width: '100%',
    zIndex: '999',
    display: 'flex',
    flexDirection: 'column',
    alignContent:'center',
    textAlign:'center',
  }
})

const Toast = observer(() => {
    const styles = toastStyle();
    // const [open, setOpen] = useState(false);
    // const [message, setMessage] = useState(undefined);
    // const [color, setColor] = useState(undefined);

    const { open, setOpen, message, color, type } = Store;

    const handleClose = useCallback(() => {
        setTimeout(()=>{
          setOpen(false);
        },2000)
    })

  useEffect(()=>{
    if(open){
      handleClose()
    }
  },[open])

    return (
        <div style={"z-index: 999"}>
          {
            type==='loading' && open ?
              (
                <div className={styles.mask}>
                  <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/8ad9580317c7f50faef7390e49029b92.jpg', { w: 354, h: 0 })}`}></img>
                  <span>{message || '正在加载中'}</span>
                </div>
              ):(
                <Snackbar
                  open={open}
                  onClose={()=>handleClose()}
                  transitionComponent={<Slide SlideTransition direction="up" />}
                  message={message}
                  className={styles.mask2}
                >
                  <Alert severity={color}>{message}</Alert>
                </Snackbar>
              )
          }
        </div>
    );
})
export default Toast
