/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

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
        preview_url={`${settings.coralpages_url}/render/${path}.html`}
      />
      <DialogStack />
      <MessageStack />
    </div>
  );
};

export default App;
