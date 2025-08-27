import { DialogStack } from "./components/dialog";
import { Editor } from "./components/Editor";
import { MessageStack } from "./components/messages";
import { PageList } from "./components/PageList";
import { usePath } from "./hooks/history";

interface AppProps {}

const App = ({}: AppProps) => {
  const path = usePath();

  if (!path) {
    return (
      <>
        <PageList />
        <DialogStack />
        <MessageStack />
      </>
    );
  }

  return (
    <>
      <Editor path={path} />
      <DialogStack />
      <MessageStack />
    </>
  );
};

export default App;
