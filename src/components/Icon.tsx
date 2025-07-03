import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon } from "../hooks/faicon_setup";

const Icon = ({ name, className }: { name: string; className?: string }) => {
  return <FontAwesomeIcon icon={getIcon(name)} className={className} />;
};

export default Icon;
