import { data } from "../../src/data/culture-data.js";

const controlledVocabulary = {
  materials: ["cloth", "textile", "thread", "mirror", "castor oil", "natural dye", "mineral pigment", "wood block"],
  categories: ["textile painting", "needlework", "block printing", "festival", "workshop"]
};

export function suggestCreatorMetadata(text) {
  const lower = text.toLowerCase();
  const traditions = data.traditions.filter((tradition) => lower.includes(tradition.name.toLowerCase().split(" ")[0]));
  const regions = data.regions.filter((region) => lower.includes(region.name.toLowerCase()) || lower.includes(region.state.toLowerCase()));
  const materials = controlledVocabulary.materials.filter((material) => lower.includes(material));
  const categories = controlledVocabulary.categories.filter((category) => lower.includes(category));

  return {
    reviewRequired: true,
    warning: "These are draft suggestions only. A creator or admin must review them before publication.",
    suggestions: {
      traditionIds: traditions.map((tradition) => tradition.id),
      regionIds: regions.map((region) => region.id),
      materials,
      categories
    }
  };
}
