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
};

export default nextConfig;
