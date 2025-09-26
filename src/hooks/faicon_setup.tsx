/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

// Only free fontawesome icons are allowed
import {
  faAlignCenter,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowsUpDown,
  faArrowUp,
  faBars,
  faChildren,
  faDownload,
  faEye,
  faFont,
  faHeader,
  faImage,
  faParagraph,
  faPlus,
  faQuestion,
  faSave,
  faSearch,
  faSection,
  faExpand,
  faServer,
  faSquare,
  faTag,
  faTrash,
  faUpload,
  faUser,
  faThumbTack,
  faThumbTackSlash,
  faColumns,
  faTableList,
  faBorderNone,
  faSquareCheck,
  faNetworkWired,
  faGem,
  faChartPie,
  faObjectUngroup,
  faArrowUpRightFromSquare,
  faCopy,
  faPaste,
  faUndo,
  faRedo,
  faEllipsisH,
  faDesktop,
  faTablet,
  faMobile,
} from "@fortawesome/free-solid-svg-icons";

// from brands

import { faMarkdown, faHtml5 } from "@fortawesome/free-brands-svg-icons";

import { faCss3 } from "@fortawesome/free-brands-svg-icons";

// Icon mapping - you can configure this later
const iconMap: Record<string, any> = {
  bars: faBars,
  bottom: faArrowDown,
  button: faSquare,
  center: faAlignCenter,
  children: faChildren,
  css: faCss3,
  div: faHtml5,
  down: faArrowDown,
  download: faDownload,
  eye: faEye,
  header: faHeader,
  html: faHtml5,
  image: faImage,
  left: faArrowLeft,
  markdown: faMarkdown,
  menu: faBars,
  middle: faArrowsUpDown,
  paragraph: faParagraph,
  plus: faPlus,
  question: faQuestion,
  right: faArrowRight,
  save: faSave,
  search: faSearch,
  section: faSection,
  server: faServer,
  tag: faTag,
  text: faFont,
  top: faArrowUp,
  trash: faTrash,
  up: faArrowUp,
  upload: faUpload,
  user: faUser,
  full_screen: faExpand,
  pin: faThumbTack,
  pin_open: faThumbTackSlash,
  columns: faColumns,
  tableList: faTableList,
  borderNone: faBorderNone,
  squareCheck: faSquareCheck,
  networkWired: faNetworkWired,
  gem: faGem,
  chartPie: faChartPie,
  highlight: faObjectUngroup,
  link: faArrowUpRightFromSquare,
  copy: faCopy,
  paste: faPaste,
  pasteAfter: faArrowDown,
  undo: faUndo,
  redo: faRedo,
  ellipsisH: faEllipsisH,
  mobile: faMobile,
  tablet: faTablet,
  desktop: faDesktop,
};

// Helper function to get icon with fallback
const getIcon = (iconName: string, fallbackName: string = "question") => {
  return iconMap[iconName] || iconMap[fallbackName] || faQuestion;
};

export { getIcon };
