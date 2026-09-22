import { Quote } from "lucide-react";

export default function TestimonialCard() {
  return (
    <div className="rounded-2xl border border-[#E4E6E0] bg-white p-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex text-[#E0A526]">
          {"★★★★★".split("").map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
        <Quote className="h-5 w-5 text-[#D8DAD2]" />
      </div>
      <p className="mb-3 text-sm italic leading-relaxed text-[#33362F]">
        &quot;The easiest booking process I&apos;ve ever used for a dentist. Dr. Smith and the
        team are incredibly gentle and professional.&quot;
      </p>
      <p className="text-sm text-[#5B5F55]">— Sarah J.</p>
    </div>
  );
}