export interface TagProps {
  tag: string;
  color?: string;
  className?: string;
}

const Tag = ({ tag, color, className }: TagProps) => {
  if (!color) {
    color = get_color_for_tag(tag);
  }

  return (
    <span
      className={`rounded-md px-2 py-0 text-[0.75rem] ${color} ${className}`}
    >
      {tag}
    </span>
  );
};

const COLORS = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-magenta-500",
];

let COLOR_CACHE: { [key: string]: string } = {};

const get_color_for_tag = (tag: string) => {
  if (COLOR_CACHE[tag]) {
    return COLOR_CACHE[tag];
  }
  const hashed_index = Math.abs(hash_string(tag)) % COLORS.length;
  const color = COLORS[hashed_index];
  COLOR_CACHE[tag] = color;
  console.log(tag, color, hashed_index);

  return color;
};

const hash_string = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

export default Tag;
