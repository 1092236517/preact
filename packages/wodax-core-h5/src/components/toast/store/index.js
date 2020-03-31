import { action, observable, runInAction } from 'mobx';
import cookie from "react-cookies";


const $store = observable({
  open:false,
  setOpen: (newVal) => {
    $store.open = newVal;
  },
  message:'',
  color:'', // error,warning,info,success
  type:'', //loading
  toastClick: (message,color,type,status) => {
    $store.color = color;
    $store.message = message;
    $store.open = status === false ? status : true;
    $store.type = type;
  }
}, {
});

export default $store;
