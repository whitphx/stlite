import { useNavigation, Outlet } from "react-router-dom";
import NProgress from "nprogress";

import "nprogress/nprogress.css";

function Root() {
  const navigation = useNavigation();
  if (navigation.state === "idle") {
    NProgress.done();
  } else {
    NProgress.start();
  }

  return <Outlet />;
}

export default Root;
