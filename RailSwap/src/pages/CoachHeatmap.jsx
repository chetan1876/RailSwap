import FeatureTemplate from "../components/FeatureTemplate";

const CoachHeatmap = () => {
  return (
    <FeatureTemplate
      title="Coach Heatmap"
      description="Visual crowd distribution inside coaches."
      stats={[
        { value: "18", label: "Coaches" },
        { value: "75%", label: "Occupancy" },
        { value: "3", label: "Crowded" },
      ]}
      data={[
        {
          Coach: "B1",
          Occupancy: "90%",
          Status: "High",
        },
      ]}
    />
  );
};

export default CoachHeatmap;