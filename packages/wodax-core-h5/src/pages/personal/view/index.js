import React from 'preact/compat';
import { useState, useEffect, useRef } from 'preact/hooks';
import { observer, useLocalStore } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { route } from 'preact-router'

import StorePersonal from '../store'

import personalStyles from '../style'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import InputBase from '@material-ui/core/InputBase';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import SelectJob from './select_job'
import Button from '@material-ui/core/Button'

import { format } from 'date-fns';
import zhCN  from 'date-fns/locale/zh-CN'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { isEmpty, getImgFormatUrl } from '@/lib/base/common'
import ToastStore from '@/components/toast/store'
import Toast from "@/components/toast";
import cookie from 'react-cookies';
import PersonalJob from '@/pages/personalJob';
import ListStore from '@/components/list/store';

const optImageUrl = (url, opt) => {
  // return url;
  return getImgFormatUrl(url, opt)
};

const Personal = observer(() => {
  const { toastClick } = ToastStore;
  const classes = personalStyles();

  const { leftList, gePostData, showSelectJobPop, setShowSelectJobPop, getCodeDetail, getSave, isUpdate, setIsUpdate } = StorePersonal;

  const [ selectedDate, setSelectedDate] = React.useState(null);

  const { setIsFrom, personalChoiceList, postList, addPersonalPost, getPostList } = ListStore

  const elRef = useRef();

  const localStore = useLocalStore(() => (
    {
      gender: 1,
      setGender: (val) => {
        localStore.gender = val;
      },
      realName: '',
      setRealName:(e) => {
        localStore.realName = e.currentTarget.value
      },
      Mobile:'',
      setMobile:(e) => {
        localStore.Mobile = e.currentTarget.value
      },
      validate:'',
      setValidate:(e) => {
        localStore.validate = e.currentTarget.value
      },
    }
  ));

  useEffect(() => {
    setIsFrom('personal')
    gio('page.set', {
        'pageType_pvar': '填写简历页',
        'companyName_pvar': '无',
        'postName_pvar': '无'
        });
    console.log(JSON.parse(localStorage.getItem('personalFrom')))
    getPostList()
    // gePostData();
    getUserInfo();
    localStorage.setItem('isListInit', "false")
  }, []);

  const backFunc = () => {
    if(localStorage.getItem('isFrom') === 'detail') {
      route()
    }
  }

  const getUserInfo = () => {
    if (cookie.load('userPhone')){
      localStore.Mobile = cookie.load('userPhone')
      setIsUpdate(true)
    }
    if (localStorage.getItem('resumeDetail')) {
      const userInfo = JSON.parse(localStorage.getItem('resumeDetail'))
      localStore.gender = userInfo.Sex.toString()
      localStore.realName = userInfo.Name
      localStore.Mobile = userInfo.Phone
      if (!isEmpty(userInfo.Birth)) setSelectedDate(userInfo.Birth)
      setTimeout(function () {
        const data = [];
        toJS(postList).map((v) => {
          v.professionals.map((val) => {
            if (userInfo.ProfessionalTypeList.includes(val.professional_id)) {
              data.push(val);
            }
            return true;
          });
          return true;
        });
        const obj = {};
        const allData = data.reduce((item, next) => {
          if (!obj[next.professional_id]) {
            obj[next.professional_id] = true;
            item.push(next);
          }
          return item;
        }, []);
        addPersonalPost(allData);
      }, 2000)
      setIsUpdate(true)
    }
  }

  const BackNav = () => {
    return (
      <div className={classes.backPage}>
      <img src={`${optImageUrl('http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/963b1bf6ac8c47f464c952cb6e589a88.jpg', { w: 20, h: 0 })}`} alt="周薪薪直聘" className={classes.backImg} onClick={() => {history.back()}}/>
      <div className={classes.indexName}>选择岗位</div>
    </div>
    );
  };

  const ImageUpLoader = () => {
    return (
      <div className={classes.avatar}>
        <div className="img_uploader">
          <InputBase type="file" style={{width: '100%',height: '100%'}}/>
        </div>
        <span>找好工作，从头像开始</span>
      </div>
    )
  };

  const InputName = observer(() => {
    return (
      <div className={classes.unit}>
        <div className={classes.unitTitle}>姓名：</div>
        <input type="text" placeholder="请输入姓名" value={localStore.realName} onChange={localStore.setRealName}/>
      </div>
    )
  });

  const InputMobile = observer(() => {
    return (
      <div className={classes.unit}>
        <div className={classes.unitTitle}>手机号：</div>
        <input type="tel" placeholder="请输入号码" value={localStore.Mobile} onChange={localStore.setMobile} maxLength={11} readOnly={isUpdate}/>
      </div>
    )
  });

  const checkMobile = () => {
    const { Mobile } = localStore;
    if(isEmpty(Mobile)) {
      toastClick('请输入电话','warning','info');
      return false;
    }
    if (!/^1[3456789]\d{9}$/i.test(Mobile)) {
      toastClick('请填写有效的手机号','warning','info');
      return false;
    }
    getCodeDetail(Mobile);
  }

  const showPop = () => {
    setShowSelectJobPop(true)
  }

  const InputValidate = observer(() => {
    const { codeText, disableCode } = StorePersonal;
    return (
      <div className={classes.unit}>
        <div className={classes.unitTitle}>验证码：</div>
        <div className={classes.validate_wrap}>
          <input type="tel" placeholder="输入验证码" value={localStore.validate} className="input_validate" onChange={localStore.setValidate} maxLength={6}/>
          <div className={classes.get_validate} onClick={() => checkMobile()} disabled={disableCode}>{codeText}</div>
        </div>
      </div>
    )
  });

  const StyleRadioMale = (props) => {
    return (
      <Radio
        className={classes.styled_radio}
        checkedIcon={<img src={`${optImageUrl('http://woda-app-public-test.oss-cn-shanghai.aliyuncs.com/tmp/23d41231d79e80e0d7686e3bc73a9fdc.jpg', { w: 132, h: 0 })}`} className={classes.icon_female} />}
        icon={<img src={`${optImageUrl('http://woda-app-public-test.oss-cn-shanghai.aliyuncs.com/tmp/cf4f22e41962332737c866e8ecbfe5ce.jpg', { w: 132, h: 0 })}`} className={classes.icon_female} />}
        {...props}/>
    )
  };

  const StyleRadioFemale = (props) => {
    return (
      <Radio
        className={classes.styled_radio}
        checkedIcon={<img src={`${optImageUrl('http://woda-app-public-test.oss-cn-shanghai.aliyuncs.com/tmp/8fea55ebd5b98f879096ddf2338af3bb.jpg', { w: 132, h: 0 })}`} className={classes.icon_female} />}
        icon={<img src={`${optImageUrl('http://woda-app-public-test.oss-cn-shanghai.aliyuncs.com/tmp/071eac74e71db482ef9062fa06a253c4.jpg', { w: 132, h: 0 })}`} className={classes.icon_female} />}
        {...props}/>
    )
  };

  const Gender = observer(() => {
    return (
      <div className={classes.unit}>
        <div className={classes.unitTitle}>性别：</div>
        <FormControl>
          <RadioGroup
            value={localStore.gender}
            className={classes.radio_group}
            onChange={(e) => localStore.setGender(e.currentTarget.value)}>
            <FormControlLabel value='1' control={<StyleRadioMale />} label=""/>
            <FormControlLabel value='2' control={<StyleRadioFemale />} label=""/>
          </RadioGroup>
        </FormControl>
      </div>
    )
  });

  const BirthDate = () => {
    const handleDateChange = date => {
      setSelectedDate(format(date,'yyyy-MM-dd'));
    };

    return (
      <div className={classes.unit} style={isEmpty(selectedDate) ? {color: 'red'} : { height: '12vw'}}>
        <div className={classes.unitTitle}>出生日期：</div>
        <div className={classes.date_picker}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhCN} style={{width: '100%'}}>
            <DatePicker
              emptyLabel="请选择日期"
              label=""
              format="yyyy-MM-dd"
              value={selectedDate}
              onChange={handleDateChange}
              okLabel="确认"
              cancelLabel="取消"
              fullWidth={true}
            />
          </MuiPickersUtilsProvider>
        </div>
      </div>
    )
  };

  const SelectJobType = () => {
    const showList = [];
    toJS(personalChoiceList).map((v, i) => {
      if (i !== toJS(personalChoiceList).length - 1) {
        showList.push(`${v.professional_name}，`);
      } else if (i === toJS(personalChoiceList).length - 1) {
        showList.push(v.professional_name);
      }
    });
    return (
      <div style={{ width: '100%'}}>
        {
          isEmpty(toJS(personalChoiceList)) &&
          <div className={classes.unit} style={{ marginLeft: '3vw'}} onClick={() => showPop()}>
            <div className={classes.unitTitle}>
              想做什么
            </div>
            <div style="color:#D46F15;min-height:73%;" onClick={() => showPop()}>
              请选择...
            </div>
          </div>
        }
        {
          !isEmpty(toJS(personalChoiceList)) &&
          <div className={classes.unit} style={{ marginLeft: '3vw', minHeight: '6vw'}}  onClick={() => showPop()}>
            <div className={classes.unitTitle} onClick={() => showPop()}>想做什么</div>
            <div style="color:#000;width:70%;min-height:6vw"  onClick={() => showPop()}>{showList.join('')}</div>
          </div>
        }
      </div>
    )
  };

  const Confirm = () => {
    const { realName, Mobile, validate, gender } = localStore;
    if(isEmpty(realName)) {
      toastClick('请输入姓名','warning','info')
      return false;
    }
    if(isEmpty(gender)) {
      toastClick('请选择性别','warning','info')
      return false;
    }
    if(isEmpty(selectedDate)) {
      toastClick('请选择出生日期','warning','info')
      return false;
    }
    if(isEmpty(Mobile)) {
      toastClick('请输入电话','warning','info')
      return false;
    }
    if (!/^1[3456789]\d{9}$/i.test(Mobile)) {
      toastClick('请填写有效的手机号','warning','info')
      return false;
    }
    if(!isUpdate && isEmpty(validate)) {
      toastClick('请输入验证码','warning','info')
      return false;
    }
    const jobArr = toJS(personalChoiceList).map(
      (v) => v.professional_id
    );
    if (jobArr.length === 0){
      toastClick('请选择职位','warning','info')
      return false;
    }
    const saveInfo = {
      UserSign: '',
      Phone: Mobile,
      Code: validate,
      Name: realName,
      Sex: gender,
      Birth: selectedDate,
      Avatar: '',
      ProfessionalTypeList: jobArr,
      WayType: localStorage.getItem('isFrom') === 'detail' ? 3 : 0,
    };
    getSave(saveInfo);
  };

  const SubmitBtn = () => {
    return (
      <div className={classes.submit_btn} onClick={Confirm}>
        保存
      </div>
    )
  }

  const FormContainer = observer(() => {
    return (
      <div className={classes.form_container}>
        {/*<ImageUpLoader/>*/}
        <InputName/>
        <Gender/>
        <BirthDate/>
        <InputMobile/>
        {
          !isUpdate &&
          <InputValidate/>
        }
        <SelectJobType/>
        <Toast/>
      </div>
    )
  });

	return (
		<div className={classes.personal_page} ref={elRef}>
      {
        !showSelectJobPop &&
        <BackNav />
      }
      {
        !showSelectJobPop &&
        <div>
          <FormContainer />
          <SubmitBtn/>
        </div>
        
      }
      {
        showSelectJobPop &&
        <PersonalJob />
      }
      
      {/*{showSelectJobPop && <SelectJob postList={postList} leftList={leftList} setShowSelectJobPop={setShowSelectJobPop}/>}*/}
		</div>
	);
});

export default Personal;
