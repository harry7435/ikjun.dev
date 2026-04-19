interface Props {
  label: string;
}

export default function SectionHeading({ label }: Props) {
  return (
    <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-gray-200 lg:sr-only">
      {label}
    </h2>
  );
}
