/* ES Venture Lab catalogue.
   Replace placeholder entries when real lessons are ready.
   Keep these fields so a later CMS can map onto the same shape:
   categories[], courses[], videos[], resources[], featured.{courses,videos,resources}
   A course material is { kind: "video" | "resource", id }.
   Leave youtubeId or file empty to show the unavailable state. */
window.LAB_CONTENT = {
  categories: [
    { id: "design", name: "Design" },
    { id: "development", name: "Development" },
    { id: "venture", name: "Venture practice" },
    { id: "awaiting", name: "Awaiting materials" }
  ],
  courses: [
    {
      id: "placeholder-design-course",
      title: "Placeholder course: Design practice",
      category: "design",
      placeholder: true,
      added: "2026-10-02",
      summary: "Replace this summary with a Venture Lab course description.",
      description: "This entry exists so the course catalogue, search, and detail view can be reviewed. It is not an ES International course, and it does not describe a real class.",
      materials: [
        { kind: "video", id: "placeholder-intro-video" },
        { kind: "resource", id: "placeholder-notes" }
      ]
    },
    {
      id: "placeholder-development-course",
      title: "Placeholder course: Development practice",
      category: "development",
      placeholder: true,
      added: "2026-10-18",
      summary: "Replace this summary with a Venture Lab course description.",
      description: "This entry exists so a second subject can be filtered. It is not an ES International course. The linked video has no file yet, which shows the unavailable state.",
      materials: [
        { kind: "video", id: "placeholder-pending-video" }
      ]
    }
  ],
  videos: [
    {
      id: "placeholder-intro-video",
      title: "Placeholder video: replace with a Venture Lab lesson",
      category: "design",
      placeholder: true,
      added: "2026-10-20",
      summary: "A stand-in embed so the player and thumbnail can be checked.",
      description: "Swap youtubeId in content.js when a real lesson is ready. The film currently embedded is YouTube’s own embedded-player demonstration, not an ES Venture Lab lesson.",
      youtubeId: "M7lc1UVf-VE"
    },
    {
      id: "placeholder-pending-video",
      title: "Placeholder video: not yet added",
      category: "development",
      placeholder: true,
      added: "2026-11-01",
      summary: "This entry shows what visitors see when a video has no link.",
      description: "Leave youtubeId empty until ES International supplies a YouTube link.",
      youtubeId: ""
    }
  ],
  resources: [
    {
      id: "placeholder-notes",
      title: "Placeholder notes",
      category: "design",
      placeholder: true,
      added: "2026-09-12",
      summary: "A sample document so the download action can be checked.",
      description: "Replace the file path when ES International supplies a real PDF or document. This file only says that it is a placeholder.",
      file: "files/placeholder-notes.pdf",
      fileLabel: "Download placeholder PDF"
    },
    {
      id: "placeholder-missing-file",
      title: "Placeholder resource: no file yet",
      category: "venture",
      placeholder: true,
      added: "2026-11-08",
      summary: "This entry shows the state when a document has not been added.",
      description: "Add a file path in content.js when the document is ready.",
      file: "",
      fileLabel: ""
    }
  ],
  featured: {
    courses: ["placeholder-design-course"],
    videos: ["placeholder-intro-video"],
    resources: ["placeholder-notes"]
  }
};
