import { DialogStack } from "./components/dialog";
import { Editor } from "./components/Editor";
import { MessageStack } from "./components/messages";
import { PageList } from "./components/PageList";
import { usePath } from "./hooks/history";
import settings from "./settings";

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
    <div className="h-full w-full">
      <Editor
        path={path}
        preview_url={`${settings.pv_url}/render/${path}.html`}
      />
      <DialogStack />
      <MessageStack />
    </div>
  );
};

export default App;
