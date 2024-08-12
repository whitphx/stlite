import { useState } from "react";
import { AppData } from "@stlite/sharing-common";
import Modal from "../Modal";
import ShareModalContent from "./ShareModalContent";
import ToolbarButton from "../ToolbarButton";
import ShareIcon from "./ShareIcon";

interface PreviewToolBarProps {
  appData: AppData;
  sharingAppSrc: string;
}
function PreviewToolBar(props: PreviewToolBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ToolbarButton onClick={() => setIsModalOpen(true)} icon={<ShareIcon />}>
        Share App
      </ToolbarButton>
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
