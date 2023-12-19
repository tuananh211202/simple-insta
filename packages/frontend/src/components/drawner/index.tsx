import MessagesDrawner from "./messages-drawner";
import NotificationsDrawner from "./notifications-drawner";
import SearchDrawner from "./search-drawner";

export type DrawnerProps = {
  isOpen: boolean;
  onClose: () => void;
}

type DrawnerTypes = {
  drawnerType: string;
}

const PageDrawner = (props: DrawnerProps & DrawnerTypes) => {
  const { drawnerType, isOpen, onClose } = props;

  return (<>
    {
      drawnerType === 'search' ? <SearchDrawner isOpen={isOpen} onClose={onClose} /> :
      drawnerType === 'messages' ? <MessagesDrawner isOpen={isOpen} onClose={onClose} /> :
      drawnerType === 'notifications' ? <NotificationsDrawner isOpen={isOpen} onClose={onClose} /> :
      null
    }
  </>);
}

export default PageDrawner;