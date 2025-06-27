import { Page } from "../types";

interface MainContentProps {
  page: Page;
}

const MainContent = ({ page }: MainContentProps) => {
  const url = "http://localhost:8000/api/v1/view/architecture";

  return <iframe src={url} className="w-full h-full" />;
};

export default MainContent;
