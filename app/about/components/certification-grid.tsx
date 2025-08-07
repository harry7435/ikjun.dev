interface CertificationItem {
  title: string;
  description: string;
  date: string;
  detail: string;
  color: "amber" | "sky";
}

interface CertificationGridProps {
  certifications: CertificationItem[];
}

export function CertificationGrid({ certifications }: CertificationGridProps) {
  const getColorClasses = (color: "amber" | "sky") => {
    switch (color) {
      case "amber":
        return {
          bg: "bg-amber-50/70 dark:bg-yellow-900/20",
          text: "text-amber-800 dark:text-yellow-300",
        };
      case "sky":
        return {
          bg: "bg-sky-50/70 dark:bg-blue-900/20",
          text: "text-sky-800 dark:text-blue-300",
        };
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {certifications.map((cert, index) => {
        const colorClasses = getColorClasses(cert.color);
        return (
          <div
            key={index}
            className={`rounded-lg p-4 shadow-sm ${colorClasses.bg}`}
          >
            <h4 className={`mb-2 font-semibold ${colorClasses.text}`}>
              {cert.title}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {cert.description} ({cert.date})
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {cert.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
