import { Editor } from "./components/Editor";
import { PageList } from "./components/PageList";
import { usePath } from "./utils/history";

interface AppProps {
  api_url: string;
}

const App = ({ api_url }: AppProps) => {
  const path = usePath();
  if (!path.includes("/edit/")) {
    return <PageList api_url={api_url} />;
  }
  const page_name = path.split("/edit/")[1];

  return <Editor api_url={api_url} page_name={page_name} />;
};

export default App;
