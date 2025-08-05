import { DialogStack } from "./components/dialog";
import { Editor } from "./components/Editor";
import { MessageStack } from "./components/messages";
import { PageList } from "./components/PageList";
import { usePath } from "./utils/history";

interface AppProps {}

const App = ({}: AppProps) => {
  const path = usePath();

  let page_name = path;
  if (path.includes("/edit/")) {
    page_name = path.split("/edit/")[1];
  }

  if (page_name.startsWith("/")) {
    page_name = page_name.slice(1);
  }

  if (page_name === "" || page_name === undefined) {
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
      <Editor page_name={page_name} />
      <DialogStack />
      <MessageStack />
    </>
  );
};

export default App;
