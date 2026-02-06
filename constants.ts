import { Team, Era } from './types';

export const DASHBOARD_IMAGE_URL = "https://fal.media/files/rabbit/9q4v2x5z1a1s1d1f1g1h_a_high_tech_sci_fi_control_panel_dashboard_with_glowing_screens_di.png";

export const INITIAL_TEAMS: Team[] = [
  { id: 't1', name: 'Alpha Chronos', color: '#ef4444', accessCode: '1001', score: 0, fragments: [], completedChallengeIds: [], lastActivityTimestamp: 0 },
  { id: 't2', name: 'Beta Paradox', color: '#3b82f6', accessCode: '2002', score: 0, fragments: [], completedChallengeIds: [], lastActivityTimestamp: 0 },
  { id: 't3', name: 'Gamma Vortex', color: '#22c55e', accessCode: '3003', score: 0, fragments: [], completedChallengeIds: [], lastActivityTimestamp: 0 },
  { id: 't4', name: 'Delta Rift', color: '#eab308', accessCode: '4004', score: 0, fragments: [], completedChallengeIds: [], lastActivityTimestamp: 0 },
  { id: 't5', name: 'Epsilon Void', color: '#a855f7', accessCode: '5005', score: 0, fragments: [], completedChallengeIds: [], lastActivityTimestamp: 0 },
  { id: 't6', name: 'Zeta Flux', color: '#f97316', accessCode: '6006', score: 0, fragments: [], completedChallengeIds: [], lastActivityTimestamp: 0 },
];

