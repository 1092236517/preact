import React from "preact/compat";
import { useCallback, useEffect, useState, useRef  } from 'preact/hooks';
import { observable, computed, action} from 'mobx';
import { Observer, useObserver, observer, useObservable} from 'mobx-react-lite';
import Snackbar from '@material-ui/core/Snackbar';
import ListStore from '@/components/list/store';

import style from './style.less';

/*
<Amap
  address={[{name:"全聚德烤鸭",position:[120.97210,31.34752]}]}
  height="200px"
/>
*/

const Home = observer((props, context) => {

      const { scrollTop, recordIndex, listTotal, ToList, longitude, latitude, virtualLng, virtualLat, searchName, SortId, SalaryRoundId, postList, IndustryId, choiceId, AreaId, isPneumonia, isEnd } = ListStore
        useEffect(() => {
                if(window.AMap) {
      let map = new window.AMap.Map('container', {
        zoom: 15,
        showLabel: false,
        expandZoomRange: true,
        resizeEnable: true,
        dragEnable: false,
        zoomEnable: false
        // center: [120.97210,31.34752],
      });

      let layer = new window.AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: true,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true,
      });
      map.add(layer);
      let markers = [];
      for (let i = 0; i < props.address.length; i++) {
        let curData = {
          ...props.address[i],
          label: {
            content: "点击Marker打开高德地图"
          },
          icon:{
            type:"image",
            image:"http://recruit-public.oss-cn-shanghai.aliyuncs.com/tmp/8413208d3044b757cec23a01f4ed45f5.jpg",
            clipSize:[50,68],
            size:[37,51],
            anchor:"bottom-center",
          },
          text: {
            content: props.address[i].name,
          },
        };
        let labelMarker = new window.AMap.LabelMarker(curData);
        markers.push(labelMarker);
        layer.add(labelMarker);
      }
      map.setFitView();
      // window.AMap.plugin('AMap.Geolocation', function() {
      //   let geolocation = new window.AMap.Geolocation({
      //     enableHighAccuracy: true,//是否使用高精度定位，默认:true
      //     timeout: 10000,          //超过10秒后停止定位，默认：5s
      //     showButton: false,
      //     // buttonPosition:'RB',    //定位按钮的停靠位置
      //     buttonOffset: new window.AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      //     zoomToAccuracy: false,   //定位成功后是否自动调整地图视野到定位点
      //     dragEnable: false
      //   });
      //   map.addControl(geolocation);
      //   geolocation.getCurrentPosition(function(status,result){
      //     if(status === 'complete'){
      //       onComplete(result)
      //     }else{
      //       onError(result)
      //     }
      //   });
      // });
                }

    //解析定位结果
    function onComplete(data) {
      let str = [];
      str.push('定位结果：' + data.position);
      str.push('定位类别：' + data.location_type);
      if(data.accuracy){
        str.push('精度：' + data.accuracy + ' 米');
      }
      str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
    }

    //解析定位错误信息
    function onError(data) {
                  // return <Snackbar open={true} autoHideDuration={6000}>{data.message}</Snackbar>
    }
        });
        const toMap = useCallback(()=>{
          const listStatus = {
            scrollTop: scrollTop,
            recordIndex: recordIndex,
            ToList: ToList,
            listTotal: listTotal,
            longitude: longitude,
            latitude: latitude,
            virtualLng: virtualLng,
            virtualLat: virtualLat,
            searchName: searchName,
            SortId: SortId,
            SalaryRoundId: SalaryRoundId,
            postList: postList,
            IndustryId: IndustryId,
            choiceId: choiceId,
            AreaId: AreaId,
            isPneumonia: isPneumonia,
            isEnd: isEnd
          }
          localStorage.setItem('listStatus', JSON.stringify(listStatus))
          window.location.href = `https://uri.amap.com/marker?position=${props.address[0].position[0]},${props.address[0].position[1]}&callnative=0`
        })

        return (
                <div class={style.home}>
                        <div id="container" style={{height: props.height}}
           onClick={() => toMap()}
      ></div>
                </div>
        )
});

export default Home;
