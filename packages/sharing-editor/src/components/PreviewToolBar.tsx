import { AppData } from "@stlite/sharing-common";
import styles from "./PreviewToolBar.module.scss";
import ShareModal from "./ShareModal/ShareModal";
import AppOpenButton from "./AppOpenButton";

interface PreviewToolBarProps {
  appData: AppData;
  sharingAppSrc: string;
}
function PreviewToolBar(props: PreviewToolBarProps) {
  return (
    <div className={styles.container}>
      <ShareModal appData={props.appData} sharingAppSrc={props.sharingAppSrc} />
      <AppOpenButton
        appData={props.appData}
        sharingAppSrc={props.sharingAppSrc}
      />
    </div>
  );
}

export default PreviewToolBar;
