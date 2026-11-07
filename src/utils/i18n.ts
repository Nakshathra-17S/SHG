import { Language } from '../types';

export interface Translations {
  title: string;
  tagline: string;
  verifiedNrlm: string;
  orders: string;
  allocator: string;
  qc: string;
  passbook: string;
  members: string;
  buyerPortal: string;
  newOrder: string;
  fairnessScore: string;
  activeMembers: string;
  onTimeRate: string;
  pendingPayouts: string;
  demoNotice: string;
  unit: string;
  currency: string;
  runAllocation: string;
  exportCsv: string;
  releasePay: string;
  listenVoice: string;
  stopVoice: string;
  buyerName: string;
  product: string;
  totalVolume: string;
  deadlineSla: string;
  artisanRate: string;
  buyerRate: string;
  technicalSpecs: string;
  cancel: string;
  saveOrder: string;
  shareReport: string;
  status: string;
  allocated: string;
  inProgress: string;
  completed: string;
  approved: string;
  reworkNeeded: string;
  scanCamera: string;
  triggerScan: string;
  scanning: string;
  confidence: string;
  seamDeviation: string;
  zeroPenaltyRule: string;
  shgGroup: string;
  regId: string;
  karnatakaStateBadge: string;
}

export const translations: Record<Language, Translations> = {
  kn: {
    title: 'ಎಸ್.ಎಚ್.ಜಿ ಫ್ಲೋ AI',
    tagline: 'ಸಂಜೀವಿನಿ - ಕರ್ನಾಟಕ ರಾಜ್ಯ ಗ್ರಾಮೀಣ ಜೀವನೋಪಾಯ ಅಭಿಯಾನ (KSRLPS)',
    verifiedNrlm: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ · ಸಂಜೀವಿನಿ KSRLPS ಅಧಿಕೃತ ಪೋರ್ಟಲ್',
    orders: 'ಸಗಟು ಆದೇಶಗಳು',
    allocator: 'ಸ್ಮಾರ್ಟ್ ಹಂಚಿಕೆ (CWFA)',
    qc: 'AI ಗುಣಮಟ್ಟ ತಪಾಸಣೆ',
    passbook: 'ಡಿಜಿಟಲ್ ಪಾಸ್‌ಬುಕ್ & DBT',
    members: 'ಮಹಿಳಾ ಸದಸ್ಯೆಯರು',
    buyerPortal: 'ಖರೀದಿದಾರರ ನಂಬಿಕೆ & SLA',
    newOrder: '+ ಹೊಸ ಸಗಟು ಆದೇಶ',
    fairnessScore: 'ಸಮಾನತೆಯ ಸೂಚ್ಯಂಕ (Gini)',
    activeMembers: 'ಕಾರ್ಯನಿರತ ಮಹಿಳೆಯರು',
    onTimeRate: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾದ ಪೂರೈಕೆ',
    pendingPayouts: 'ಪರಿಶೀಲಿಸಿದ ಬಾಕಿ ಕೂಲಿ',
    demoNotice: 'ಪ್ರಗತಿ ಸಂಜೀವಿನಿ ಮಹಿಳಾ ಸಂಘ (ಧಾರವಾಡ & ಇಳಕಲ್ ಕ್ಲಸ್ಟರ್, ನೋಂದಣಿ: KA-DWD-2024-0982)',
    unit: 'ತುಂಡುಗಳು',
    currency: '₹',
    runAllocation: '1-ಕ್ಲಿಕ್ AI ಸಮಾನ ಹಂಚಿಕೆ',
    exportCsv: 'ಕರ್ನಾಟಕ ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕ್ / UPI CSV',
    releasePay: 'ನೇರ ಡಿಬಿಟಿ ಹಣ ವರ್ಗಾವಣೆ',
    listenVoice: 'ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ (ಕನ್ನಡ)',
    stopVoice: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    buyerName: 'ಸರ್ಕಾರಿ / ಕಾರ್ಪೊರೇಟ್ ಖರೀದಿದಾರರು (KHDC/FabIndia)',
    product: 'ಉತ್ಪನ್ನ ಮತ್ತು ಮಾದರಿ',
    totalVolume: 'ಒಟ್ಟು ಪರಿಮಾಣ (ತುಂಡುಗಳು)',
    deadlineSla: 'ವಿತರಣಾ ಗಡುವು (ದಿನಗಳು)',
    artisanRate: 'ಮಹಿಳೆಯರ ತುಂಡು ಕೂಲಿ (₹ / ತುಂಡಿಗೆ)',
    buyerRate: 'ಖರೀದಿದಾರರ ಒಪ್ಪಂದ ದರ (₹ / ತುಂಡಿಗೆ)',
    technicalSpecs: 'ಕಸೂತಿ & ಹೊಲಿಗೆ ಮಾನದಂಡಗಳು',
    cancel: 'ರದ್ದುಮಾಡಿ',
    saveOrder: 'ಆದೇಶ ದಾಖಲಿಸಿ & ಕೋಟಾ ಹಂಚಿ',
    shareReport: 'ಖರೀದಿದಾರರ ಲೈವ್ ಆಡಿಟ್ ಲಿಂಕ್',
    status: 'ಸ್ಥಿತಿ',
    allocated: 'ಹಂಚಲಾಗಿದೆ',
    inProgress: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    approved: 'ಗುಣಮಟ್ಟ ಅಂಗೀಕೃತ',
    reworkNeeded: 'ದೋಷ ತಿದ್ದುಪಡಿ ಅಗತ್ಯ (ಶೂನ್ಯ ದಂಡ)',
    scanCamera: 'ಬಟ್ಟೆ & ಕಸೂತಿ ಕ್ಯಾಮೆರಾ ತಪಾಸಣೆ',
    triggerScan: 'AI ಗುಣಮಟ್ಟ ಸ್ಕ್ಯಾನ್ ನಡೆಸಿ',
    scanning: 'ಇಳಕಲ್ ಬಾರ್ಡರ್ ಮತ್ತು ಕಸೂತಿ ಎಳೆಗಳ ಪರಿಶೀಲನೆ...',
    confidence: 'ನಿಖರತೆಯ ಶೇಕಡಾವಾರು',
    seamDeviation: 'ಹೊಲಿಗೆ ವ್ಯತ್ಯಾಸ (ಅನುಮತಿ ±1.0 ಮಿಮೀ)',
    zeroPenaltyRule: 'ಸಂಜೀವಿನಿ ಶೂನ್ಯ ದಂಡ ಗ್ಯಾರಂಟಿ: ಮೊದಲ ರಿವರ್ಕ್‌ಗೆ ವೇತನ ಕಡಿತವಿಲ್ಲ',
    shgGroup: 'ಪ್ರಗತಿ ಸಂಜೀವಿನಿ ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘ (GPLF ಧಾರವಾಡ)',
    regId: 'KA-DWD-KSRLPS-2024-0982-A',
    karnatakaStateBadge: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ · Sanjeevini KSRLPS',
  },
  en: {
    title: 'SHGFlow AI — Karnataka',
    tagline: 'Sanjeevini - Karnataka State Rural Livelihood Promotion Society (KSRLPS)',
    verifiedNrlm: 'Govt of Karnataka · Sanjeevini KSRLPS Standard',
    orders: 'Bulk Orders',
    allocator: 'Smart Allocator (CWFA)',
    qc: 'AI Vision QC',
    passbook: 'Digital Passbook & DBT',
    members: 'Karnataka Artisans',
    buyerPortal: 'Buyer Trust & SLA',
    newOrder: '+ New Bulk Order',
    fairnessScore: 'Fairness Index (Gini)',
    activeMembers: 'Artisans on Duty',
    onTimeRate: 'On-Time Dispatch SLA',
    pendingPayouts: 'Verified Earnings Payable',
    demoNotice: 'Pragati Sanjeevini SHG (Dharwad & Ilkal Cluster · Reg: KA-DWD-2024-0982)',
    unit: 'pcs',
    currency: '₹',
    runAllocation: 'Run AI 1-Click Auto-Split',
    exportCsv: 'Export Karnataka Gramin / UPI CSV',
    releasePay: 'Instant DBT Transfer',
    listenVoice: 'Listen Aloud (Speech)',
    stopVoice: 'Stop Audio',
    buyerName: 'Institutional Buyer (KHDC / FabIndia / DSERT)',
    product: 'Product & Cluster SKU',
    totalVolume: 'Total Contract Volume (units)',
    deadlineSla: 'Delivery SLA (Days)',
    artisanRate: 'Artisan Piece Rate (₹ / pc)',
    buyerRate: 'Buyer Contract Price (₹ / pc)',
    technicalSpecs: 'Technical Specs & Quality Guidelines',
    cancel: 'Cancel',
    saveOrder: 'Initialize & Distribute Quotas',
    shareReport: 'Share Public Audit Proof',
    status: 'Status',
    allocated: 'Allocated',
    inProgress: 'In Progress',
    completed: 'Completed',
    approved: 'QC Approved',
    reworkNeeded: 'Rework Required',
    scanCamera: 'Garment & Kasuti Optical Inspection',
    triggerScan: 'Trigger AI Inspection Scan',
    scanning: 'Analyzing Ilkal border, seams & tension...',
    confidence: 'Confidence Score',
    seamDeviation: 'Seam Variance (Tolerance ±1.0mm)',
    zeroPenaltyRule: 'Sanjeevini Zero-Deduction First Rework Guarantee Active',
    shgGroup: 'Pragati Sanjeevini Mahila Okkoota (GPLF Dharwad)',
    regId: 'KA-DWD-KSRLPS-2024-0982-A',
    karnatakaStateBadge: 'Govt of Karnataka · Sanjeevini KSRLPS',
  },
  hi: {
    title: 'एसएचजी फ्लो एआई — कर्नाटक',
    tagline: 'संजीवनी - कर्नाटक राज्य ग्रामीण आजीविका संवर्धन संस्था (KSRLPS)',
    verifiedNrlm: 'कर्नाटक सरकार · संजीवनी KSRLPS आधिकारिक पोर्टल',
    orders: 'थोक ऑर्डर',
    allocator: 'स्मार्ट कार्य आवंटन (सीडब्ल्यूएफए)',
    qc: 'एआई दृष्टि गुणवत्ता जांच',
    passbook: 'डिजिटल पासबुक व डीबीटी',
    members: 'कर्नाटक शिल्पी सदस्याएं',
    buyerPortal: 'खरीदार एसएलए व विश्वास',
    newOrder: '+ नया थोक ऑर्डर',
    fairnessScore: 'निष्पक्षता सूचकांक (गिनी)',
    activeMembers: 'कार्यरत सदस्याएं',
    onTimeRate: 'समय पर आपूर्ति एसएलए',
    pendingPayouts: 'सत्यापित देय पारिश्रमिक',
    demoNotice: 'प्रगति संजीवनी महिला संघ (धारवाड़ व इलकल क्लस्टर, पंजी: KA-DWD-2024-0982)',
    unit: 'इकाइयां',
    currency: '₹',
    runAllocation: '1-क्लिक एआई निष्पक्ष आवंटन करें',
    exportCsv: 'कर्नाटक ग्रामीण बैंक / यूपीआई सीएसवी',
    releasePay: 'तत्काल डीबीटी भुगतान',
    listenVoice: 'आवाज़ में सुनें',
    stopVoice: 'आवाज़ बंद करें',
    buyerName: 'संस्थागत खरीदार (केएचडीसी / फैबइंडिया / डीएसईआरटी)',
    product: 'उत्पाद का नाम व क्लस्टर',
    totalVolume: 'कुल उत्पादन संख्या (इकाइयां)',
    deadlineSla: 'अंतिम तिथि सीमा (दिन)',
    artisanRate: 'कारीगर प्रति-नग दर (₹ / इकाई)',
    buyerRate: 'खरीदार अनुबंध दर (₹ / इकाई)',
    technicalSpecs: 'कसूती व सिलाई विनिर्देश निर्देश',
    cancel: 'रद्द करें',
    saveOrder: 'ऑर्डर दर्ज कर कोटा आवंटित करें',
    shareReport: 'खरीदार ऑडिट लिंक साझा करें',
    status: 'स्थिति',
    allocated: 'आवंटित',
    inProgress: 'प्रगति पर',
    completed: 'पूर्ण',
    approved: 'गुणवत्ता स्वीकृत',
    reworkNeeded: 'सुधार अपेक्षित (शून्य दंड)',
    scanCamera: 'इलकल वस्त्र व कसूती ऑप्टिकल जांच',
    triggerScan: 'एआई निरीक्षण शुरू करें',
    scanning: 'सिलाई खिंचाव व इलकल पल्लू विश्लेषण जारी...',
    confidence: 'सटीकता विश्वास',
    seamDeviation: 'सिलाई विचलन (सहनशीलता ±1.0 मिमी)',
    zeroPenaltyRule: 'संजीवनी प्रथम सुधार पर शून्य कटौती गारंटी लागू',
    shgGroup: 'प्रगति संजीवनी महिला संघ (जीपीएलएफ धारवाड़)',
    regId: 'KA-DWD-KSRLPS-2024-0982-A',
    karnatakaStateBadge: 'कर्नाटक सरकार · संजीवनी KSRLPS',
  },
};
