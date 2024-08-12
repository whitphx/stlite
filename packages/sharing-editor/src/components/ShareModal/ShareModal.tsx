import { useState } from "react";
import { AppData } from "@stlite/sharing-common";
import styles from "./ShareModal.module.scss";
import Modal from "../Modal";
import ShareModalContent from "./ShareModalContent";
import ShareIcon from "./ShareIcon";

interface PreviewToolBarProps {
  appData: AppData;
  sharingAppSrc: string;
}
function PreviewToolBar(props: PreviewToolBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className={styles.shareButton}
        onClick={() => setIsModalOpen(true)}
      >
        <ShareIcon />
        Share App
      </button>
      <Modal
        title="Share App"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ShareModalContent
          appData={props.appData}
          sharingAppSrc={props.sharingAppSrc}
        />
      </Modal>
    </>
  );
}

export default PreviewToolBar;
