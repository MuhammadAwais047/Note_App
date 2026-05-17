export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export const defaultNotes: Note[] = [
  {
    id: "1",
    title: "UI concepts worth existing",
    content: "A collection of innovative UI concepts that deserve to be turned into real products. From creative navigation patterns to unique interaction designs.",
    color: "#FDB2FF",
    category: "Design",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "2",
    title: "Book Review : The Design of Everyday Things by Don Norman",
    content: "The Design of Everyday Things is required reading for anyone who is interested in the user experience. I personally like to reread it every year or two. Norman is aware of the durability of his work and the applicability of his principles to multiple disciplines. If you know the basics of design better than anyone else, you can apply them flawlessly anywhere.",
    color: "#FF9E9E",
    category: "Books",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Animes produced by Ufotable",
    content: "Ufotable has produced some of the most visually stunning anime series. From Demon Slayer to Fate/Zero, their animation quality sets a benchmark in the industry.",
    color: "#91F48F",
    category: "Entertainment",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "4",
    title: "Mangas planned to read",
    content: "My reading list keeps growing! Berserk, Vagabond, Vinland Saga, JoJo's Bizarre Adventure, and many more classics I need to catch up on.",
    color: "#FFF599",
    category: "Books",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "5",
    title: "Awesome tweets collection",
    content: "A curated collection of the most insightful and entertaining tweets about design, development, and tech culture.",
    color: "#9EFFFF",
    category: "Social",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "6",
    title: "List of free & open source apps",
    content: "A growing list of amazing free and open source alternatives to popular paid software. From design tools to productivity apps.",
    color: "#B69CFF",
    category: "Tech",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const noteColors = [
  "#FDB2FF",
  "#FF9E9E",
  "#91F48F",
  "#FFF599",
  "#9EFFFF",
  "#B69CFF",
];

export const categoryOptions = [
  "Design",
  "Books",
  "Entertainment",
  "Social",
  "Tech",
  "General",
  "Work",
  "Personal",
];
