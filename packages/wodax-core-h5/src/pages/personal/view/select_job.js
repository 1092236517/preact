import React, { useMemo } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';
import { observer, useLocalStore } from 'mobx-react-lite';

import personalStyles from '../style'

import Button from '@material-ui/core/Button';

import PersonalStore from '../store'

const SelectJob = observer(({ postList, leftList, setShowSelectJobPop }) => {
  const classes = personalStyles();

  const localStore = useLocalStore(() => (
    {
      leftActiveId: 0,
      setLeftActive:(id) => {
        localStore.leftActiveId = id;
      },
      rightList: [],
      setRightList:(list) => {
        localStore.rightList = list
      },
      rightActiveList: new Set(),
      addRightActive:(professional_id) => {
        localStore.rightActiveList.add(professional_id)
      },
      removeRightActive:(professional_id) => {
        localStore.rightActiveList.delete(professional_id)
      }
    }
  ));

  const { setProfessionalTypeList } = PersonalStore;

  function changeIndustry(industry_id) {
    const tempList = postList.filter((item,o_index) => {
      return item.industry_id === industry_id
    });
    const { professionals } = tempList[0];
    localStore.setRightList(professionals);
  }

  const Top = observer(() => {
    if (PersonalStore.ProfessionalTypeList.size > 0) {
      return (
        <div className={classes.top}>
          {
            PersonalStore.ProfessionalTypeList.map((item, index) => {
              <div id={index}>{item}</div>
            })
          }
        </div>
      )
    }
  })

  const Left  = observer(() => {
    return (
      <div className={classes.left}>
        {leftList.map((item,index) => {
          const { industry_id, industry_name } = item;
          return (
            <div className={`${industry_id === localStore.leftActiveId ? 'active': ''} left_industry`} onClick={() => {
              changeIndustry(industry_id);
              localStore.setLeftActive(industry_id);
            }}>{industry_name}</div>
          )
        })}
      </div>
    )
  });

  const Content = observer(() => {
    return (
      <div className={classes.content}>
        {localStore.rightList.map((item,index) => {
          const { professional_name, professional_id } = item;
          return (
            <div className={`${localStore.rightActiveList.has(professional_id) ? 'active' : ''} label`} onClick={() => {
              if(localStore.rightActiveList.size <= 4) {
                if(localStore.rightActiveList.has(professional_id)) {
                  localStore.removeRightActive(professional_id)
                }else{
                  localStore.addRightActive(professional_id);
                }
              }else{
                if(localStore.rightActiveList.has(professional_id)) {
                  localStore.removeRightActive(professional_id)
                }else{
                  // console.log('已经达到5个Le');
                }
              }
            }}>{professional_name}</div>
          )
        })}
      </div>
    )
  });

  const Buttons = observer(() => {
    return (
      <div className={classes.buttons}>
        <Button style={{width: '50%'}} onClick={() => {}}>重置</Button>
        <Button color="primary" style={{width: '50%'}} onClick={() => {
          setShowSelectJobPop(false);
          setProfessionalTypeList(localStore.rightActiveList);
        }}>确定</Button>
      </div>
    )
  });

  const Right = observer(() => {
    return (
      <div className={classes.right}>
        <Content/>
        <Buttons/>
      </div>
    )
  });

  return (
    <div className={classes.select_job_pop}>
      <div className={classes.bg}/>
      <Top/>
      <div className={classes.wrap}>
          <Left/>
          <Right/>
      </div>
    </div>
  )
});

export default  SelectJob;
