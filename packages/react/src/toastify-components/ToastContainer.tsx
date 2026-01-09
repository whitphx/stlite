import { Id, ToastContainer as DefaultToastContainer } from "react-toastify";
import { isDarkTheme } from "./theme";

interface ToastContainerProps {
  toastContainerId: Id;
}
function ToastContainer({ toastContainerId }: ToastContainerProps) {
  return (
    <DefaultToastContainer
      containerId={toastContainerId}
      style={{ zIndex: 999999, position: "absolute", overflow: "hidden" }}
      theme={isDarkTheme() ? "dark" : "light"}
    />
  );
}

export default ToastContainer;
