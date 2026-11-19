/* ES Venture Lab catalogue.
   Pages CMS can later map onto this same shape.
   categories[]: { id, name }
   types[]: { id, name } — course, ebook, pdf, video, report, toolkit, research
   items[]: {
     id, title, summary, description,
     categories[] (subject ids), type, publisher, access, action, url,
     youtubeId (videos only), licence (open texts only), added (YYYY-MM-DD)
   }
   access is "Free", "Free with registration", or "External resource".
   action is "Read", "Download", "Explore", or "Watch".
   featured[]: item ids, in display order.
   Do not re-host publisher files. url is the original page. */
window.LAB_CONTENT = {
  categories: [
    { id: "leadership", name: "Leadership" },
    { id: "technology", name: "Technology" },
    { id: "entrepreneurship", name: "Entrepreneurship" },
    { id: "politics", name: "Politics and Citizenship" },
    { id: "design", name: "Design and Creativity" },
    { id: "industry", name: "Industry and Future of Work" },
    { id: "trends", name: "Global Trends" }
  ],
  types: [
    { id: "course", name: "Course" },
    { id: "ebook", name: "Ebook" },
    { id: "pdf", name: "PDF" },
    { id: "video", name: "Video" },
    { id: "report", name: "Report" },
    { id: "toolkit", name: "Toolkit" },
    { id: "research", name: "Research" }
  ],
  items: [
    {
      id: "ou-leadership-followership",
      title: "Leadership and Followership",
      summary: "A free introductory course on how leadership and followership work, and how to develop your own practice.",
      description: "The Open University’s OpenLearn course looks at leadership styles, the skills leaders use, and why followership matters. You can start it without an account. A free OpenLearn registration is only needed if you want to save progress or earn the statement of participation.",
      categories: ["leadership"],
      type: "course",
      publisher: "The Open University",
      access: "Free",
      action: "Explore",
      url: "https://www.open.edu/openlearn/education-development/learning/leadership-and-followership",
      added: "2026-11-11"
    },
    {
      id: "ted-leaders-inspire-action",
      title: "How Great Leaders Inspire Action",
      summary: "Simon Sinek’s TED talk on why people follow leaders who begin with a clear purpose.",
      description: "In this TED talk, Simon Sinek sets out his view that inspiring leaders start with why. The film is published by TED on YouTube.",
      categories: ["leadership"],
      type: "video",
      publisher: "TED",
      access: "Free",
      action: "Watch",
      url: "https://www.youtube.com/watch?v=qp0HIF3SfI4",
      youtubeId: "qp0HIF3SfI4",
      added: "2026-11-06"
    },
    {
      id: "mdn-learn-web-development",
      title: "Learn Web Development",
      summary: "Mozilla’s free, structured path for learning how the web is built, from a first page to core front-end skills.",
      description: "Learn Web Development on MDN is a set of tutorials, challenges and guides maintained by the MDN community. No payment or account is required to read the material and use the examples.",
      categories: ["technology"],
      type: "course",
      publisher: "MDN (Mozilla)",
      access: "Free",
      action: "Explore",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
      added: "2026-11-15"
    },
    {
      id: "mit-introductory-programming",
      title: "Introductory Programming",
      summary: "A free MIT OpenCourseWare collection of introductory programming courses and teaching materials.",
      description: "MIT OpenCourseWare gathers introductory programming courses you can study at your own pace. Open an individual course on OCW for its materials, licence and any notes about reuse. This entry links to the collection, not to a single class.",
      categories: ["technology"],
      type: "course",
      publisher: "MIT OpenCourseWare",
      access: "Free",
      action: "Explore",
      url: "https://ocw.mit.edu/collections/introductory-programming/",
      added: "2026-11-12"
    },
    {
      id: "ted-ai-and-your-job",
      title: "AI Is Coming for Your Job. Now What?",
      summary: "Vlad Tenev’s TED talk on how work may change as artificial intelligence spreads, and how people might respond.",
      description: "TED’s talk with Vlad Tenev looks at jobs, skills and the choices people and companies face as artificial intelligence becomes more capable. It is filed under both Technology and Industry and Future of Work. Watch it on this page or open it on YouTube.",
      categories: ["technology", "industry"],
      type: "video",
      publisher: "TED",
      access: "Free",
      action: "Watch",
      url: "https://www.youtube.com/watch?v=cJfKqKEyw1o",
      youtubeId: "cJfKqKEyw1o",
      added: "2026-11-18"
    },
    {
      id: "openstax-entrepreneurship",
      title: "Entrepreneurship",
      summary: "A free introductory entrepreneurship textbook from OpenStax, to read online and to download as a PDF from the publisher.",
      description: "Entrepreneurship is an open textbook published by OpenStax for a first course in starting and developing a venture. Michael Laverty and Chris Littel are the principal authors. The publisher’s page offers the web edition and a PDF download. ES International does not host the file. Confirm the current Creative Commons licence on that page before reusing the text.",
      categories: ["entrepreneurship"],
      type: "ebook",
      publisher: "OpenStax",
      access: "Free",
      action: "Read",
      url: "https://openstax.org/details/books/entrepreneurship",
      licence: "Open textbook. See the OpenStax page for the current Creative Commons licence and full attribution.",
      added: "2026-11-14"
    },
    {
      id: "entrepreneurship-essentials",
      title: "Entrepreneurship Essentials",
      summary: "A free open textbook for introductory entrepreneurship, with a browser edition you can read online.",
      description: "Entrepreneurship Essentials, by Dr. Greg Watson, is an open educational textbook covering opportunity, customers, business models, experiments, finance and pitching. The online edition is free under a Creative Commons Attribution 4.0 licence. The publisher also offers a PDF. Printed copies sold through retailers are separate and are not free.",
      categories: ["entrepreneurship"],
      type: "ebook",
      publisher: "Entrepreneurship Essentials",
      access: "Free",
      action: "Read",
      url: "https://www.entrepreneurshipessentials.com/read/",
      licence: "CC BY 4.0. Author: Dr. Greg Watson.",
      added: "2026-11-10"
    },
    {
      id: "ted-problem-to-solve",
      title: "Want to Succeed in Business? Find a Problem to Solve",
      summary: "A TED conversation about building a business by starting with a problem people actually need solved.",
      description: "Anthony Tan and Amane Dannouni talk with TED about finding a real problem before trying to grow a business. The film is published by TED on YouTube.",
      categories: ["entrepreneurship"],
      type: "video",
      publisher: "TED",
      access: "Free",
      action: "Watch",
      url: "https://www.youtube.com/watch?v=Im_ghczQEPw",
      youtubeId: "Im_ghczQEPw",
      added: "2026-11-05"
    },
    {
      id: "idea-un-democracy-hub",
      title: "UN and Democracy Hub",
      summary: "International IDEA’s public digital library of United Nations resources on democracy, participation, rights, peace and development.",
      description: "The UN and Democracy Hub, from the International Institute for Democracy and Electoral Assistance, organises knowledge resources, data and analysis on how democracy appears in the work of the United Nations. It is published for researchers, students and the general public. The collection is educational and nonpartisan.",
      categories: ["politics"],
      type: "research",
      publisher: "International IDEA",
      access: "Free",
      action: "Explore",
      url: "https://www.idea.int/data-tools/tools/un-and-democracy-hub",
      added: "2026-11-09"
    },
    {
      id: "ted-citizens-building-future",
      title: "How Citizens (Not Politicians) Are Building the Future",
      summary: "Jon Alexander’s TED talk on people taking a larger part in public life, rather than leaving it to politicians alone.",
      description: "Jon Alexander’s TED talk argues for a shift from seeing ourselves only as consumers toward a more active citizenship. It is an educational talk about participation. It is not a party campaign, and ES International does not present it as one.",
      categories: ["politics"],
      type: "video",
      publisher: "TED",
      access: "Free",
      action: "Watch",
      url: "https://www.youtube.com/watch?v=tXZs2NuLFRA",
      youtubeId: "tXZs2NuLFRA",
      added: "2026-11-04"
    },
    {
      id: "ou-design-thinking",
      title: "Design Thinking",
      summary: "A free OpenLearn course on using creativity, composition and visual thinking to work through design problems.",
      description: "Design Thinking, from The Open University, is a free course with downloadable material. The course page lists Word and PDF versions. You can open the course without signing up. Registration is optional, for saving progress and a free statement of participation.",
      categories: ["design"],
      type: "course",
      publisher: "The Open University",
      access: "Free",
      action: "Explore",
      url: "https://www.open.edu/openlearn/science-maths-technology/design-innovation/design-thinking",
      added: "2026-11-16"
    },
    {
      id: "ideo-design-tools",
      title: "IDEO.org Design Tools",
      summary: "Design-thinking tools from IDEO.org for understanding people, framing a problem and trying ideas.",
      description: "IDEO.org publishes design-thinking tools for studying a problem with the people affected by it and for testing possible responses. Open the tools page on IDEO.org to use what is published there.",
      categories: ["design"],
      type: "toolkit",
      publisher: "IDEO.org",
      access: "External resource",
      action: "Explore",
      url: "https://www.ideo.org/tools",
      added: "2026-11-13"
    },
    {
      id: "ted-designers-think-big",
      title: "Tim Brown Urges Designers to Think Big",
      summary: "Tim Brown’s TED talk on taking design beyond objects and into larger social and organisational problems.",
      description: "Tim Brown asks designers to apply design thinking to systems and services, not only to products. The talk is published by TED on YouTube.",
      categories: ["design"],
      type: "video",
      publisher: "TED",
      access: "Free",
      action: "Watch",
      url: "https://www.youtube.com/watch?v=UAinLaT42xY",
      youtubeId: "UAinLaT42xY",
      added: "2026-11-03"
    },
    {
      id: "wef-future-of-jobs-2025",
      title: "The Future of Jobs Report 2025",
      summary: "The World Economic Forum’s 2025 report on how jobs, skills and industries are shifting.",
      description: "The Future of Jobs Report 2025 is the World Economic Forum’s research report on employment, skills and technology. Open the publication page to read it and to see the current download options. This catalogue does not re-host the file.",
      categories: ["industry"],
      type: "report",
      publisher: "World Economic Forum",
      access: "External resource",
      action: "Read",
      url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025",
      added: "2026-11-17"
    },
    {
      id: "our-world-in-data",
      title: "Our World in Data",
      summary: "Free research, articles and interactive charts on long-term global change, from health and education to poverty, rights and the environment.",
      description: "Our World in Data publishes research and data visualisations that help readers understand how the world is changing. The site is free to read and explore. Start from the homepage and follow a topic that matters to you.",
      categories: ["trends"],
      type: "research",
      publisher: "Our World in Data",
      access: "Free",
      action: "Explore",
      url: "https://ourworldindata.org/",
      added: "2026-11-19"
    },
    {
      id: "ted-global-power-shift",
      title: "The Global Power Shift",
      summary: "A TED playlist of talks on global politics, cities, power and how influence is moving.",
      description: "The Global Power Shift is a TED playlist of big-picture talks, including Parag Khanna on megacities and Paddy Ashdown on changing power. It plays on TED’s site as a collection, so it is not embedded here as a single film.",
      categories: ["trends"],
      type: "video",
      publisher: "TED",
      access: "Free",
      action: "Watch",
      url: "https://www.ted.com/playlists/73/the_global_power_shift",
      youtubeId: "",
      added: "2026-11-08"
    },
    {
      id: "unesco-open-educational-resources",
      title: "Open Educational Resources",
      summary: "UNESCO’s introduction to open educational resources, and a way into learning materials that can be freely used.",
      description: "This UNESCO page explains open educational resources and the international effort to make learning materials available for teaching and study. It is a directory and an introduction, not a single course.",
      categories: ["trends"],
      type: "research",
      publisher: "UNESCO",
      access: "Free",
      action: "Explore",
      url: "https://www.unesco.org/en/open-educational-resources",
      added: "2026-11-07"
    }
  ],
  featured: [
    "ou-leadership-followership",
    "mdn-learn-web-development",
    "openstax-entrepreneurship",
    "ou-design-thinking",
    "our-world-in-data",
    "ted-ai-and-your-job"
  ]
};