export const INITIAL_ERAS: Era[] = [
  {
    id: 'era1',
    index: 0,
    title: 'Prehistoric Jungle',
    year: '10,000 BCE',
    theme: 'Survival & Observation',
    introText: 'The dawn of humanity is being rewritten. Predator and prey are swapping roles.',
    imageUrl: 'https://fal.media/files/monkey/hzN8O6Fq4g5g2g5QJ6Q5Z_a_surrealistic_portal_frame_made_of_twisting_ancient_vines_and_mos.png',
    fragmentName: 'Symbol Shard',
    challenges: [
      {
        id: 'c1_1',
        eraId: 'era1',
        type: 'LOGIC',
        title: 'Predator Tracking',
        description: 'Observe the patterns in nature. If the bird chirps three times before the rain, and it chirps once now, what follows?',
        question: 'What is the immediate outcome based on the pattern?',
        options: ['No Rain', 'Heavy Storm', 'Early Sunset', 'Quiet Night'],
        correctAnswer: 'No Rain',
        points: 100,
        hint: 'Fewer chirps mean less severe atmospheric shifts.'
      },
      {
        id: 'c1_2',
        eraId: 'era1',
        type: 'QUIZ',
        title: 'Cave Markings',
        description: 'Decode the early communication symbols.',
        question: 'Which element was most vital for early survival and signal communication?',
        options: ['Fire', 'Gold', 'Iron', 'Salt'],
        correctAnswer: 'Fire',
        points: 150,
        hint: 'It provides heat and light.',
        rewardFragmentId: 'frag_era1'
      }
    ]
  },
  {
    id: 'era2',
    index: 1,
    title: 'Ancient Civilizations',
    year: '2500 BCE',
    theme: 'History & Interpretation',
    introText: 'The Great Pyramids are built of sand, not stone. Knowledge is dissolving.',
    imageUrl: 'https://fal.media/files/koala/l0k9j8h7g6f5d4s3a2q1_a_surrealistic_portal_frame_made_of_ancient_stone_and_gold_carving.png',
    fragmentName: 'Text Fragment',
    challenges: [
      {
        id: 'c2_1',
        eraId: 'era2',
        type: 'LOGIC',
        title: 'Timeline Reconstruction',
        description: 'Knowledge survives when recorded correctly. Order these events from earliest to latest.',
        question: 'A: Bronze Age Start, B: First Writing, C: Pyramid Construction',
        options: ['B, A, C', 'A, B, C', 'C, B, A', 'B, C, A'],
        correctAnswer: 'B, A, C',
        points: 150,
        hint: 'Writing preceded the massive stone monuments.',
        rewardFragmentId: 'frag_era2'
      }
    ]
  },
  {
    id: 'era3',
    index: 2,
    title: 'The Middle Ages',
    year: '1200 AD',
    theme: 'Teamwork & Leadership',
    introText: 'Trust is a forgotten relic. The roundtable is broken.',
    imageUrl: 'https://fal.media/files/penguin/z1x2c3v4b5n6m7l8k9j0_a_surrealistic_portal_frame_made_of_medieval_stone_arch_and_iron_b.png',
    fragmentName: 'Rule Fragment',
    challenges: [
      {
        id: 'c3_1',
        eraId: 'era3',
        type: 'PHYSICAL',
        title: 'The Silent Guard',
        description: 'One team member must guide the others through a task using only hand signals.',
        question: 'Enter the code given by the GM after non-verbal success.',
        correctAnswer: 'CHIVALRY',
        points: 200,
        hint: 'Focus on clear, distinct gestures.',
        rewardFragmentId: 'frag_era3'
      }
    ]
  },
  {
    id: 'era4',
    index: 3,
    title: 'Age of Discovery',
    year: '1500 AD',
    theme: 'Exploration & Navigation',
    introText: 'The stars are moving. Compass needles spin in circles.',
    imageUrl: 'https://fal.media/files/kangaroo/k1j2h3g4f5d6s7a8q9w0_a_surrealistic_portal_frame_made_of_old_wood_and_rope_with_glowing.png',
    fragmentName: 'Map Overlay',
    challenges: [
      {
        id: 'c4_1',
        eraId: 'era4',
        type: 'LOGIC',
        title: 'Celestial Navigator',
        description: 'If the North Star is at 12 o\'clock and you need to head Southeast, what is your bearing?',
        question: 'Choose the correct directional angle.',
        options: ['45°', '90°', '135°', '180°'],
        correctAnswer: '135°',
        points: 150,
        hint: 'Each 90 degrees is a quarter turn clockwise.',
        rewardFragmentId: 'frag_era4'
      }
    ]
  },
  {
    id: 'era5',
    index: 4,
    title: 'Industrial Revolution',
    year: '1850 AD',
    theme: 'Systems & Cause-Effect',
    introText: 'The machines have gained a mind of their own. Coal turns to lead.',
    imageUrl: 'https://fal.media/files/lion/K9XvL5pG1e1y1w1r1t1s_a_heavy_industrial_steampunk_portal_frame_made_of_rusted_iron_gear.png',
    fragmentName: 'Mechanism Code',
    challenges: [
      {
        id: 'c5_1',
        eraId: 'era5',
        type: 'LOGIC',
        title: 'Steam Valve Sequence',
        description: 'Fix the broken process. Valve A triggers B, B triggers C, but C stalls if A is open too long.',
        question: 'What is the optimal sequence to keep the engine running?',
        options: ['A-B-C-Close A', 'A-C-B', 'B-A-C', 'C-B-A'],
        correctAnswer: 'A-B-C-Close A',
        points: 200,
        hint: 'A must be cycled to prevent overflow.',
        rewardFragmentId: 'frag_era5'
      }
    ]
  },
  {
    id: 'era6',
    index: 5,
    title: 'The Modern Era',
    year: '1990 AD',
    theme: 'Media & Memory',
    introText: 'Digital ghosts haunt the airwaves. Information is no longer reliable.',
    imageUrl: 'https://fal.media/files/zebra/p5o9i8u7y6t5r4e3w2q1_a_surrealistic_portal_frame_made_of_fiber_optic_cables_and_circuit.png',
    fragmentName: 'Data Key',
    challenges: [
      {
        id: 'c6_1',
        eraId: 'era6',
        type: 'QUIZ',
        title: 'The Red Herring',
        description: 'In an age of noise, identify the true signal.',
        question: 'Which of these was the first widely used web browser?',
        options: ['Chrome', 'Mosaic', 'Internet Explorer', 'Safari'],
        correctAnswer: 'Mosaic',
        points: 150,
        hint: 'It sounds like a type of tile art.',
        rewardFragmentId: 'frag_era6'
      }
    ]
  },
  {
    id: 'era7',
    index: 6,
    title: 'The Future',
    year: '2150 AD',
    theme: 'Ethics & Choice',
    introText: 'The final barrier. Your decisions now lock the timeline forever.',
    imageUrl: 'https://fal.media/files/panda/p0o9i8u7y6t5r4e3w2q1_a_futuristic_circular_portal_frame_made_of_sleek_white_metal_and_n.png',
    fragmentName: 'Choice Variable',
    challenges: [
      {
        id: 'c7_1',
        eraId: 'era7',
        type: 'LOGIC',
        title: 'The Ethics Processor',
        description: 'An AI must choose between total efficiency or human preservation. Which variable ensures a stable future?',
        question: 'Select the priority variable.',
        options: ['Speed', 'Profit', 'Empathy', 'Control'],
        correctAnswer: 'Empathy',
        points: 500,
        hint: 'The future is built on human values.',
        rewardFragmentId: 'frag_era7'
      }
    ]
  }
];

