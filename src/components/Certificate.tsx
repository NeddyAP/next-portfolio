import certificateData from "@/data/certificateData";

export default function Certificate() {
  return (
    <div>
      <h1>Certificate</h1>
      {certificateData.map((certificate) => (
        <div key={certificate.title}>
          <h2>{certificate.title}</h2>
          <p>{certificate.description}</p>
          <p>{certificate.date}</p>
        </div>
      ))}
    </div>
  );
}
