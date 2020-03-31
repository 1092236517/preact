import { useState } from "react";
import { route } from "preact-router";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

import WorkIcon from "@material-ui/icons/Work";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LoginStore from '@/components/login/store';

const tabbarStyles = makeStyles({
  tabBar: {
    position: "fixed",
    height: "15vw",
    width: '100%',
    left: 0,
    bottom: 0,
    borderTop: '1px solid #f0f0f0',
    '& .tabBarItem': {
      width: '33.33%',
      height: '100%'
    }
  }
});

export const TabIndex2RouterPatterns = [
  '/',
  '/profile:id',
  '/profile'
];

export const getTabIndexByRoutePattern = (routePattern) => {
  return TabIndex2RouterPatterns.indexOf(routePattern);
};


function changeRouter(val) {
  if (LoginStore.showLogin) return
  const url = (val >=0 && val < TabIndex2RouterPatterns.length) ? TabIndex2RouterPatterns[val] : `/`;
  if (url === '/') {
    route(`${url}${localStorage.getItem('locationSearch')}`);
  } else {
    route(url)
  }
}

const TabBar = observer((props, context) => {
  const classes = tabbarStyles();

  const { store: AppStore } = context;
  const { activeTab } = AppStore;

  return (
    <BottomNavigation
      value={activeTab}
      onChange={(event, newValue) => {
        changeRouter(newValue);
      }}
      showLabels
      className={classes.tabBar}
    >
      <BottomNavigationAction
        label="找工作"
        value={0}
        className="tabBarItem"
        icon={<WorkIcon />}
      />
      {/* <BottomNavigationAction
        label="账户"
        value={1}
        className="tabBarItem"
        icon={<AccountBalanceIcon />}
      /> */}
      <BottomNavigationAction
        label="我的"
        value={2}
        className="tabBarItem"
        icon={<AccountCircleIcon />}
      />
    </BottomNavigation>
  );
});

export default TabBar;
