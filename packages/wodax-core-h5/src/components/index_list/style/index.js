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
  }
}));
