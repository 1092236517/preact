import { makeStyles } from "@material-ui/core/styles";
import { PH, VW } from "@/lib/base/common";

export default makeStyles(theme => ({
  index_list: {
    width: "100%",
    minHeight: `${(PH - 51 * VW) / VW}vw`,
    maxWidth: "100%",
    overflow: "auto",
    backgroundColor: "#f9f9f9",
  },
  footer: {
    height: "40px",
    fontSize: "16px"
  }
}));
