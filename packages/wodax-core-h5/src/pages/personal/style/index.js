import {makeStyles} from "@material-ui/core/styles";

const personalStyles = makeStyles({
  personal_page: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
    zIndex: 2,
    color: '#999',
    overflow: 'auto',
    overflowX: 'hidden'
  },
  postSearchView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    zIndex: '11',
    backgroundColor: '#000',
    opacity: '0.5'
  },
  postSearch: {
    border: '1px solid #ede9e9',
    width: '90%',
    margin: '0 auto'
  },
  icon_female: {
    height: '6vw',
    color: '#f00'
  },
  date_picker: {
    width: '73%'
  },
  backPage: {
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
  back_nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '12vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    background: 'linear-gradient(135deg,rgba(255,227,0,1) 0%,rgba(255,218,0,1) 100%)',
    color: '#000',
    '& .arrow_back': {
      width: '6vw',
      height: '6vw',
      position: 'absolute',
      left: '3vw',
      top: '3vw'
    },
    '& .index_name': {
      fontWeight: 550
    }
  },
  form_container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '90vw',
    borderBottom: '1px solid #eaeaea',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3.472222vw 0',
    '& .img_uploader': {
      width: '24vw',
      height: '24vw',
      borderRadius: '24vw',
      border: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative',
      marginBottom: '3.472222vw',
      '& input': {
        width: '100%',
        height: '100%',
        opacity: 0
      },
    },
    '& span': {
      fontSize: '3.888889vw',
      color: '#666'
    }
  },
  unitTitle: {
    width: '25%',
    fontSize: '3.8vw',
    color: '#666666',
    lineHeight: '10vw'
  },
  unit: {
    width: '95%',
    height: '10vw',
    display: 'flex',
    paddingLeft: '5%',
    borderBottom: '1px solid #eaeaea',
    marginBottom: '5vw',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: '5%',
    marginBottom: '5vw',
    '& input': {
      width: '75%',
      fontSize: '3.8vw',
      outline: 'none',
      border: 'none'
    }
  },
  radio_group: {
    flexDirection: 'row !important',
    width: '40vw',
    height: '100%',
    justifyContent: 'space-around'
  },
  styled_radio: {
    width: '10vw',
    height: '2vw',
    borderRadius: '4vw !important',
    '&.Mui-checked': {
      backgroundColor: '#f0f0f0 !important',
    },
    '& span': {
      fontSize: '3vw',
    },
    '& .checked_icon_male': {
      color: '#00f'
    }
  },
  date_picker: {
    display: 'flex',
    alignItems: 'center',
    width: '70%',
    '& .MuiInput-underline:before': {
      borderBottom: 'none'
    }
  },
  validate_wrap: {
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  get_validate: {
    width: '45vw',
    textAlign: 'center',
    lineHeight: '6vw',
    borderLeft: '1px solid #ddd',
    fontSize: '3.888888vw',
    borderRadius: 0,
    color: '#D46F15'
  },
  select_job_pop: {
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 9
  },
  bg: {
    position: 'absolute',
    top:0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10
  },
  wrap: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 11,
    width: '100%',
    height: '86vw',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column'
  },
  top: {
    position: 'absolute',
    left: 0,
    bottom: '86vw',
    zIndex: 11,
    height: '10vw',
    width: '100%',
    minHeight: '10vw',
    borderBottom: '1px solid #cbcbcb',
    padding: '1.333333vw 5vw',
    fontSize: '3.684210vw'
  },
  left: {
    width: '30vw',
    height: '100%',
    borderRight: '1px solid #cbcbcb',
    overflowY: 'scroll',
    '& .left_industry': {
      padding: '1.333333vw 5vw',
      fontSize: '3.684210vw',
    },
    '& .active': {
      color: '#4e91ff',
      borderLeft: '2px solid #4e91ff',
      paddingLeft: '4.444444vw'
    }
  },
  right: {
    width: '70vw',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    overflowY: 'scroll',
    flexGrow: 1,
    padding: '3vw',
    '& .label': {
      padding: '0 2vw',
      margin: '0 2vw 2vw 0',
      border: '1px solid #cbcbcb',
      borderRadius: '1vw',
      display: 'inline-block',
      fontSize: '3.611111vw'
    },
    '& .active': {
      color: '#4e91ff',
      border: '1px solid #4e91ff'
    }
  },
  buttons: {
    width: '100%',
    height: '11.111111vw',
    flexGrow: 0,
    display: 'flex',
  },
  submit_btn: {
    marginTop: '10vw',
    marginBottom: '10vw',
    width: '90vw',
    margin: '0 auto',
    color: '#333333',
    textAlign: 'center',
    background: 'linear-gradient(135deg,rgba(255,227,0,1) 0%,rgba(255,218,0,1) 100%)',
    height: '15vw',
    lineHeight: '15vw',
    borderRadius: '40vw',
    fontSize: '5vw'
  }
});

export default personalStyles
