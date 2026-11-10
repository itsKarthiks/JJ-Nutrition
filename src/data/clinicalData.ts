export interface ClinicalService {
  id: string;
  number: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  expectedOutcomes: string[];
  therapeuticSynergists: string[];
  clinicalFocus: string;
  idealFor: string;
  image?: string;
}

export interface ConsultationTier {
  id: string;
  name: string;
  badge?: string;
  duration: string;
  priceAUD: number;
  priceUSD: number;
  subtitle: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface PatientReview {
  id: string;
  patientName: string;
  location: string;
  date: string;
  serviceFocus: string;
  rating: number;
  quoteTitle: string;
  reviewText: string;
  practitionerNote: string;
}

export interface ClinicalArticle {
  id: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  author: string;
  authorRole: string;
  content: string[];
  keyTakeaways: string[];
}

export const PRACTITIONER_SELVI = {
  name: 'Selvi',
  title: 'Clinical Nutritionist & Supplement Specialist',
  credentials: 'RDN, AHPRA / Professional Clinical Reg.',
  experienceYears: '12+',
  consultationsDelivered: '2,800+',
  satisfactionRate: '98%',
  telehealthReach: 'Worldwide (Australia, USA, UK, NZ)',
  philosophyHeadline: 'Compassionate, Science-Driven Nutrition Rooted in Cellular Biochemistry',
  philosophyQuote:
    "My mission at JJ Nutrition is straightforward: to cut through contradictory internet trends, marketing hype, and generic diet dogma. Your body's biochemical pathways are as unique as your fingerprint. Whether you are dealing with chronic iron deficiency, an agonizing stomach ulcer, elevated cardiovascular markers, or debilitating fatigue, we look at where your cellular physiology is struggling and provide the exact cofactors required to heal.",
  zeroAIPromise:
    'At JJ Nutrition, you are never evaluated by an automated algorithm or AI chatbot. Every clinical protocol, dietary suggestion, and supplement dosage is personally authored and supervised by Selvi.',
  pillars: [
    {
      num: '01',
      title: 'Biochemical Individuality',
      desc: 'We examine unique nutrient pathways, gut microbiome balance, methylation cofactors, and genetic predispositions—never generic one-size-fits-all meal plans.',
    },
    {
      num: '02',
      title: 'Targeted Nutraceuticals',
      desc: 'Only therapeutic, pharmaceutical-grade supplements with verified bioavailability (true chelates, active coenzymes, standardized bio-actives).',
    },
    {
      num: '03',
      title: 'Food-as-Medicine Core',
      desc: 'Targeted nutraceuticals act as the acute catalyst, while therapeutic culinary foods anchor lifelong cellular vitality and metabolic resilience.',
    },
    {
      num: '04',
      title: 'Medication Safety Screening',
      desc: 'Every single nutrient recommendation is cross-checked against prescription medications (statins, SSRIs, blood thinners, PPIs) to ensure absolute safety.',
    },
  ],
};

export const CLINICAL_SERVICES: ClinicalService[] = [
  {
    id: 'cardiovascular-combo',
    number: '01',
    category: 'Cardiovascular',
    title: 'Heart Health Combo',
    tagline: 'Cardiovascular wellness, lipid panel optimization, arterial elasticity, and targeted CoQ10/omega-3 clinical support.',
    description:
      'A targeted clinical protocol evaluating endothelial nitric oxide synthesis, lipid subfraction ratios, and myocardial mitochondrial bioenergetics to support systemic vascular health.',
    expectedOutcomes: [
      'Improvement in endothelial function and peripheral vascular circulation',
      'Targeted support for balanced HDL/LDL particle ratios and triglyceride management',
      'Enhanced cellular ATP energy synthesis for cardiac tissue',
    ],
    therapeuticSynergists: [
      'Ubiquinol (Coenzyme Q10 - active reduced bioavailable form)',
      'Molecularly distilled Omega-3 EPA/DHA (high-potency clinical ratio)',
      'Magnesium Taurate & Vitamin K2 (MK-7) for arterial calcium regulation',
    ],
    clinicalFocus: 'Vascular elasticity, triglyceride stabilization, and myocardial cellular vitality.',
    idealFor: 'Individuals with elevated blood pressure, lipid dysregulation, statin-induced CoQ10 depletion, or family cardiac risk.',
  },
  {
    id: 'detox-weight-loss',
    number: '02',
    category: 'Metabolic & Detox',
    title: 'Detox and Weight Loss',
    tagline: 'Metabolic reset focusing on Phase I & II liver clearance, insulin sensitivity, and lean tissue preservation.',
    description:
      'Grounded in clinical hepatology and endocrinology, this protocol supports hepatic biotransformation pathways while correcting cellular insulin resistance for lasting metabolic balance.',
    expectedOutcomes: [
      'Sustainable reduction in stubborn visceral and abdominal adipose tissue',
      'Resolution of post-meal lethargy and hormonal blood sugar crashes',
      'Enhanced hepatic detoxification clearance and bile acid flow',
    ],
    therapeuticSynergists: [
      'N-Acetyl L-Cysteine (NAC) and Milk Thistle (standardized 80% silymarin)',
      'Alpha Lipoic Acid (R-ALA) for cellular insulin receptor sensitivity',
      'Methylated B-vitamins & Choline for hepatic transsulfuration pathways',
    ],
    clinicalFocus: 'Phase I/II liver clearance, insulin receptor sensitivity, and sustainable metabolic reset.',
    idealFor: 'Patients experiencing metabolic plateau, fatty liver markers, midsection weight gain, or postprandial fatigue.',
  },
  {
    id: 'bone-health',
    number: '03',
    category: 'Structural',
    title: 'Bone Health',
    tagline: 'Micro-crystalline osteo-density matrix, Calcium-D3-K2 synergy, collagen synthesis, and fracture risk mitigation.',
    description:
      'Moves beyond crude calcium carbonate supplements by supplying the exact biochemical cofactors required to transport calcium into osseous skeletal matrix rather than arterial soft tissue.',
    expectedOutcomes: [
      'Support for bone mineral density (BMD) scores and skeletal structural integrity',
      'Safeguarding against ectopic calcium deposition in soft tissues and arteries',
      'Optimized osteoblast mineral uptake and bone collagen matrix cross-linking',
    ],
    therapeuticSynergists: [
      'Microcrystalline Hydroxyapatite Calcium (MCHC) or Algae-sourced Calcium',
      'Vitamin D3 (Cholecalciferol) paired with Vitamin K2 (MK-7)',
      'Boron, Zinc, and Silica for collagen scaffold synthesis',
    ],
    clinicalFocus: 'Bone mineral density, osteoclast-osteoblast regulation, and arterial calcium protection.',
    idealFor: 'Post-menopausal women, osteopenia/osteoporosis diagnosis, and individuals requiring targeted fracture prevention.',
  },
  {
    id: 'energy-enhancement',
    number: '04',
    category: 'Cellular Energy',
    title: 'Energy Enhancement',
    tagline: 'Mitochondrial biogenesis, cellular ATP synthesis, adrenal support, and overcoming chronic daily exhaustion.',
    description:
      'Directly intervenes at the electron transport chain level to restore mitochondrial oxidative phosphorylation and clear metabolic blockages causing persistent fatigue.',
    expectedOutcomes: [
      'Consistent morning-to-evening vitality without reliance on stimulants or sugar',
      'Accelerated cognitive clarity and elimination of afternoon brain fog',
      'Restored cellular ATP production and stamina for physical movement',
    ],
    therapeuticSynergists: [
      'Acetyl-L-Carnitine & CoQ10 Ubiquinol for mitochondrial membrane transport',
      'Full Active Methylated B-Complex (Methylfolate, Methyl-B12, P-5-P)',
      'D-Ribose & Magnesium Malate for rapid cellular adenylate recharge',
    ],
    clinicalFocus: 'Mitochondrial biogenesis, ATP recycling, and adrenal-cortisol equilibrium.',
    idealFor: 'Chronic daily fatigue, post-viral burnout, high-stress executives, and midday mental exhaustion.',
  },
  {
    id: 'insomnia-support',
    number: '05',
    category: 'Neurological & Sleep',
    title: 'Insomnia Support',
    tagline: 'Circadian rhythm resynchronization, GABA/melatonin precursor nutrition, and restorative deep-sleep architecture.',
    description:
      'Clinical nutrition focused on central nervous system down-regulation, nocturnal cortisol blunting, and neurochemical precursors needed for continuous, unfragmented delta sleep.',
    expectedOutcomes: [
      'Rapid, gentle sleep onset without restless bedtime rumination',
      'Deep, continuous sleep cycles with reduced 2-3 AM awakenings',
      'Waking refreshed with restored morning mental sharpness and balanced mood',
    ],
    therapeuticSynergists: [
      'Magnesium L-Threonate & Magnesium Bisglycinate (blood-brain barrier active)',
      'L-Theanine (suntheanine grade) & Tart Cherry (phytomelatonin source)',
      'Phosphatidylserine for blunting elevated nocturnal cortisol surges',
    ],
    clinicalFocus: 'Circadian phase alignment, GABAergic neurotransmission, and delta sleep architecture.',
    idealFor: 'Individuals with bedtime sleep onset delay, chronic middle-of-the-night waking, or shift-work circadian strain.',
  },
  {
    id: 'anxiety-support',
    number: '06',
    category: 'Neurological & Sleep',
    title: 'Anxiety Support',
    tagline: 'Gut-brain axis modulation, nervous system nourishment, adaptogenic herbal therapy, and stress hormone balancing.',
    description:
      'Restores the biological equilibrium between excitatory glutamate and inhibitory GABA neurotransmitters while nurturing the vagus nerve and adrenal stress axis.',
    expectedOutcomes: [
      'Noticeable reduction in acute physical stress tension and internal trembling',
      'Smoothed emotional resilience and enhanced capacity to handle daily stressors',
      'Stable vagal tone and reduction in nervous stomach or palpitations',
    ],
    therapeuticSynergists: [
      'L-Theanine (clinical dosing for calm alpha-brainwave alertness)',
      'Ashwagandha KSM-66 & Holy Basil for neuroendocrine adrenal stabilization',
      'Active Pyridoxal-5-Phosphate (P-5-P) & Taurine for GABA synthesis',
    ],
    clinicalFocus: 'Glutamate-to-GABA balance, enteric nervous system calming, and HPA axis regulation.',
    idealFor: 'People facing persistent nervous tension, overwhelm, racing thoughts, or stress-induced gut disturbances.',
  },
  {
    id: 'ulcer-healing',
    number: '07',
    category: 'Gastrointestinal',
    title: 'Ulcer Management & Healing Support',
    tagline: 'Mucosal barrier restoration, H. pylori-supportive nutrition, demulcent botanicals, and stomach lining repair.',
    description:
      'A targeted gastrointestinal protocol promoting epithelial restitution of gastric and duodenal mucosa while soothing inflammatory digestive irritation.',
    expectedOutcomes: [
      'Alleviation of sharp post-meal burning and epigastric discomfort',
      'Direct structural reinforcement of the stomach mucosal mucous barrier',
      'Soothing of esophageal and duodenal tissues with balanced digestive secretions',
    ],
    therapeuticSynergists: [
      'Zinc L-Carnosine (clinically proven gastric mucosal healing agent)',
      'Deglycyrrhizinated Licorice (DGL) chewables for mucosal stimulation',
      'L-Glutamine & Marshmallow Root (Althaea officinalis) for epithelial repair',
    ],
    clinicalFocus: 'Gastric mucosal cytoprotection, epithelial turnover, and acid-barrier soothing.',
    idealFor: 'Individuals recovering from stomach/duodenal ulcers, chronic gastritis, or long-term antacid use.',
  },
  {
    id: 'alcohol-weaning',
    number: '08',
    category: 'Recovery & Support',
    title: 'Alcohol Weaning Support',
    tagline: 'Neurochemical stabilization, liver regeneration, glutathione repletion, and mitigating physiological alcohol cravings.',
    description:
      'Provides biological nutritional support during alcohol reduction or weaning, replenishing depleted micronutrients and stabilizing neurotransmitters to alleviate physical cravings.',
    expectedOutcomes: [
      'Substantial reduction in physical cravings through blood sugar & dopamine support',
      'Rapid replenishment of depleted neurological vitamins (Thiamine B1, Folate, B12)',
      'Protection of hepatic cells and upregulation of endogenous glutathione',
    ],
    therapeuticSynergists: [
      'High-potency Benfotiamine (fat-soluble Thiamine B1) & Methylated B-Complex',
      'N-Acetyl Cysteine (NAC) and S-Adenosylmethionine (SAMe) for liver glutathione',
      'L-Glutamine & Kudzu extract for curbing sudden physiological alcohol urges',
    ],
    clinicalFocus: 'Neuro-nutritional repletion, hepatic detoxification, and physiological craving suppression.',
    idealFor: 'Individuals actively reducing or stopping alcohol consumption seeking clinical biochemical support.',
  },
  {
    id: 'iron-deficiency',
    number: '09',
    category: 'Haematology',
    title: 'Iron Deficiency / Anaemia',
    tagline: 'Non-constipating bioavailable iron protocols, ferritin pool replenishment, and absorption cofactor pairing.',
    description:
      'Solves the chronic failure of conventional iron tablets by utilizing gentle chelated iron forms paired with molecular transport cofactors for deep cellular ferritin replenishment without gastric pain.',
    expectedOutcomes: [
      'Steady, documented elevation of serum ferritin reserves and hemoglobin levels',
      'Complete elimination of common iron supplement side effects (constipation & nausea)',
      'Reversal of exertional breathlessness, pale pallor, and chronic weakness',
    ],
    therapeuticSynergists: [
      'Iron Bisglycinate Chelate (gentle, high-absorption Ferrochel® grade)',
      'Apolactoferrin (iron-transport glycoprotein improving cellular bioavailability)',
      'Vitamin C with Citrus Bioflavonoids & Active Methylfolate for erythropoiesis',
    ],
    clinicalFocus: 'Ferritin pool repletion, non-constipating absorption, and red blood cell maturation.',
    idealFor: 'Women with heavy cycles, stubborn low ferritin, athletes, and anyone intolerant to standard pharmacy iron pills.',
  },
  {
    id: 'prostate-health',
    number: '10',
    category: 'Endocrine & Men',
    title: 'Prostate Health',
    tagline: 'Cellular PSA support, zinc homeostasis, saw palmetto/lycopene synergy, and urinary stream comfort.',
    description:
      'Evidence-based nutritional protocol targeting 5-alpha-reductase inhibition, healthy cellular prostate proliferation, and smooth bladder emptying comfort in men.',
    expectedOutcomes: [
      'Significant reduction in nighttime urinary frequency (nocturia) and sleep disruption',
      'Enhanced urinary flow rate, bladder emptying comfort, and pelvic ease',
      'Protection against oxidative cellular damage in prostate tissue',
    ],
    therapeuticSynergists: [
      'Standardized Saw Palmetto Berry extract (85-95% fatty acids and sterols)',
      'High-potency Beta-Sitosterol (pure plant phytosterols)',
      'Zinc Picolinate paired with Tomato Lycopene & Selenium for glandular health',
    ],
    clinicalFocus: '5-AR enzyme modulation, urinary flow comfort, and prostate tissue micro-nutrition.',
    idealFor: 'Men over 40 experiencing nocturnal bathroom trips, weak urinary flow, or seeking preventive prostate care.',
  },
];

export const CONSULTATION_TIERS: ConsultationTier[] = [
  {
    id: 'quick-consult',
    name: 'Quick Consultation',
    duration: '10 Minutes',
    priceAUD: 5,
    priceUSD: 5,
    subtitle: 'Rapid Clinical Check-in & Urgent Guidance',
    description:
      'Designed for existing patients or individuals needing immediate targeted feedback on specific supplements, dosage adjustments, or quick lab clarifications.',
    features: [
      '10-minute 1-on-1 direct telehealth video or phone consultation with Selvi',
      'Immediate verbal review of 1-2 specific supplements or questions',
      'Clear dosage and timing adjustment instructions',
      'Follow-up summary email with concise clinical notes',
      'Direct practitioner access with zero chatbot middlemen',
    ],
  },
  {
    id: 'standard-consult',
    name: 'Standard Consultation',
    badge: 'MOST POPULAR',
    duration: '45 Minutes',
    priceAUD: 75,
    priceUSD: 75,
    subtitle: 'Comprehensive Nutritional & Condition Assessment',
    description:
      'Our foundational clinical consultation. A complete evaluation of your health history, symptoms, diet, and lab reports with a customized nutrition and supplement protocol.',
    features: [
      '45-minute comprehensive telehealth clinical assessment with Selvi',
      'Thorough analysis of current diet, symptoms, and existing bloodwork/labs',
      'Customized Condition-Focused Food-as-Medicine nutrition roadmap',
      'Targeted pharmaceutical-grade supplement protocol with exact dosing and brands',
      'PDF Clinical Summary & Supplement Protocol Guide provided within 24 hours',
      '14 days of direct email follow-up support for protocol clarification',
    ],
    isPopular: true,
  },
  {
    id: 'extended-consult',
    name: 'Extended Consultation',
    badge: 'IN-DEPTH CLINICAL FOCUS',
    duration: '1 Hour 15 Minutes',
    priceAUD: 150,
    priceUSD: 150,
    subtitle: 'Multi-Condition Deep Dive & Full Biological Roadmap',
    description:
      'An exhaustive clinical deep-dive for individuals with complex, chronic, or multiple overlapping health challenges, long-term medication interactions, or extensive lab histories.',
    features: [
      '75-minute exhaustive clinical consultation with Selvi',
      'Multi-system root-cause mapping (gut-brain, endocrine, metabolic, cardiovascular)',
      'Detailed review of extensive historical lab panels, imaging, or genetic markers',
      'Complete phase-by-phase nutrition transformation and meal sequencing guide',
      'Advanced clinical supplement regimen with therapeutic synergy and timing schedule',
      'Comprehensive Written Clinical Action Report (6-8 pages)',
      '30 days of prioritized follow-up email support and 1 complimentary check-in',
    ],
  },
];

export const PATIENT_REVIEWS: PatientReview[] = [
  {
    id: 'asha-r',
    patientName: 'Asha R.',
    location: 'Melbourne, Australia',
    date: 'March 14, 2026',
    serviceFocus: 'Energy Enhancement & Gut Recovery',
    rating: 5,
    quoteTitle: 'Transformed my daily energy within four weeks!',
    reviewText:
      'I had been struggling with chronic fatigue and stubborn digestive issues for nearly two years. Doctors told me my blood tests were "normal", but I could barely make it through the workday. Selvi took the time to truly listen and examine my symptoms clinically. Her targeted protocol and supplement adjustments completely transformed my daily energy within four weeks. I finally feel like myself again. Selvi\'s depth of knowledge is unmatched!',
    practitionerNote:
      'Asha was a pleasure to support. By addressing cellular mitochondrial cofactors and restoring her mucosal lining, her body naturally regained metabolic stamina.',
  },
  {
    id: 'david-k',
    patientName: 'David K.',
    location: 'Sydney, Australia',
    date: 'February 28, 2026',
    serviceFocus: 'Heart Health Combo',
    rating: 5,
    quoteTitle: 'Triglycerides dropped and my cardiologist was impressed',
    reviewText:
      'After my routine physical showed elevated triglycerides and arterial stiffness markers, I booked a Standard Consultation with Selvi. Her explanation of CoQ10 ubiquinol and specific EPA/DHA ratios was eye-opening. Three months on her protocol and my follow-up blood lipid panel showed a dramatic improvement. No side effects, just pure clinical nutrition that works.',
    practitionerNote:
      'David followed his cardiovascular cofactor protocol with exemplary discipline. The reduction in lipid peroxidative stress speaks for itself.',
  },
  {
    id: 'elena-m',
    patientName: 'Elena M.',
    location: 'California, USA',
    date: 'January 19, 2026',
    serviceFocus: 'Iron Deficiency / Anaemia',
    rating: 5,
    quoteTitle: 'Finally an iron protocol that didn\'t hurt my stomach',
    reviewText:
      'Standard pharmacy iron tablets caused me severe constipation and cramps for years, yet my ferritin remained stuck at 14. Selvi introduced me to iron bisglycinate chelate with apolactoferrin and absorption timing adjustments. In just 8 weeks, my ferritin reached 58 and I can hike up hills without feeling out of breath. Cannot recommend JJ Nutrition enough!',
    practitionerNote:
      'Elena is living proof that nutrient form matters just as much as dosage. Chelated bisglycinate bypassed her mucosal barrier irritation safely.',
  },
  {
    id: 'marcus-t',
    patientName: 'Marcus T.',
    location: 'Auckland, New Zealand',
    date: 'December 12, 2025',
    serviceFocus: 'Ulcer Management & Healing Support',
    rating: 5,
    quoteTitle: 'Relief from relentless stomach burning in 3 weeks',
    reviewText:
      'Dealing with a duodenal ulcer and gastritis was agonizing. Selvi\'s targeted zinc carnosine, DGL, and soothing meal sequencing allowed my stomach lining to finally heal. The burning pain subsided within weeks. Her compassionate approach made all the difference.',
    practitionerNote:
      'Targeted epithelial mucosal healing cofactors provide the restorative biological environment stomach lining cells need to regenerate.',
  },
  {
    id: 'sarah-l',
    patientName: 'Sarah L.',
    location: 'London, UK',
    date: 'November 22, 2025',
    serviceFocus: 'Insomnia Support',
    rating: 5,
    quoteTitle: 'Sleeping 7.5 hours uninterrupted for the first time in years',
    reviewText:
      'I used to wake up every night between 2 and 3 AM with racing thoughts. The Quick Consultation first gave me immediate dosage shifts, followed by a Standard Consult where Selvi rebuilt my circadian neurotransmitters with magnesium threonate and phytomelatonin precursors. I am sleeping soundly and waking clear-headed.',
    practitionerNote:
      'Resynchronizing Sarah\'s neurochemical GABA pathway and blunting nocturnal cortisol was the biological key to deep delta sleep architecture.',
  },
  {
    id: 'robert-p',
    patientName: 'Robert P.',
    location: 'Texas, USA',
    date: 'October 30, 2025',
    serviceFocus: 'Prostate Health',
    rating: 5,
    quoteTitle: 'Nighttime bathroom trips reduced from 4 times to 1',
    reviewText:
      'At 54, waking up 4 times every night was ruining my work life. Selvi\'s prostate protocol with standardized saw palmetto, beta-sitosterol, and bioavailable zinc worked wonders within 6 weeks. Selvi is respectful, methodical, and deeply knowledgeable.',
    practitionerNote:
      'Saw palmetto sterols paired with targeted zinc micro-nutrition directly stabilized Robert\'s glandular pelvic comfort.',
  },
];

export const CLINICAL_ARTICLES: ClinicalArticle[] = [
  {
    id: 'gut-brain-axis-anxiety',
    category: 'Neurological Health',
    title: 'The Gut-Brain Axis in Anxiety: Evidence-Based Nutritional Protocols',
    date: 'February 18, 2026',
    readTime: '6 min read',
    summary:
      'Explore how enteric neurotransmitter synthesis, vagal nerve communication, and microbiome integrity dictate central nervous calm and panic susceptibility.',
    author: 'Selvi',
    authorRole: 'Clinical Nutritionist & Supplement Specialist',
    content: [
      'Over 90% of the body’s serotonin and a substantial fraction of circulating GABA are synthesized within the gastrointestinal tract. When intestinal mucosal integrity is degraded or dysbiosis prevails, inflammatory cytokines cross the gut-vascular barrier and activate microglial neuroinflammation in the brain.',
      'Clinical nutrition addresses anxiety not as a purely psychological phenomenon, but as a biological dialogue between the microbiome, the vagus nerve, and neuro-endocrine receptors. By providing therapeutic cofactors—such as active Pyridoxal-5-Phosphate, suntheanine-grade L-Theanine, and gut-soothing adaptogens—we can restore parasympathetic tone and alleviate autonomic nervous trembling.',
      'Practical dietary intervention begins with eliminating hidden excitoneurotoxins and stabilizing glycemic peaks that trigger emergency epinephrine surges. Food is the foundation upon which nervous system resilience is permanently rebuilt.',
    ],
    keyTakeaways: [
      'Enteric serotonin and GABA synthesis depend directly on mucosal gut integrity.',
      'Microbiome dysbiosis stimulates vagal neuroinflammatory signaling.',
      'L-Theanine and active P-5-P cofactors safely up-regulate calming alpha brainwaves.',
    ],
  },
  {
    id: 'restoring-ferritin-iron-protocols',
    category: 'Haematology & Energy',
    title: 'Restoring Ferritin: Why Traditional Iron Pills Fail & How Bioavailable Protocols Work',
    date: 'January 24, 2026',
    readTime: '7 min read',
    summary:
      'Why standard ferrous sulfate causes severe gastric distress, and how chelated bisglycinate with apolactoferrin optimizes deep cellular iron storage.',
    author: 'Selvi',
    authorRole: 'Clinical Nutritionist & Supplement Specialist',
    content: [
      'Millions of individuals are prescribed harsh ferrous sulfate tablets, only to experience unbearable constipation, dark stool, and nausea, while their serum ferritin remains stubbornly below 20 ng/mL. Traditional inorganic iron salts trigger hydroxyl free-radical cascades in the gut lumen, causing inflammation and triggering the liver to secrete hepcidin.',
      'Hepcidin actively blocks iron absorption channels in the duodenum. As a result, increasing the dose of standard iron only increases gastrointestinal misery rather than resolving the deficiency.',
      'True clinical resolution requires gentle amino-acid chelates (such as Iron Bisglycinate Ferrochel®) that pass intact through the stomach without oxidizing. Pairing this with apolactoferrin—an iron-binding glycoprotein—directs iron safely into marrow receptor sites while bypassing bacterial feeding pathways in the colon.',
    ],
    keyTakeaways: [
      'Inorganic iron salts trigger hepcidin elevation, which shuts down intestinal iron uptake.',
      'Chelated iron bisglycinate eliminates constipation and gastric nausea.',
      'Apolactoferrin maximizes intracellular transport into deep ferritin stores.',
    ],
  },
  {
    id: 'cardiovascular-longevity-coq10',
    category: 'Cardiovascular Health',
    title: 'Cardiovascular Longevity: The Synergy Between CoQ10, Omega-3s, and Arterial Elasticity',
    date: 'December 15, 2025',
    readTime: '8 min read',
    summary:
      'A clinical exploration of endothelial nitric oxide synthase, lipid particle peroxidation, and mitochondrial cardioprotection.',
    author: 'Selvi',
    authorRole: 'Clinical Nutritionist & Supplement Specialist',
    content: [
      'Arterial stiffness is not an inevitable consequence of aging; it is an active biochemical process driven by endothelial glycoxidation and depleted mitochondrial energy in vascular smooth muscle cells.',
      'Ubiquinol—the active, reduced electron-donor form of Coenzyme Q10—is crucial for preventing the oxidation of circulating LDL particles. Oxidized LDL, not native cholesterol, is what initiates macrophage foam-cell cascade in vascular linings.',
      'When high-potency molecularly distilled EPA and DHA fatty acids are administered alongside Ubiquinol and Vitamin K2 (MK-7), endothelial nitric oxide synthase is stimulated, restoring arterial compliance and healthy blood flow dynamics.',
    ],
    keyTakeaways: [
      'Lipid peroxidation, rather than raw cholesterol number, triggers vascular inflammation.',
      'Ubiquinol provides critical electron donation to prevent arterial plaque formation.',
      'Vitamin K2 ensures calcium is directed into bones rather than arterial walls.',
    ],
  },
  {
    id: 'mucosal-barrier-restoration-ulcers',
    category: 'Gastrointestinal Care',
    title: 'Mucosal Barrier Restoration: Clinical Protocols for Ulcers and Gastric Healing',
    date: 'November 08, 2025',
    readTime: '6 min read',
    summary:
      'How zinc-carnosine, demulcent herbs, and anti-inflammatory meal pacing allow damaged stomach epithelial tissue to regenerate.',
    author: 'Selvi',
    authorRole: 'Clinical Nutritionist & Supplement Specialist',
    content: [
      'The gastric mucosal barrier is one of the most rapidly regenerating tissues in the human body, replacing its entire cellular lining every 3 to 5 days under healthy physiological conditions. However, chronic stress, NSAID usage, and H. pylori colonization impair this natural restitution cycle.',
      'Zinc L-Carnosine is a unique chelate molecule that adheres directly to inflammatory ulcer lesions, resisting breakdown by gastric stomach acid. It stimulates local heat-shock proteins (HSP70) and insulin-like growth factors to accelerate epithelial repair.',
      'When combined with Deglycyrrhizinated Licorice (DGL) chewables taken before meals, the natural mucus-secreting goblet cells are activated, providing a physical protective barrier against hydrochloric acid while the deeper submucosa heals.',
    ],
    keyTakeaways: [
      'Zinc L-Carnosine adheres directly to damaged gastric lesions to trigger cellular repair.',
      'DGL stimulates natural goblet cell mucus secretion without raising blood pressure.',
      'Gentle dietary pacing and avoiding thermal/acidic triggers protects newly formed tissue.',
    ],
  },
];

export const AUTHENTIC_PARTNERS = [
  { name: 'Australian Natural Therapists Association', src: '/partners/trimmed/anta.png' },
  { name: 'Complementary Medicine Association', src: '/partners/trimmed/cma.png' },
  { name: 'Metagenics Clinical Range', src: '/partners/trimmed/metagenics.png' },
  { name: 'BioCeuticals Practitioner Support', src: '/partners/trimmed/bioceuticals.png' },
  { name: 'Orthoplex Clinical Research', src: '/partners/trimmed/orthoplex.png' },
  { name: 'Nutrition Care Pharmaceuticals', src: '/partners/trimmed/nutrition-care.png' },
  { name: 'Eagle Natural Health', src: '/partners/trimmed/eagle.png' },
  { name: 'MediHerb Herbal Formulations', src: '/partners/trimmed/mediherb.png' },
  { name: 'Designs for Health Science', src: '/partners/trimmed/designs-for-health.png' },
  { name: 'RN Labs Functional Medicine', src: '/partners/trimmed/rn-labs.png' },
  { name: 'Flordis Integrative Health', src: '/partners/trimmed/flordis.png' },
];