export const ERA_STYLES: Record<string, any> = {
  era1: { // Prehistoric
    bgClass: "bg-emerald-950",
    overlayClass: "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-green-900/40 via-emerald-950 to-black",
    activeOverlayClass: "bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.2),transparent_70%)]",
    textPrimary: "text-emerald-100",
    textSecondary: "text-emerald-400/60",
    accentColor: "text-emerald-500",
    borderColor: "border-emerald-800",
    cardBg: "bg-emerald-900/60",
    buttonPrimary: "bg-emerald-600 hover:bg-emerald-500 text-emerald-950",
    buttonSecondary: "border border-emerald-800 text-emerald-200 hover:bg-emerald-900/20",
    font: "font-serif"
  },
  era2: { // Ancient
    bgClass: "bg-stone-950",
    overlayClass: "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-900/40 via-stone-950 to-black",
    activeOverlayClass: "bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.2),transparent_70%)]",
    textPrimary: "text-amber-100",
    textSecondary: "text-amber-400/60",
    accentColor: "text-amber-500",
    borderColor: "border-amber-800",
    cardBg: "bg-stone-900/60",
    buttonPrimary: "bg-amber-600 hover:bg-amber-500 text-stone-950",
    buttonSecondary: "border border-amber-800 text-amber-200 hover:bg-amber-900/20",
    font: "font-serif"
  },
  era3: { // Middle Ages
    bgClass: "bg-slate-950",
    overlayClass: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black",
    activeOverlayClass: "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(59,130,246,0.05)_10px,rgba(59,130,246,0.05)_20px)]",
    textPrimary: "text-blue-100",
    textSecondary: "text-blue-400/60",
    accentColor: "text-blue-500",
    borderColor: "border-blue-800",
    cardBg: "bg-slate-900/60",
    buttonPrimary: "bg-blue-700 hover:bg-blue-600 text-white",
    buttonSecondary: "border border-blue-800 text-blue-200 hover:bg-blue-900/20",
    font: "font-serif"
  },
  era4: { // Discovery
    bgClass: "bg-yellow-950",
    overlayClass: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-yellow-950 to-black",
    activeOverlayClass: "bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15),transparent_60%)]",
    textPrimary: "text-yellow-100",
    textSecondary: "text-yellow-400/60",
    accentColor: "text-yellow-400",
    borderColor: "border-yellow-800",
    cardBg: "bg-yellow-900/60",
    buttonPrimary: "bg-yellow-600 hover:bg-yellow-500 text-black",
    buttonSecondary: "border border-yellow-800 text-yellow-300 hover:bg-yellow-900/20",
    font: "font-sans"
  },
  era5: { // Industrial
    bgClass: "bg-neutral-900",
    overlayClass: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-neutral-900 to-black",
    activeOverlayClass: "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(234,88,12,0.05)_10px,rgba(234,88,12,0.05)_20px)]",
    textPrimary: "text-orange-50",
    textSecondary: "text-orange-300/60",
    accentColor: "text-orange-500",
    borderColor: "border-orange-800",
    cardBg: "bg-neutral-800/60",
    buttonPrimary: "bg-orange-700 hover:bg-orange-600 text-white",
    buttonSecondary: "border border-orange-800 text-orange-200 hover:bg-orange-900/20",
    font: "font-mono"
  },
  era6: { // Modern
    bgClass: "bg-cyan-950",
    overlayClass: "bg-[linear-gradient(0deg,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]",
    activeOverlayClass: "bg-[linear-gradient(0deg,transparent_24%,rgba(6,182,212,0.1)_25%,rgba(6,182,212,0.1)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.1)_75%,rgba(6,182,212,0.1)_76%,transparent_77%,transparent)] bg-[length:50px_50px]",
    textPrimary: "text-cyan-400",
    textSecondary: "text-cyan-700",
    accentColor: "text-cyan-500",
    borderColor: "border-cyan-800",
    cardBg: "bg-cyan-950/20",
    buttonPrimary: "bg-cyan-600 hover:bg-cyan-500 text-black",
    buttonSecondary: "border border-cyan-800 text-cyan-400 hover:bg-cyan-900/20",
    font: "font-mono"
  },
  era7: { // Future
    bgClass: "bg-indigo-950",
    overlayClass: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/10 via-indigo-950 to-black",
    activeOverlayClass: "bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.2),transparent_70%)]",
    textPrimary: "text-indigo-100",
    textSecondary: "text-indigo-400/60",
    accentColor: "text-neon-pink",
    borderColor: "border-indigo-800",
    cardBg: "bg-indigo-900/50",
    buttonPrimary: "bg-neon-blue hover:bg-white text-black",
    buttonSecondary: "border border-indigo-800 text-indigo-300 hover:bg-indigo-900/20",
    font: "font-sans"
  }
};