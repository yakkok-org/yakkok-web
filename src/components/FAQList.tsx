import { FAQ_CATEGORIES, type FAQItem } from "./faqItems";

type Props = {
  items: FAQItem[];
  layout?: "grouped" | "flat";
};

function FAQItemRow({ item }: { item: FAQItem }) {
  return (
    <details className="group rounded-card border border-gray-200 bg-white p-5 open:border-brand transition">
      <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-gray-900">
        <span>{item.q}</span>
        <span
          aria-hidden
          className="ml-4 text-gray-400 group-open:rotate-45 transition-transform text-xl leading-none"
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
    </details>
  );
}

export default function FAQList({ items, layout = "flat" }: Props) {
  if (layout === "flat") {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <FAQItemRow key={item.q} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {FAQ_CATEGORIES.map((category) => {
        const groupItems = items.filter((i) => i.category === category.id);
        if (groupItems.length === 0) return null;
        return (
          <div key={category.id}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {category.label}
            </h3>
            <div className="space-y-3">
              {groupItems.map((item) => (
                <FAQItemRow key={item.q} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
