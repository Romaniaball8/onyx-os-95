import { r as reactExports, j as jsxRuntimeExports } from "./index-D7X0lYXV.js";
const HOME_URL = "home";
function isInternalUrl(url) {
  return url.startsWith("internal://");
}
const QUICK_LINKS = [
  { label: "News", url: "internal://news", icon: "🗞", desc: "Onyx Daily News" },
  {
    label: "Games",
    url: "https://archive.org/details/internetarcade",
    icon: "🎮",
    desc: "Internet Archive Arcade"
  },
  {
    label: "Search",
    url: "internal://search",
    icon: "🔍",
    desc: "Onyx Web Search"
  },
  {
    label: "Weather",
    url: "internal://weather",
    icon: "🌤",
    desc: "Weather Report"
  },
  {
    label: "Wikipedia",
    url: "internal://wikipedia",
    icon: "📖",
    desc: "The Free Encyclopedia"
  },
  {
    label: "Help",
    url: "internal://help",
    icon: "❓",
    desc: "Onyx OS 95 Help"
  }
];
function resolveUrl(input) {
  const trimmed = input.trim();
  if (!trimmed || trimmed === HOME_URL) return HOME_URL;
  if (isInternalUrl(trimmed)) return trimmed;
  const aliases = {
    wikipedia: "internal://wikipedia",
    wiki: "internal://wikipedia",
    news: "internal://news",
    search: "internal://search",
    help: "internal://help",
    weather: "internal://weather"
  };
  if (aliases[trimmed.toLowerCase()]) return aliases[trimmed.toLowerCase()];
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  if (!trimmed.includes(" ") && trimmed.includes("."))
    return `https://${trimmed}`;
  return `https://html.duckduckgo.com/html/?q=${encodeURIComponent(trimmed)}`;
}
const aStyle = {
  color: "#0000cc",
  textDecoration: "underline",
  cursor: "pointer",
  fontFamily: "Times New Roman, serif"
};
const WIKI_ARTICLES = [
  { id: "roman-empire", title: "The Roman Empire" },
  { id: "solar-system", title: "The Solar System" },
  { id: "amazon", title: "The Amazon Rainforest" },
  { id: "computers", title: "History of Computers" },
  { id: "french-rev", title: "The French Revolution" },
  { id: "dna", title: "DNA and Genetics" }
];
function WikipediaPage({
  navigate,
  hash
}) {
  const [activeId, setActiveId] = reactExports.useState(hash || "roman-empire");
  reactExports.useEffect(() => {
    if (hash) setActiveId(hash);
  }, [hash]);
  const go = (id) => {
    setActiveId(id);
    navigate(`internal://wikipedia#${id}`);
  };
  const article = WIKI_ARTICLES.find((a) => a.id === activeId) ?? WIKI_ARTICLES[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: "#fff",
        height: "100%",
        overflowY: "auto",
        fontFamily: "Times New Roman, serif",
        fontSize: 13,
        color: "#000"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#f8f8f8",
              borderBottom: "1px solid #aaa",
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20 }, children: "📖" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "Arial, sans-serif",
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#000"
                  },
                  children: "OnyxPedia"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "Arial, sans-serif",
                    fontSize: 11,
                    color: "#555"
                  },
                  children: "— The Free Encyclopedia"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", minHeight: "calc(100% - 36px)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                width: 150,
                flexShrink: 0,
                background: "#f0f0e8",
                borderRight: "1px solid #aaa",
                padding: "8px 6px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontFamily: "Arial, sans-serif",
                      fontSize: 11,
                      fontWeight: "bold",
                      marginBottom: 6,
                      color: "#555"
                    },
                    children: "ARTICLES"
                  }
                ),
                WIKI_ARTICLES.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => go(a.id),
                    style: {
                      ...aStyle,
                      background: "none",
                      border: "none",
                      padding: 0,
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: activeId === a.id ? "bold" : "normal",
                      color: activeId === a.id ? "#000" : "#0000cc"
                    },
                    children: a.title
                  }
                ) }, a.id)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: { borderTop: "1px solid #aaa", margin: "10px 0" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 10,
                      color: "#777",
                      fontFamily: "Arial, sans-serif"
                    },
                    children: "OnyxPedia is a free encyclopedia built into Onyx OS 95."
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "10px 16px", maxWidth: 680 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h1",
              {
                style: {
                  fontFamily: "Linux Libertine, Georgia, serif",
                  fontSize: 22,
                  fontWeight: "normal",
                  borderBottom: "1px solid #aaa",
                  paddingBottom: 4,
                  marginBottom: 10
                },
                children: article.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(WikiArticleBody, { id: activeId, go })
          ] })
        ] })
      ]
    }
  );
}
function WikiArticleBody({ id, go }) {
  const L = (to, label) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => go(to),
      style: {
        ...aStyle,
        background: "none",
        border: "none",
        padding: 0,
        fontSize: 13
      },
      children: label
    }
  );
  if (id === "roman-empire")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "The ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Roman Empire" }),
        " was the post-Republican period of ancient Rome, characterized by government headed by emperors and large territorial holdings around the Mediterranean in Europe, Asia, and Africa. The city of Rome was founded, according to tradition, on April 21, 753 BC. At its height under Emperor Trajan (98–117 AD), the empire encompassed about 5 million square kilometres."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The Roman Empire succeeded the Roman Republic, which had governed Rome for nearly five centuries before the rule of the first emperor, Augustus, who came to power after the assassination of his great-uncle Julius Caesar. Rome had spread its influence throughout the Mediterranean during the Republic; the Empire continued this expansion and brought significant portions of Europe, North Africa, and western Asia under Roman control." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Roman culture, law, and engineering had a profound influence on the development of Western civilization. Roman roads, aqueducts, and architecture survive to this day as remarkable feats of ancient engineering. The Latin language evolved into the Romance languages — including French, Spanish, Italian, Portuguese, and Romanian — spoken by hundreds of millions of people today." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The Western Roman Empire fell in 476 AD when the last emperor, Romulus Augustulus, was deposed by the Germanic chieftain Odoacer. The Eastern Roman Empire, known as the Byzantine Empire, continued until the fall of Constantinople in 1453 AD." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "See also: ",
        L("french-rev", "The French Revolution"),
        " ·",
        " ",
        L("computers", "History of Computers")
      ] })
    ] });
  if (id === "solar-system")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "The ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Solar System" }),
        " is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The Solar System consists of the Sun and everything that orbits it: eight planets, at least five dwarf planets (Pluto, Eris, Haumea, Makemake, and Ceres), 293 known moons, and countless asteroids, comets, and other small bodies. The four inner terrestrial planets — Mercury, Venus, Earth, and Mars — are rocky worlds. Beyond the asteroid belt lie four gas giants: Jupiter, Saturn, Uranus, and Neptune." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Earth is the only known planet to support life. It has one natural satellite, the Moon, which is thought to have formed when a Mars-sized body collided with the early Earth. The Moon stabilizes Earth's axial tilt and is responsible for tidal phenomena." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Space exploration began in earnest in the late 1950s. Sputnik 1 (1957) was the first artificial satellite. Yuri Gagarin became the first human in space in 1961. The Apollo 11 mission in 1969 landed the first humans on the Moon. Unmanned probes have visited all eight planets, and several have traveled beyond the Solar System into interstellar space." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "See also: ",
        L("dna", "DNA and Genetics"),
        " ·",
        " ",
        L("amazon", "The Amazon Rainforest")
      ] })
    ] });
  if (id === "amazon")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "The ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Amazon Rainforest" }),
        ", also known as Amazonia, is a moist broadleaf tropical rainforest in the Amazon biome that covers most of the Amazon basin of South America. This basin encompasses 7,000,000 km² (2,700,000 sq mi), of which 5,500,000 km² (2,100,000 sq mi) are covered by the rainforest. This region includes territory belonging to nine nations and 3,344 formally acknowledged indigenous territories."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The Amazon represents over half of the planet's remaining rainforests and comprises the largest and most biodiverse tract of tropical rainforest in the world. With 390 billion individual trees divided into 16,000 species, the Amazon is home to more than 10% of all species on Earth. The Amazon River system contains about 20% of all fresh water that flows into the world's oceans." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Indigenous peoples have lived in Amazonia for thousands of years. European exploration began in the 16th century; Francisco de Orellana made the first full navigation of the Amazon River in 1541–42. European colonization brought disease that devastated native populations. Today, approximately 30 million people live in the Amazon region." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Deforestation is a major threat to the Amazon. Between 1978 and 2020, more than 760,000 km² of Amazon forest were lost. Scientists warn that large-scale deforestation could push the Amazon past a tipping point, transforming large portions of the rainforest into savanna and releasing vast quantities of stored carbon into the atmosphere." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "See also: ",
        L("solar-system", "The Solar System"),
        " ·",
        " ",
        L("dna", "DNA and Genetics")
      ] })
    ] });
  if (id === "computers")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "The ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "history of computers" }),
        " began long before the modern era. The first mechanical calculating devices appeared in the 17th century. French mathematician Blaise Pascal invented the Pascaline in 1642, a mechanical calculator capable of addition and subtraction. Gottfried Wilhelm Leibniz later improved on Pascal's design to create a machine that could also multiply and divide."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Charles Babbage, an English mathematician, designed the Difference Engine in the 1820s to automate mathematical calculations. His later design, the Analytical Engine (never completed), incorporated many concepts found in modern computers: an input device, a memory store, a processor, and an output device. Ada Lovelace, often considered the first programmer, wrote algorithms intended for this machine." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The first electronic computers emerged in the 1940s. ENIAC (Electronic Numerical Integrator and Computer), completed in 1945, was one of the earliest general-purpose electronic computers. It weighed 30 tons and occupied 167 square meters. The invention of the transistor in 1947 at Bell Labs revolutionized computing, enabling far smaller and more reliable machines." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The microprocessor — an entire CPU on a single chip — arrived in the early 1970s. Intel's 4004 (1971) was the first commercially available microprocessor. The personal computer revolution followed, with machines like the Apple II (1977) and IBM PC (1981) bringing computing to homes and offices worldwide. Microsoft's MS-DOS became the dominant operating system of the era, followed by Windows 95, which brought a graphical interface to millions of users." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "See also: ",
        L("roman-empire", "The Roman Empire"),
        " ·",
        " ",
        L("french-rev", "The French Revolution")
      ] })
    ] });
  if (id === "french-rev")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "The ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "French Revolution" }),
        " (1789–1799) was a period of radical political and societal transformation in France that began with the Estates General of 1789 and ended with the formation of the French Consulate in November 1799. Many of its ideas are considered fundamental principles of liberal democracy, while the values and institutions it created — equality before the law, nationalism, and popular sovereignty — have shaped modern politics worldwide."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The Revolution was triggered by a financial crisis caused by France's involvement in the American Revolutionary War and decades of poor harvests that led to food shortages. King Louis XVI called a meeting of the Estates General in May 1789, the first such meeting since 1614. The Third Estate (representing common people) declared itself a National Assembly, and when locked out of their meeting hall, took an oath to draft a new constitution — the famous Tennis Court Oath." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "On July 14, 1789, Parisian crowds stormed the Bastille prison, a symbol of royal tyranny. The National Constituent Assembly passed the Declaration of the Rights of Man and of the Citizen in August 1789, proclaiming liberty, equality, and fraternity. The royal family was placed under house arrest; in 1792, France became a republic. King Louis XVI was executed by guillotine on January 21, 1793." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The Reign of Terror (1793–1794), led by Maximilien Robespierre and the Committee of Public Safety, resulted in the execution of tens of thousands. Robespierre himself was arrested and guillotined in the Thermidorian Reaction of 1794. Napoleon Bonaparte rose to power during this unstable period, eventually seizing control in the coup of 18 Brumaire in 1799." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "See also: ",
        L("roman-empire", "The Roman Empire"),
        " ·",
        " ",
        L("computers", "History of Computers")
      ] })
    ] });
  if (id === "dna")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Deoxyribonucleic acid" }),
        " (DNA) is a polymer composed of two polynucleotide chains that coil around each other to form a double helix. DNA carries genetic instructions for the development, functioning, growth, and reproduction of all known organisms and many viruses. DNA and ribonucleic acid (RNA) are nucleic acids; alongside proteins, lipids, and complex carbohydrates, they are one of the four major types of macromolecules essential for all known forms of life."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The structure of DNA was first described in 1953 by James Watson and Francis Crick, using X-ray crystallography work by Rosalind Franklin and Maurice Wilkins. Watson, Crick, and Wilkins received the Nobel Prize in Physiology or Medicine in 1962. The double helix is made of two strands of nucleotides linked by hydrogen bonds; the sequence of nucleotides — adenine (A), thymine (T), cytosine (C), and guanine (G) — encodes genetic information." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The human genome contains approximately 3 billion base pairs of DNA organized into 23 chromosomes. Every cell in the human body (except red blood cells) contains a complete copy of the entire genome. The Human Genome Project, completed in 2003, was a landmark international scientific effort that mapped and sequenced the entire human genome for the first time." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Genetics, the study of genes and heredity, was pioneered by Gregor Mendel in the 19th century through his experiments with pea plants. Modern genetic technology — including PCR (polymerase chain reaction), gene sequencing, and CRISPR gene editing — has revolutionized medicine, agriculture, and forensic science." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "See also: ",
        L("solar-system", "The Solar System"),
        " ·",
        " ",
        L("amazon", "The Amazon Rainforest")
      ] })
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Article not found." });
}
const NEWS_ARTICLES = [
  {
    id: "win98",
    date: "July 25, 1998",
    headline: "Windows 98 Released to Public Acclaim",
    category: "TECHNOLOGY",
    body: 'Microsoft Corporation officially launched Windows 98 today, the latest version of its popular Windows operating system. The new OS features improved USB support, the Windows Driver Model, and tight integration with Internet Explorer 4.0. Consumers lined up outside computer stores across the United States to purchase the new software. Microsoft Chairman Bill Gates called Windows 98 "the best Windows ever." Analysts predict it will sell millions of copies before the end of the year.'
  },
  {
    id: "mars",
    date: "March 12, 1997",
    headline: "Scientists Discover Possible Mars Water Evidence",
    category: "SCIENCE",
    body: 'NASA scientists announced today that data from the Mars Global Surveyor probe suggests the presence of ancient water channels on the surface of Mars. The findings, published in the journal Science, indicate that Mars may have once had liquid water flowing across its surface billions of years ago. "This is extraordinarily exciting," said lead researcher Dr. Michael Carr. "Wherever there is water on Earth, there is life. The question is whether life ever existed on Mars." The Mars Pathfinder mission later in the year is expected to provide additional data.'
  },
  {
    id: "internet100m",
    date: "January 5, 1999",
    headline: "Internet Users Now Top 100 Million Worldwide",
    category: "TECHNOLOGY",
    body: 'The number of Internet users worldwide has surpassed 100 million for the first time, according to a new report from the Internet Society. The rapid growth, from just 16 million users in 1995, reflects explosive adoption of the World Wide Web in North America, Europe, and parts of Asia. E-commerce revenues are projected to reach $8 billion in 1999. "We are witnessing the most rapid adoption of a new technology in human history," said Internet Society chairman Vint Cerf, one of the creators of the TCP/IP protocol.'
  },
  {
    id: "netscape",
    date: "June 11, 1997",
    headline: "Netscape Releases Navigator 4.0 With New Features",
    category: "TECHNOLOGY",
    body: "Netscape Communications Corporation released Netscape Navigator 4.0 today, the latest version of its popular web browser. The new release includes support for Dynamic HTML, JavaScript 1.2, and Netscape's own style sheet implementation. The browser war with Microsoft's Internet Explorer intensifies as both companies race to add new features. Netscape also announced Netscape Communicator 4.0, a full suite including email, newsgroup reader, and HTML editor. The company holds roughly 58% of the browser market."
  },
  {
    id: "y2k",
    date: "December 1, 1999",
    headline: "Y2K Bug: World Prepares for the Millennium",
    category: "TECHNOLOGY",
    body: "With only one month until the year 2000, governments, banks, and corporations worldwide are scrambling to address the Year 2000 computer problem, popularly known as the Y2K bug. The issue stems from early computer programs that stored years with only two digits, meaning computers may interpret '00' as 1900 instead of 2000. The United States federal government alone has spent over $8 billion on Y2K remediation efforts. While experts disagree on the severity of potential disruptions, many citizens are stockpiling food, water, and cash as a precaution."
  },
  {
    id: "deepblue",
    date: "May 12, 1997",
    headline: "IBM Deep Blue Defeats Chess Champion Kasparov",
    category: "SCIENCE",
    body: "IBM's Deep Blue supercomputer defeated world chess champion Garry Kasparov in a six-game match, winning 3.5 games to 2.5. It was the first time a computer had defeated a reigning world chess champion in a match under standard chess tournament time controls. Kasparov accused IBM of cheating, claiming that some moves suggested human intervention. IBM denied the allegations and later dismantled the machine. The victory was hailed as a landmark achievement in artificial intelligence research."
  },
  {
    id: "dolly",
    date: "February 24, 1997",
    headline: "Scientists Clone Sheep; World Watches in Awe",
    category: "SCIENCE",
    body: "Scottish scientists at the Roslin Institute announced today the successful cloning of a sheep named Dolly, the first mammal to be cloned from an adult cell using somatic cell nuclear transfer. Dolly was born on July 5, 1996, but the achievement was kept secret for months pending publication in the journal Nature. The announcement ignited fierce debate about the ethics of cloning technology and its potential application to humans. President Clinton called for a moratorium on federal funding for human cloning research."
  },
  {
    id: "google",
    date: "September 7, 1998",
    headline: "Two Stanford Students Launch New Search Engine: Google",
    category: "TECHNOLOGY",
    body: `Larry Page and Sergey Brin, two PhD students at Stanford University, officially incorporated Google Inc. today with initial funding of $100,000 from Sun Microsystems co-founder Andy Bechtolsheim. The new search engine, which uses a novel algorithm called PageRank to rank web pages by the number and quality of links pointing to them, has been available in beta at google.stanford.edu since 1997. Early users report dramatically better results than existing search engines like AltaVista and Yahoo. "The name is a play on 'googol,' a mathematical term for a 1 followed by 100 zeros," said Page.`
  },
  {
    id: "titanic",
    date: "April 8, 1998",
    headline: "Titanic Becomes Highest-Grossing Film of All Time",
    category: "ENTERTAINMENT",
    body: "James Cameron's epic disaster film Titanic has become the highest-grossing film of all time, surpassing Jurassic Park's previous record. The film, starring Leonardo DiCaprio and Kate Winslet, has earned over $1.8 billion worldwide since its release in December 1997. Titanic won 11 Academy Awards including Best Picture and Best Director. The film tells the story of the ill-fated ocean liner RMS Titanic, which sank on April 15, 1912, after striking an iceberg in the North Atlantic Ocean."
  }
];
function NewsPage() {
  const [selected, setSelected] = reactExports.useState(null);
  const article = NEWS_ARTICLES.find((a) => a.id === selected);
  const catColor = (c) => {
    const m = {
      TECHNOLOGY: "#000080",
      SCIENCE: "#005500",
      ENTERTAINMENT: "#660044"
    };
    return m[c] ?? "#333";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: "#fff",
        height: "100%",
        overflowY: "auto",
        fontFamily: "Times New Roman, serif",
        fontSize: 13,
        color: "#000"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#000080",
              color: "#fff",
              padding: "6px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontFamily: "Times New Roman, serif",
                      fontSize: 22,
                      fontWeight: "bold",
                      letterSpacing: 2
                    },
                    children: "THE ONYX DAILY"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 10,
                      fontFamily: "Arial, sans-serif",
                      color: "#aabbff"
                    },
                    children: "Your Trusted Source for Late-Breaking News"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    textAlign: "right",
                    fontSize: 10,
                    fontFamily: "Arial, sans-serif",
                    color: "#aabbff"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Est. 1995" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Onyx OS 95 Edition" })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#ffff99",
              border: "1px solid #cc9900",
              padding: "2px 10px",
              fontSize: 11,
              fontFamily: "Arial, sans-serif"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "BREAKING:" }),
              " Y2K preparations intensify as year 2000 approaches — scientists urge calm"
            ]
          }
        ),
        selected && article ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 16px", maxWidth: 680 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setSelected(null),
              style: {
                ...aStyle,
                fontSize: 11,
                fontFamily: "Arial, sans-serif",
                background: "none",
                border: "none",
                padding: 0,
                marginBottom: 8
              },
              children: "◀ Back to Headlines"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                background: "#eef0ff",
                border: "1px solid #8090cc",
                padding: "2px 8px",
                display: "inline-block",
                marginBottom: 6,
                fontSize: 10,
                fontFamily: "Arial, sans-serif",
                color: catColor(article.category),
                fontWeight: "bold"
              },
              children: article.category
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              style: {
                fontFamily: "Times New Roman, serif",
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 4,
                lineHeight: 1.2
              },
              children: article.headline
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                fontSize: 11,
                fontFamily: "Arial, sans-serif",
                color: "#555",
                marginBottom: 10
              },
              children: [
                article.date,
                " — Onyx Daily Staff Reporter"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: { borderTop: "2px solid #000080", marginBottom: 10 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { lineHeight: 1.7 }, children: article.body })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 12px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontFamily: "Arial, sans-serif",
                fontSize: 11,
                fontWeight: "bold",
                color: "#000080",
                borderBottom: "1px solid #000080",
                marginBottom: 6,
                paddingBottom: 2
              },
              children: "TOP HEADLINES"
            }
          ),
          NEWS_ARTICLES.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                borderBottom: "1px solid #ddd",
                paddingBottom: 8,
                marginBottom: 8
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: { display: "flex", gap: 8, alignItems: "flex-start" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          background: catColor(a.category),
                          color: "#fff",
                          fontSize: 9,
                          fontFamily: "Arial, sans-serif",
                          fontWeight: "bold",
                          padding: "1px 4px",
                          whiteSpace: "nowrap",
                          marginTop: 2
                        },
                        children: a.category
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setSelected(a.id),
                          style: {
                            ...aStyle,
                            background: "none",
                            border: "none",
                            padding: 0,
                            fontFamily: "Times New Roman, serif",
                            fontSize: 15,
                            fontWeight: "bold",
                            display: "block",
                            textAlign: "left"
                          },
                          children: a.headline
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            fontSize: 11,
                            color: "#555",
                            fontFamily: "Arial, sans-serif"
                          },
                          children: [
                            a.date,
                            " — ",
                            a.body.slice(0, 80),
                            "..."
                          ]
                        }
                      )
                    ] })
                  ]
                }
              )
            },
            a.id
          ))
        ] })
      ]
    }
  );
}
function buildSearchIndex() {
  const results = [];
  for (const a of WIKI_ARTICLES) {
    results.push({
      url: `internal://wikipedia#${a.id}`,
      title: `OnyxPedia: ${a.title}`,
      snippet: `Read the OnyxPedia article about ${a.title} — free encyclopedia article with full details and related links.`
    });
  }
  for (const a of NEWS_ARTICLES) {
    results.push({
      url: `internal://news#${a.id}`,
      title: `Onyx Daily: ${a.headline}`,
      snippet: `${a.date} — ${a.body.slice(0, 100)}...`
    });
  }
  results.push(
    {
      url: "internal://help",
      title: "Onyx OS 95 Help Center",
      snippet: "Get help with Onyx OS 95 features, apps, chat, and more. Frequently asked questions and user guide."
    },
    {
      url: "internal://weather",
      title: "Weather Report — Onyx OS 95",
      snippet: "Current weather conditions and forecast for your area."
    }
  );
  return results;
}
const SEARCH_INDEX = buildSearchIndex();
function SearchPage({ navigate }) {
  const [query, setQuery] = reactExports.useState("");
  const results = query.trim().length === 0 ? [] : SEARCH_INDEX.filter((r) => {
    const q = query.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: "#fff",
        height: "100%",
        overflowY: "auto",
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
        color: "#000"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { background: "#000080", color: "#fff", padding: "8px 16px" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontFamily: "Times New Roman, serif",
                    fontSize: 20,
                    fontWeight: "bold"
                  },
                  children: "🔍 Onyx Web Search"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#aabbff" }, children: "Search the Onyx OS 95 built-in knowledge base" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px", maxWidth: 600, margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginBottom: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: "Search articles, news, help...",
                style: {
                  flex: 1,
                  padding: "4px 8px",
                  fontSize: 13,
                  border: "2px inset #888",
                  fontFamily: "Arial, sans-serif"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                style: {
                  background: "#000080",
                  color: "#fff",
                  border: "none",
                  padding: "4px 14px",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 12,
                  cursor: "pointer"
                },
                children: "Search"
              }
            )
          ] }),
          query.trim() === "" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#555", fontSize: 12, marginBottom: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Try searching for:" }),
            " Roman Empire · solar system · Windows 98 · DNA · French Revolution · Y2K · Google"
          ] }),
          query.trim() !== "" && results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#555", fontSize: 12 }, children: [
            "No results found for ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
              '"',
              query,
              '"'
            ] }),
            ". Try different keywords."
          ] }),
          results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#555", marginBottom: 8 }, children: [
              results.length,
              " result",
              results.length !== 1 ? "s" : "",
              " found"
            ] }),
            results.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  marginBottom: 16,
                  paddingBottom: 10,
                  borderBottom: "1px solid #e0e0e0"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => navigate(r.url),
                      style: {
                        ...aStyle,
                        background: "none",
                        border: "none",
                        padding: 0,
                        fontSize: 15,
                        display: "block",
                        textAlign: "left",
                        fontFamily: "Arial, sans-serif"
                      },
                      "data-ocid": `ie.search_result.${i + 1}`,
                      children: r.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: { color: "#006600", fontSize: 11, marginBottom: 2 },
                      children: r.url
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "#333", lineHeight: 1.5 }, children: r.snippet })
                ]
              },
              r.url
            ))
          ] })
        ] })
      ]
    }
  );
}
function HelpPage() {
  const faqs = [
    {
      q: "How do I create an account?",
      a: "Click on any app that requires login (such as Live Chat, Mail, or Friends). A login/register dialog will appear. Enter your desired username and password. If the username is new, your account will be created automatically. Your login is saved in your browser."
    },
    {
      q: "Who is the Owner of Onyx OS 95?",
      a: "The username Mr.Romaniaman is the Owner. The Owner has special powers including setting text plates and username effects for all users. Other users may be promoted to Admin by the Owner, granting them similar elevated privileges."
    },
    {
      q: "What are Text Plates and Username Effects?",
      a: "Text Plates are animated backgrounds that appear behind your username in Live Chat. Effects such as galaxy, rainbow gradient, fire, aurora borealis, and others are available. Username Effects change how your name is displayed — fire, ice, glitch, gold, cyberpunk, and more. All users can set their own username effects. Only Owners and Admins can set text plates."
    },
    {
      q: "How do I use the Live Chat?",
      a: "Open the Live Chat app from the desktop. Log in if prompted. Type your message in the input box at the bottom and press Enter or click Send. Your message will appear for all online users. Chat history is saved automatically."
    },
    {
      q: "How does Internet Explorer work?",
      a: "Internet Explorer is a retro browser simulator. You can visit built-in pages like Wikipedia (OnyxPedia), the Onyx Daily News, this Help page, and use the Search feature — all without any external internet connection needed. For external sites, Internet Explorer attempts to load them inside the window; sites that block embedding will show an error."
    },
    {
      q: "How do I add friends and send private messages?",
      a: "Open the Friends app from the desktop. Browse registered users and send a friend request. Once accepted, you can send private messages through the Friends app. Both users must be registered for this to work."
    },
    {
      q: "How do I send mail to other users?",
      a: "Open the Mail app. You can compose a new message and address it to any registered username. Messages are stored locally and delivered within Onyx OS 95 — no real email is required."
    },
    {
      q: "What games are available in Game Center?",
      a: "Game Center includes five fully playable classic arcade games: Tetris, Space Invaders, Breakout, Frogger, and Pac-Man. Each game is built directly into Onyx OS 95 and works completely offline."
    },
    {
      q: "How do I change my biography?",
      a: "Open My Computer from the desktop and navigate to your user profile. You can edit your bio text there. Changes are saved automatically to your browser's local storage."
    },
    {
      q: "What is the Computer Network app?",
      a: "The Computer Network app shows which registered users are currently online in Onyx OS 95. It simulates the 'Network Neighborhood' concept from Windows 95/98."
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: "#c0c0c0",
        height: "100%",
        overflowY: "auto",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 12
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "linear-gradient(90deg, #000080, #1060c0)",
              color: "#fff",
              padding: "3px 8px",
              fontFamily: "Tahoma, sans-serif",
              fontSize: 12,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 6
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "❓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Onyx OS 95 Help Topics" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", height: "calc(100% - 26px)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                width: 180,
                borderRight: "1px solid #808080",
                background: "#f0f0f0",
                padding: "8px 6px",
                overflowY: "auto"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", fontSize: 11, marginBottom: 6 }, children: "Contents" }),
                faqs.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `#help-${i}`,
                    style: {
                      color: "#000080",
                      fontSize: 11,
                      textDecoration: "none"
                    },
                    children: [
                      "📄 ",
                      f.q.replace(/\?$/, "")
                    ]
                  }
                ) }, f.q))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                flex: 1,
                padding: "10px 14px",
                overflowY: "auto",
                background: "#fff"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    style: {
                      fontSize: 16,
                      fontFamily: "Arial, sans-serif",
                      color: "#000080",
                      borderBottom: "1px solid #000080",
                      paddingBottom: 4,
                      marginBottom: 10
                    },
                    children: "Onyx OS 95 Help Center"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 12, color: "#333", marginBottom: 14 }, children: "Welcome to Onyx OS 95 Help. Click a topic on the left, or read all frequently asked questions below." }),
                faqs.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: `help-${i}`, style: { marginBottom: 14 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        background: "#e8eef8",
                        border: "1px solid #8090cc",
                        padding: "3px 8px",
                        fontWeight: "bold",
                        fontSize: 12,
                        color: "#000080"
                      },
                      children: f.q
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        background: "#fffff8",
                        border: "1px solid #ccc",
                        borderTop: "none",
                        padding: "6px 8px",
                        fontSize: 12,
                        lineHeight: 1.6,
                        color: "#222"
                      },
                      children: f.a
                    }
                  )
                ] }, f.q)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: { borderTop: "1px solid #888", margin: "10px 0" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#555" }, children: [
                  "Onyx OS 95 v1.0 — Compaq Presario 700, Intel 486, 8 MB RAM",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "© ",
                  (/* @__PURE__ */ new Date()).getFullYear(),
                  " Onyx OS 95. All rights reserved."
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function WeatherPage() {
  const days = [
    { day: "Monday", icon: "☀️", hi: 74, lo: 58, desc: "Sunny" },
    { day: "Tuesday", icon: "⛅", hi: 69, lo: 55, desc: "Partly Cloudy" },
    { day: "Wednesday", icon: "🌧", hi: 62, lo: 50, desc: "Rain Showers" },
    { day: "Thursday", icon: "⛈", hi: 60, lo: 48, desc: "Thunderstorms" },
    { day: "Friday", icon: "🌤", hi: 68, lo: 52, desc: "Mostly Sunny" },
    { day: "Saturday", icon: "☀️", hi: 75, lo: 57, desc: "Clear and Sunny" },
    { day: "Sunday", icon: "⛅", hi: 71, lo: 54, desc: "Partly Cloudy" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        background: "linear-gradient(180deg,#001060,#0040cc,#6090ff)",
        height: "100%",
        overflowY: "auto",
        fontFamily: "Arial, sans-serif",
        color: "#fff"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 14px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: "bold", marginBottom: 2 }, children: "🌍 Onyx OS 95 Weather" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#aaccff", marginBottom: 12 }, children: [
          "Local Forecast — Updated ",
          (/* @__PURE__ */ new Date()).toLocaleDateString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 2,
              padding: "10px 14px",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 16
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48 }, children: "☀️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, fontWeight: "bold" }, children: "72°F" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13 }, children: "Sunny — Feels like 74°F" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#aaccff" }, children: "Humidity: 45% · Wind: SSW 8 mph · Visibility: 10 mi" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              fontSize: 12,
              fontWeight: "bold",
              marginBottom: 6,
              color: "#aaccff"
            },
            children: "7-DAY FORECAST"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4
            },
            children: days.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "6px 4px",
                  textAlign: "center"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#aaccff", marginBottom: 2 }, children: d.day.slice(0, 3) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22 }, children: d.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, fontWeight: "bold" }, children: [
                    d.hi,
                    "°"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "#aaccff" }, children: [
                    d.lo,
                    "°"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#ccddff" }, children: d.desc })
                ]
              },
              d.day
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 12, fontSize: 10, color: "#88aadd" }, children: "Weather data for Onyx City, OS 95 Metropolitan Area. Forecasts updated daily." })
      ] })
    }
  );
}
function InternalPageRenderer({
  url,
  navigate
}) {
  const [base, hash] = url.replace("internal://", "").split("#");
  if (base === "wikipedia")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(WikipediaPage, { navigate, hash });
  if (base === "news") return /* @__PURE__ */ jsxRuntimeExports.jsx(NewsPage, {});
  if (base === "search") return /* @__PURE__ */ jsxRuntimeExports.jsx(SearchPage, { navigate });
  if (base === "help") return /* @__PURE__ */ jsxRuntimeExports.jsx(HelpPage, {});
  if (base === "weather") return /* @__PURE__ */ jsxRuntimeExports.jsx(WeatherPage, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 20, fontFamily: "Tahoma, sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Page not found:" }),
    " ",
    url
  ] });
}
function titleFor(url) {
  const map = {
    "internal://wikipedia": "OnyxPedia — Free Encyclopedia",
    "internal://news": "The Onyx Daily",
    "internal://search": "Onyx Web Search",
    "internal://help": "Onyx OS 95 Help",
    "internal://weather": "Weather Report",
    home: "Onyx OS 95 Portal"
  };
  return map[url] ?? url;
}
function applyNav(url, history, historyIdx, title) {
  const label = title ?? titleFor(url);
  const newHistory = [
    ...history.slice(0, historyIdx + 1),
    { url, title: label }
  ];
  return { newHistory, newIdx: newHistory.length - 1 };
}
function InternetExplorer() {
  const [addressInput, setAddressInput] = reactExports.useState("home");
  const [history, setHistory] = reactExports.useState([
    { url: HOME_URL, title: "Onyx OS 95 Portal" }
  ]);
  const [historyIdx, setHistoryIdx] = reactExports.useState(0);
  const [iframeUrl, setIframeUrl] = reactExports.useState(null);
  const [showBlocked, setShowBlocked] = reactExports.useState(false);
  const [blockedTarget, setBlockedTarget] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [searchValue, setSearchValue] = reactExports.useState("");
  const [hoveredLink, setHoveredLink] = reactExports.useState(null);
  const iframeRef = reactExports.useRef(null);
  const current = history[historyIdx];
  const showHome = current.url === HOME_URL;
  const showInternal = isInternalUrl(current.url);
  const navigate = (url, title) => {
    const { newHistory, newIdx } = applyNav(url, history, historyIdx, title);
    setHistory(newHistory);
    setHistoryIdx(newIdx);
    setAddressInput(url);
    setShowBlocked(false);
    if (url === HOME_URL || isInternalUrl(url)) {
      setIframeUrl(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setIframeUrl(url);
  };
  const restoreNav = (entry) => {
    setAddressInput(entry.url);
    setShowBlocked(false);
    if (entry.url === HOME_URL || isInternalUrl(entry.url)) {
      setIframeUrl(null);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setIframeUrl(entry.url);
    }
  };
  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      restoreNav(history[idx]);
    }
  };
  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      restoreNav(history[idx]);
    }
  };
  const goHome = () => navigate(HOME_URL, "Onyx OS 95 Portal");
  const handleAddressGo = () => navigate(resolveUrl(addressInput));
  const handleSearch = () => {
    const val = searchValue.trim();
    if (val) {
      navigate("internal://search", "Onyx Web Search");
      setSearchValue("");
    }
  };
  const handleIframeLoad = () => {
    var _a, _b, _c;
    setIsLoading(false);
    try {
      const frameUrl = (_c = (_b = (_a = iframeRef.current) == null ? void 0 : _a.contentWindow) == null ? void 0 : _b.location) == null ? void 0 : _c.href;
      if (frameUrl && frameUrl !== "about:blank") setAddressInput(frameUrl);
    } catch {
    }
  };
  const handleIframeError = () => {
    setIsLoading(false);
    setIframeUrl(null);
    setShowBlocked(true);
    setBlockedTarget(current.url);
  };
  reactExports.useEffect(() => {
    if (!iframeUrl) return;
    const timeout = setTimeout(() => setIsLoading(false), 8e3);
    return () => clearTimeout(timeout);
  }, [iframeUrl]);
  const canBack = historyIdx > 0;
  const canForward = historyIdx < history.length - 1;
  const addressBarDisplay = hoveredLink ?? addressInput;
  const btnStyle = (enabled) => ({
    padding: "2px 8px",
    fontSize: 10,
    fontFamily: "Tahoma, sans-serif",
    cursor: enabled ? "pointer" : "default",
    opacity: enabled ? 1 : 0.45,
    border: "2px solid",
    borderColor: "#ffffff #808080 #808080 #ffffff",
    background: "#c0c0c0",
    userSelect: "none",
    whiteSpace: "nowrap",
    minWidth: 40
  });
  const statusText = isLoading ? `Connecting to: ${iframeUrl}` : showHome ? "Onyx OS 95 Portal — Ready" : showInternal ? `${titleFor(current.url)} — Ready` : showBlocked ? `Cannot display: ${blockedTarget}` : `Done — ${current.url}`;
  const handleRefresh = () => {
    if (showInternal) {
      const u = current.url;
      navigate(HOME_URL);
      setTimeout(() => navigate(u), 30);
    } else if (iframeUrl) {
      setIsLoading(true);
      setIframeUrl(null);
      setTimeout(() => setIframeUrl(iframeUrl), 50);
    } else {
      goHome();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "ie.window",
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#c0c0c0",
        fontFamily: "Tahoma, Verdana, sans-serif"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "3px 4px",
              background: "#c0c0c0",
              borderBottom: "1px solid #808080",
              display: "flex",
              gap: 2,
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "ie.back_button",
                  style: btnStyle(canBack),
                  onClick: goBack,
                  disabled: !canBack,
                  title: "Back",
                  children: "◀ Back"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "ie.forward_button",
                  style: btnStyle(canForward),
                  onClick: goForward,
                  disabled: !canForward,
                  title: "Forward",
                  children: "Fwd ▶"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "ie.stop_button",
                  style: btnStyle(isLoading),
                  onClick: () => setIsLoading(false),
                  title: "Stop",
                  children: "✕ Stop"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "ie.refresh_button",
                  style: btnStyle(true),
                  onClick: handleRefresh,
                  title: "Refresh",
                  children: "↺ Refresh"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "ie.home_button",
                  style: btnStyle(true),
                  onClick: goHome,
                  title: "Home",
                  children: "🏠 Home"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "2px 4px",
              background: "#c0c0c0",
              borderBottom: "2px solid #808080",
              display: "flex",
              gap: 4,
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: 10,
                    fontFamily: "Tahoma, sans-serif",
                    whiteSpace: "nowrap"
                  },
                  children: "Address:"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": "ie.address_input",
                  type: "text",
                  value: addressBarDisplay,
                  onChange: (e) => setAddressInput(e.target.value),
                  onFocus: () => setHoveredLink(null),
                  onKeyDown: (e) => e.key === "Enter" && handleAddressGo(),
                  className: "text-input-95",
                  style: { flex: 1, fontSize: 11 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "ie.go_button",
                  className: "btn-95",
                  onClick: handleAddressGo,
                  style: { fontSize: 10, padding: "2px 10px" },
                  children: "Go"
                }
              )
            ]
          }
        ),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 3, background: "#c0c0c0", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              height: "100%",
              background: "#000080",
              animation: "ie-progress 0.8s linear infinite",
              width: "30%"
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "ie.content_area",
            style: {
              flex: 1,
              overflow: "hidden",
              position: "relative",
              background: "#fff"
            },
            children: [
              showHome && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    height: "100%",
                    overflowY: "auto",
                    background: "#c0c8e8",
                    fontFamily: "Times New Roman, serif",
                    fontSize: 13,
                    color: "#000"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          background: "#000080",
                          color: "#ffff00",
                          padding: "2px 0",
                          fontSize: 11,
                          fontFamily: "Courier New, monospace",
                          overflow: "hidden",
                          whiteSpace: "nowrap"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: {
                              display: "inline-block",
                              animation: "ie-marquee 18s linear infinite"
                            },
                            children: "★ Welcome to Onyx OS 95 — The Future of Personal Computing! ★   Best viewed at 800×600 resolution   ★   Internet Explorer 5.0 Recommended   ★   ★ Welcome to Onyx OS 95 — The Future of Personal Computing! ★"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: "linear-gradient(180deg, #1040c0, #000080)",
                          padding: "6px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                style: {
                                  color: "#fff",
                                  fontSize: 20,
                                  fontFamily: "Arial Black, Arial, sans-serif",
                                  fontWeight: "bold",
                                  textShadow: "2px 2px 0 #000040"
                                },
                                children: "🌐 Onyx OS 95 Portal"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#a0c8ff", fontSize: 10 }, children: "Your Gateway to the World Wide Web" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              style: {
                                color: "#ffcc00",
                                fontSize: 10,
                                fontFamily: "Tahoma, sans-serif"
                              },
                              children: [
                                "📅",
                                " ",
                                (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })
                              ]
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 10px" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            background: "#ffffc0",
                            border: "2px solid #c0a000",
                            padding: "4px 6px",
                            marginBottom: 8,
                            fontSize: 12,
                            fontFamily: "Tahoma, sans-serif"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "⚡ Click a link below to browse!" }),
                            " Pages load right here inside the window."
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 6,
                            marginBottom: 10
                          },
                          children: QUICK_LINKS.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              "data-ocid": `ie.quick_link.${link.label.toLowerCase()}`,
                              style: {
                                background: "#fff",
                                border: "2px solid #8090cc",
                                padding: "6px 8px",
                                cursor: "pointer",
                                textAlign: "center",
                                fontFamily: "Tahoma, sans-serif"
                              },
                              onClick: () => navigate(link.url, link.label),
                              onMouseEnter: () => setHoveredLink(link.url),
                              onMouseLeave: () => setHoveredLink(null),
                              title: link.url,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22 }, children: link.icon }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      color: "#000080",
                                      fontWeight: "bold",
                                      textDecoration: "underline",
                                      fontSize: 11
                                    },
                                    children: link.label
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 9, marginTop: 2 }, children: link.desc })
                              ]
                            },
                            link.url
                          ))
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            background: "#fff",
                            border: "2px solid #8090cc",
                            padding: "6px 8px",
                            marginBottom: 8,
                            fontFamily: "Tahoma, sans-serif",
                            fontSize: 11
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                style: {
                                  fontWeight: "bold",
                                  color: "#000080",
                                  marginBottom: 4
                                },
                                children: "🔍 Search the Web"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 4 }, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  "data-ocid": "ie.search_input",
                                  type: "text",
                                  className: "text-input-95",
                                  placeholder: "Type to search...",
                                  style: { flex: 1, fontSize: 11 },
                                  value: searchValue,
                                  onChange: (e) => setSearchValue(e.target.value),
                                  onKeyDown: (e) => e.key === "Enter" && handleSearch()
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  "data-ocid": "ie.search_button",
                                  className: "btn-95",
                                  style: { fontSize: 10, padding: "2px 8px" },
                                  onClick: handleSearch,
                                  children: "Search"
                                }
                              )
                            ] })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            background: "#000080",
                            color: "#fff",
                            padding: "6px 8px",
                            fontFamily: "Tahoma, sans-serif",
                            fontSize: 11,
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: "/assets/generated/ie-logo-transparent.dim_48x48.png",
                                alt: "Onyx OS 95",
                                style: { width: 28, height: 28, imageRendering: "pixelated" },
                                onError: (e) => {
                                  e.target.style.display = "none";
                                }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: "Onyx OS 95 Internet Explorer" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aabbff", fontSize: 10 }, children: "Built-in pages: Wikipedia · News · Search · Help · Weather" })
                            ] })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "ie.promo_button",
                          style: {
                            marginTop: 8,
                            background: "linear-gradient(90deg, #ff6600, #ffcc00)",
                            border: "3px solid #cc4400",
                            padding: "4px 10px",
                            textAlign: "center",
                            fontFamily: "Arial Black, sans-serif",
                            fontWeight: "bold",
                            fontSize: 12,
                            color: "#000",
                            cursor: "pointer",
                            animation: "ie-flash 1.2s step-start infinite",
                            width: "100%",
                            display: "block"
                          },
                          onClick: () => navigate("internal://search", "Onyx Web Search"),
                          children: "🎉 YOU ARE THE 1,000,000th VISITOR! Click to claim your FREE prize! 🎉"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: "#000080",
                          color: "#8899cc",
                          fontSize: 9,
                          fontFamily: "Tahoma, sans-serif",
                          padding: "3px 8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: "/assets/generated/ie-logo-transparent.dim_48x48.png",
                                alt: "Onyx OS 95",
                                style: { width: 16, height: 16, imageRendering: "pixelated" },
                                onError: (e) => {
                                  e.target.style.display = "none";
                                }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontSize: 9 }, children: "Onyx OS 95" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "© ",
                            (/* @__PURE__ */ new Date()).getFullYear(),
                            " Onyx OS 95 Portal — All Rights Reserved"
                          ] })
                        ]
                      }
                    )
                  ]
                }
              ),
              showInternal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(InternalPageRenderer, { url: current.url, navigate }) }),
              showBlocked && !showHome && !showInternal && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    background: "#c0c8e8",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Times New Roman, serif",
                    gap: 16
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        background: "#c0c0c0",
                        border: "3px solid",
                        borderColor: "#ffffff #808080 #808080 #ffffff",
                        padding: "20px 30px",
                        maxWidth: 420,
                        width: "90%"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            style: {
                              background: "linear-gradient(90deg, #000080, #1060c0)",
                              color: "#fff",
                              fontFamily: "Tahoma, sans-serif",
                              fontSize: 11,
                              fontWeight: "bold",
                              padding: "3px 6px",
                              marginBottom: 14,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginLeft: -30,
                              marginRight: -30,
                              marginTop: -20
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14 }, children: "🌐" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Internet Explorer — Cannot Display Page" })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: { fontSize: 20, marginBottom: 8, textAlign: "center" },
                            children: "⚠️"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              fontFamily: "Tahoma, sans-serif",
                              fontSize: 13,
                              fontWeight: "bold",
                              marginBottom: 8,
                              color: "#000080"
                            },
                            children: "The page cannot be displayed"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              fontFamily: "Tahoma, sans-serif",
                              fontSize: 11,
                              color: "#333",
                              marginBottom: 10,
                              lineHeight: 1.5
                            },
                            children: "The page you are looking for is currently unavailable. The website might be experiencing technical difficulties, or you may need to adjust your browser settings."
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            style: {
                              background: "#fffff0",
                              border: "1px solid #aaa",
                              padding: "6px 8px",
                              fontSize: 10,
                              fontFamily: "Tahoma, sans-serif",
                              color: "#555",
                              marginBottom: 12,
                              wordBreak: "break-all"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "URL:" }),
                              " ",
                              blockedTarget
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            style: {
                              fontFamily: "Tahoma, sans-serif",
                              fontSize: 11,
                              marginBottom: 8
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Please try the following:" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "ul",
                                {
                                  style: {
                                    margin: "4px 0 0 16px",
                                    padding: 0,
                                    fontSize: 10,
                                    color: "#333"
                                  },
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Click the ↺ Refresh button, or try again later." }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "This site may not allow embedding in other windows." }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                                      "Try using the built-in",
                                      " ",
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          onClick: () => navigate("internal://search"),
                                          style: {
                                            ...aStyle,
                                            background: "none",
                                            border: "none",
                                            padding: 0,
                                            fontSize: 10
                                          },
                                          children: "Onyx Search"
                                        }
                                      ),
                                      " ",
                                      "instead."
                                    ] })
                                  ]
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            style: {
                              display: "flex",
                              gap: 8,
                              justifyContent: "center",
                              marginTop: 12,
                              flexWrap: "wrap"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  "data-ocid": "ie.blocked_home_button",
                                  className: "btn-95",
                                  style: { fontSize: 11, padding: "3px 16px" },
                                  onClick: goHome,
                                  children: "🏠 Home"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  "data-ocid": "ie.blocked_back_button",
                                  className: "btn-95",
                                  style: { fontSize: 11, padding: "3px 16px" },
                                  onClick: goBack,
                                  disabled: !canBack,
                                  children: "◀ Back"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "a",
                                {
                                  "data-ocid": "ie.open_in_new_tab_link",
                                  href: blockedTarget,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  style: {
                                    fontSize: 11,
                                    padding: "3px 12px",
                                    border: "2px solid",
                                    borderColor: "#ffffff #808080 #808080 #ffffff",
                                    background: "#c0c0c0",
                                    color: "#000080",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    fontFamily: "Tahoma, sans-serif"
                                  },
                                  children: "Open in new tab ↗"
                                }
                              )
                            ]
                          }
                        )
                      ]
                    }
                  )
                }
              ),
              iframeUrl && !showHome && !showInternal && !showBlocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "iframe",
                {
                  ref: iframeRef,
                  src: iframeUrl,
                  title: "Internet Explorer Content",
                  onLoad: handleIframeLoad,
                  onError: handleIframeError,
                  style: {
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block"
                  },
                  sandbox: "allow-scripts allow-forms allow-same-origin"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              height: 18,
              background: "#c0c0c0",
              borderTop: "1px solid #808080",
              display: "flex",
              alignItems: "center",
              padding: "0 4px",
              fontSize: 10,
              fontFamily: "Tahoma, sans-serif",
              gap: 6
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  children: statusText
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    borderLeft: "1px solid #808080",
                    paddingLeft: 6,
                    color: isLoading ? "#000080" : "#008000",
                    whiteSpace: "nowrap"
                  },
                  children: isLoading ? "Connecting..." : "✓ Internet zone"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes ie-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes ie-flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes ie-progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
      ` })
      ]
    }
  );
}
export {
  InternetExplorer
};
