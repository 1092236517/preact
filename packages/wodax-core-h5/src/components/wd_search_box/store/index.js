import { action, observable, runInAction } from 'mobx';
import { getArea } from "@/services/detail";

const $store = observable({
  areaList:[],
  
  // 获取区域列表
  getAreaList: async () => {
    const query = {
      // UserSign: localStorage.getItem('userSign'),
    };
    try {
      const response = await getArea(query);
      if (response.Code === 0) {
        runInAction(() => {
          $store.areaList = response.Data.RecordList;
          if ($store.areaList.length > 0) {
            const firstArea = {
              id: 0,
              level: 0,
              name: '全部',
              sub: [],
            };
            $store.areaList.unshift(firstArea);
            $store.areaList.map((v) => {
              if (v.sub.length > 0) {
                v.sub.unshift({
                  id: v.id,
                  level: 1,
                  name: '全部',
                  sub: [],
                });
              }
              v.sub.map((val) => {
                if (val.sub.length > 0) {
                  val.sub.unshift({
                    id: val.id,
                    level: 2,
                    name: '全部',
                    sub: [],
                  });
                }
                return true;
              });
              return true;
            });
          }
        })
      }
    } catch (err) {
      console.log(err.Desc);
    }
  },
  

}, {
  getAreaList: action,
});

export default $store;
