import { h } from 'preact';
import { useState } from 'preact/hooks';

import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import HomeIcon from '@material-ui/icons/Home';
import AccountIcon from '@material-ui/icons/AccountCircle';
import OrderIcon from '@material-ui/icons/PlaylistAddCheckOutlined';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    left: 0,
    bottom: 0,
  },
});

export default (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="首页" icon={<HomeIcon />} />
      <BottomNavigationAction label="订单" icon={<OrderIcon />} />
      <BottomNavigationAction label="我的" icon={<AccountIcon />} />
    </BottomNavigation>
  );
}