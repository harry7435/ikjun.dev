import HoverTag from "./effects/HoverTag";

interface Props {
  items: string[];
}

export default function TechTagCloud({ items }: Props) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-2 font-mono text-xs sm:grid-cols-3">
      {items.map((tech) => (
        <HoverTag key={tech} className="flex items-center">
          <span className="mr-2 text-amber-600 dark:text-amber-400" aria-hidden>
            ▸
          </span>
          <span className="text-gray-700 dark:text-gray-300">{tech}</span>
        </HoverTag>
      ))}
    </ul>
  );
}
