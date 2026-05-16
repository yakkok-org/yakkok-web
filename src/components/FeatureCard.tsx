type FeatureCardProps = {
  emoji: string;
  title: string;
  body: string;
};

export default function FeatureCard({ emoji, title, body }: FeatureCardProps) {
  return (
    <div className="rounded-card bg-white border border-gray-100 p-6 hover:border-brand hover:shadow-sm transition">
      <div className="text-3xl" aria-hidden>
        {emoji}
      </div>
      <h3 className="font-semibold text-lg mt-3">{title}</h3>
      <p className="text-gray-500 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
