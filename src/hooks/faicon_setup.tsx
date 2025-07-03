import {
  faBars,
  faPlus,
  faImage,
  faHeader,
  faSection,
  faParagraph,
  faChildren,
  faQuestion,
  faTag,
  faFont,
  faSquare,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

// from brands

import { faMarkdown, faHtml5 } from "@fortawesome/free-brands-svg-icons";

import { faCss3 } from "@fortawesome/free-brands-svg-icons";

// Icon mapping - you can configure this later
const iconMap: Record<string, any> = {
  plus: faPlus,
  bars: faBars,
  question: faQuestion,
  image: faImage,
  header: faHeader,
  section: faSection,
  paragraph: faParagraph,
  children: faChildren,
  css: faCss3,
  text: faFont,
  tag: faTag,
  menu: faBars,
  markdown: faMarkdown,
  button: faSquare,
  div: faHtml5,
  html: faHtml5,
  server: faServer,
};

// Helper function to get icon with fallback
const getIcon = (iconName: string, fallbackName: string = "question") => {
  return iconMap[iconName] || iconMap[fallbackName] || faQuestion;
};

export { getIcon };
