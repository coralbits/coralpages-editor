import { Editor } from "./components/Editor";
import { PageList } from "./components/PageList";
import { usePath } from "./utils/history";

interface AppProps {}

const App = ({}: AppProps) => {
  const path = usePath();
  const page_name = path.split("/edit/")[1];

  if (page_name === "") {
    return <PageList />;
  }

  return <Editor page_name={page_name} />;
};

export default App;
