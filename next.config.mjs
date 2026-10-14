/** @type {import('next').NextConfig} */
const nextConfig = {
  // Old addresses from before the URLs were renamed, so saved bookmarks and
  // shared links still land on the right page. Temporary (307) redirects,
  // so browsers don't cache them forever if we rename again.
  async redirects() {
    return [
      { source: "/landing", destination: "/", permanent: false },
      { source: "/aboutus", destination: "/about-us", permanent: false },
      { source: "/dashboard/addpatient", destination: "/dashboard/add-patient", permanent: false },
      { source: "/dashboard/patientrecords", destination: "/dashboard/patient-records", permanent: false },
      { source: "/dashboard/settingpage", destination: "/dashboard/settings", permanent: false },
    ];
  },
  // The 3D tooth models are ~10 MB and never change, so browsers may keep
  // them for a year instead of downloading them on every visit. If a model
  // is ever replaced, give the new file a new name so browsers fetch it.
  async headers() {
    return [
      {
        source: "/models/bodyparts3d/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
