export type ModelType =
  | "Microschool"
  | "Charter"
  | "Private"
  | "Supplemental"
  | "Hybrid"
  | "Homeschool co-op"
  | "For-profit"
  | "Other";

export const SUCCESS_MEASURES = [
  "State assessments",
  "Independent assessments",
  "Grade-level growth",
  "College enrollment",
  "Employment",
  "Credentials",
  "Parent satisfaction",
  "Completion",
  "Other",
] as const;

export type SuccessMeasure = (typeof SUCCESS_MEASURES)[number];

export type Listing = {
  id: string;
  title: string;
  amountSeeking: number;
  amountFunded: number;
  kidsServed: number;
  timeHorizonYears: number;
  timeHorizonMonths: number;
  state: string;
  metro: string;
  description: string;
  modelType: ModelType;
  subjects: string[];
  successMeasures: SuccessMeasure[];
  organization?: string;
  contactEmail?: string;
  successMetric?: string;
};

function monthsFromYears(years: number): number {
  return Math.round(years * 12);
}

export const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Austin STEM Microschool Network Expansion",
    amountSeeking: 2500000,
    amountFunded: 900000,
    kidsServed: 450,
    timeHorizonYears: 3,
    timeHorizonMonths: 36,
    state: "TX",
    metro: "Austin",
    description:
      "Expand a network of small STEM-focused microschools serving middle-school students. Each site runs 40–60 students with project-based learning and real industry mentors. Funds cover two new sites, teacher training, and lab equipment.",
    modelType: "Microschool",
    subjects: ["STEM", "Career pathways"],
    successMeasures: ["Independent assessments"],
    organization: "River City Learning Labs",
    successMetric: "80% of students demonstrate grade-level or above performance on independent math/science assessments by year 2",
  },
  {
    id: "2",
    title: "Phoenix High School Redesign Cohort",
    amountSeeking: 5000000,
    amountFunded: 1800000,
    kidsServed: 1200,
    timeHorizonYears: 4,
    timeHorizonMonths: 48,
    state: "AZ",
    metro: "Phoenix",
    description:
      "Support a cohort of three high schools redesigning the upper secondary experience around mastery, real work, and post-secondary pathways. Includes instructional redesign, teacher residencies, and employer partnerships.",
    modelType: "Charter",
    subjects: ["Career pathways", "Literacy", "STEM"],
    successMeasures: ["College enrollment", "Employment"],
    organization: "Valley Pathways Collaborative",
    successMetric: "65% of graduates enrolled in college, apprenticeship, or living-wage employment within 6 months",
  },
  {
    id: "3",
    title: "Rural Literacy Pods – Appalachia",
    amountSeeking: 750000,
    amountFunded: 220000,
    kidsServed: 1800,
    timeHorizonYears: 2,
    timeHorizonMonths: 24,
    state: "WV",
    metro: "Multi-county",
    description:
      "Launch and sustain after-school and summer literacy pods in five rural counties. Uses structured literacy curriculum with local tutors. Designed for high-dose intervention where traditional options are thin.",
    modelType: "Supplemental",
    subjects: ["Literacy"],
    successMeasures: ["Grade-level growth"],
    organization: "Mountain Literacy Collective",
    successMetric: "Average 1.5 grade-level gains in reading over 18 months for participating students",
  },
  {
    id: "4",
    title: "Dallas Microschool Franchise Seed",
    amountSeeking: 1200000,
    amountFunded: 400000,
    kidsServed: 280,
    timeHorizonYears: 3,
    timeHorizonMonths: 36,
    state: "TX",
    metro: "Dallas–Fort Worth",
    description:
      "Seed capital for a for-profit microschool model that operates at $8–10k per student. Funds three founding sites and a playbook for subsequent independent operators.",
    modelType: "For-profit",
    subjects: ["STEM", "Civics"],
    successMeasures: ["Parent satisfaction", "Other"],
    organization: "North Texas Learning Co.",
    successMetric: "Sites cash-flow positive by month 18; parent NPS > 50",
  },
  {
    id: "5",
    title: "Chicago Career Pathway Academy",
    amountSeeking: 3500000,
    amountFunded: 1100000,
    kidsServed: 600,
    timeHorizonYears: 5,
    timeHorizonMonths: 60,
    state: "IL",
    metro: "Chicago",
    description:
      "Build a full high-school program integrating dual enrollment, paid apprenticeships, and industry credentials in logistics, healthcare, and advanced manufacturing.",
    modelType: "Hybrid",
    subjects: ["Career pathways"],
    successMeasures: ["Credentials", "Employment"],
    organization: "Great Lakes Opportunity Schools",
    successMetric: "70% of seniors hold an industry credential; 50% have paid work experience before graduation",
  },
  {
    id: "6",
    title: "Homeschool Co-op Math Acceleration",
    amountSeeking: 180000,
    amountFunded: 45000,
    kidsServed: 320,
    timeHorizonYears: 2,
    timeHorizonMonths: 24,
    state: "FL",
    metro: "Tampa Bay",
    description:
      "Shared specialist teachers and curriculum for a network of homeschool co-ops focusing on accelerated math. Low overhead; high parent involvement.",
    modelType: "Homeschool co-op",
    subjects: ["STEM"],
    successMeasures: ["Grade-level growth", "Independent assessments"],
    organization: "Bay Area Math Collaborative",
    successMetric: "Students average 1+ grade level gain per academic year on standardized math measures",
  },
  {
    id: "7",
    title: "Nashville Classical Elementary Expansion",
    amountSeeking: 2800000,
    amountFunded: 600000,
    kidsServed: 400,
    timeHorizonYears: 3,
    timeHorizonMonths: 36,
    state: "TN",
    metro: "Nashville",
    description:
      "Open a second classical elementary campus serving a mixed-income population. Strong emphasis on knowledge-rich curriculum, phonics, and character formation.",
    modelType: "Private",
    subjects: ["Literacy", "Civics"],
    successMeasures: ["State assessments"],
    organization: "Cumberland Classical Academy",
    successMetric: "Top-quartile performance on state assessments by year 3 relative to district peers",
  },
  {
    id: "8",
    title: "Online Civics & Debate for Rural Students",
    amountSeeking: 450000,
    amountFunded: 150000,
    kidsServed: 5000,
    timeHorizonYears: 2,
    timeHorizonMonths: 24,
    state: "Multi",
    metro: "National (rural focus)",
    description:
      "Live online civics, debate, and American history courses for students in low-density areas. Combines small-group instruction with asynchronous content.",
    modelType: "Supplemental",
    subjects: ["Civics"],
    successMeasures: ["Completion", "Independent assessments"],
    organization: "Civic Groundwork",
    successMetric: "Completion rate > 75%; measurable gains on civics knowledge assessments",
  },
  {
    id: "9",
    title: "Columbus Civics Microschools",
    amountSeeking: 900000,
    amountFunded: 250000,
    kidsServed: 220,
    timeHorizonYears: 3,
    timeHorizonMonths: 36,
    state: "OH",
    metro: "Columbus",
    description:
      "A cluster of civics-forward microschools teaching American history, debate, and local government through real civic projects.",
    modelType: "Microschool",
    subjects: ["Civics"],
    successMeasures: ["Parent satisfaction", "Other"],
    organization: "Heartland Civic Studio",
    successMetric: "Students complete a public civic project each year; parent satisfaction above 80%",
  },
  {
    id: "10",
    title: "Denver Apprenticeship High School",
    amountSeeking: 4200000,
    amountFunded: 900000,
    kidsServed: 500,
    timeHorizonYears: 4,
    timeHorizonMonths: 48,
    state: "CO",
    metro: "Denver",
    description:
      "New high school pairing half-day academics with paid apprenticeships in healthcare and construction.",
    modelType: "Charter",
    subjects: ["Career pathways", "STEM"],
    successMeasures: ["Employment", "Credentials"],
    organization: "Front Range Works",
    successMetric: "60% of seniors in paid work or credentialed programs before graduation",
  },
  {
    id: "11",
    title: "Atlanta Literacy Tutoring Network",
    amountSeeking: 650000,
    amountFunded: 200000,
    kidsServed: 2400,
    timeHorizonYears: 2,
    timeHorizonMonths: 24,
    state: "GA",
    metro: "Atlanta",
    description:
      "High-dose tutoring pods attached to churches and community centers across metro Atlanta.",
    modelType: "Supplemental",
    subjects: ["Literacy"],
    successMeasures: ["Grade-level growth"],
    organization: "Read Atlanta Now",
    successMetric: "Average one-year reading gain for students below grade level",
  },
  {
    id: "12",
    title: "Bay Area Hybrid Classical Network",
    amountSeeking: 3100000,
    amountFunded: 700000,
    kidsServed: 360,
    timeHorizonYears: 3,
    timeHorizonMonths: 36,
    state: "CA",
    metro: "San Francisco",
    description:
      "Expand hybrid classical campuses combining two days on-site with guided home learning.",
    modelType: "Hybrid",
    subjects: ["Literacy", "Civics"],
    successMeasures: ["State assessments", "Grade-level growth"],
    organization: "Golden Gate Classical",
    successMetric: "Top-quartile literacy growth vs. local district peers",
  },
];

export function costPerKid(listing: Listing): number {
  return Math.round(listing.amountSeeking / listing.kidsServed);
}

export function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export function horizonMonths(listing: Listing): number {
  if (listing.timeHorizonMonths) return listing.timeHorizonMonths;
  return monthsFromYears(listing.timeHorizonYears || 1);
}

export function formatHorizon(listing: Listing): string {
  const months = horizonMonths(listing);
  if (months < 12) return months === 1 ? "1 month" : `${months} months`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return years === 1 ? "1 year" : `${years} years`;
  const yearPart = years === 1 ? "1 year" : `${years} years`;
  const monthPart = rem === 1 ? "1 month" : `${rem} months`;
  return `${yearPart} ${monthPart}`;
}
