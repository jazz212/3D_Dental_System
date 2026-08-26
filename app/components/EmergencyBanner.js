import { AlertTriangle } from "lucide-react";

export default function EmergencyBanner() {
  return (
    <div className="rounded-2xl border border-[#F3D8D1] bg-[#FCEEEA] p-6">
      <div className="mb-2 flex items-center gap-2 text-[#B4432E]">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-semibold">Dental Emergency?</span>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-[#7A4B41]">
        If you are experiencing severe pain, bleeding, or trauma, please call us immediately. Do
        not use this form.
      </p>
      <a
        href="tel:+15551234567"
        className="block rounded-lg border border-[#F3D8D1] bg-white py-2.5 text-center text-sm font-medium text-[#B4432E] hover:bg-[#FCEEEA]"
      >
        Call Emergency Line
      </a>
    </div>
  );
}
