import {
  certifications,
  education,
  type Certification,
} from "../data/about-data";

export default function CredentialsBlock() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {certifications.map((cert) => (
        <CertificationCard key={cert.title} cert={cert} />
      ))}
      <div className="rounded-md border border-gray-200 bg-white/60 p-4 dark:border-gray-700 dark:bg-gray-900/40 sm:col-span-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {education.school}
        </h4>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {education.major} · {education.period}
        </p>
      </div>
    </div>
  );
}

function CertificationCard({ cert }: { cert: Certification }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white/60 p-4 transition-colors hover:border-amber-400/70 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-amber-400/60">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {cert.title}
        </h4>
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {cert.date}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
        {cert.description}
      </p>
      <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
        {cert.detail}
      </p>
    </div>
  );
}
