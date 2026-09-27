import { MapPin, Phone, Clock } from "lucide-react";

export default function ClinicInfoCard() {
  return (
    <div className="rounded-2xl border border-[#E4E6E0] bg-[#EFF2EC] p-6">
      <h3 className="mb-4 text-lg font-semibold text-[#1F4B3F]">Clinic Information</h3>

      <SidebarItem icon={<MapPin className="h-4 w-4" />} label="Location">
        FGC Building, Tagaytay-Nasugbu Road, Aguinaldo Highway, cor. Airborne St., Maharlika East,
        Tagaytay City.
      </SidebarItem>

      <SidebarItem icon={<Phone className="h-4 w-4" />} label="Phone">
        0966 990 8551
      </SidebarItem>

      <SidebarItem icon={<Clock className="h-4 w-4" />} label="Hours" last>
        Tue - Sat: 9:00 AM - 5:00 PM
        <br />
        Sun & Mon: Closed
      </SidebarItem>
    </div>
  );
}

function SidebarItem({ icon, label, children, last }) {
  return (
    <div className={last ? "flex gap-3" : "mb-5 flex gap-3"}>
      <span className="mt-0.5 text-[#1F4B3F]">{icon}</span>
      <div>
        <p className="mb-1 font-medium text-[#1F4B3F]">{label}</p>
        <p className="text-sm leading-relaxed text-[#5B5F55]">{children}</p>
      </div>
    </div>
  );
}
