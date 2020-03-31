import { makeStyles } from "@material-ui/core/styles";
import { PH, VW } from "@/lib/base/common";

export default makeStyles(theme => ({
  index_list: {
    width: "100%",
    height: `${(PH - 51 * VW) / VW}vw`,
    maxWidth: "100%",
    backgroundColor: "#f9f9f9",
  },
  footer: {
    height: "40px",
    fontSize: "16px"
  },
  loading: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingImg: {
    width: '5vw',
    height: '5vw',
    zIndex: '10',
    marginRight: '2vw'
  }
}));
