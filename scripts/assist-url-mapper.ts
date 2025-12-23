/**
 * ASSIST.org URL Mapper
 * 
 * ASSIST.org uses different URL formats. This mapper helps convert between
 * our college/university codes and ASSIST.org's URL parameters.
 * 
 * New format: /transfer/results?year=X&institution=Y&agreement=Z&...
 * Old format: /transfer/report/report?institution1=XXX&institution2=YYY&...
 */

// New URL format mappings
// These need to be discovered by inspecting ASSIST.org URLs
interface AssistUrlParams {
  year: number;
  institution: number;
  agreement: number;
  agreementType: 'to' | 'from';
  viewAgreementsOptions?: boolean;
  view: string;
}

// Mapping from our codes to ASSIST.org numeric IDs
// These values need to be discovered by inspecting actual ASSIST.org URLs
const ASSIST_INSTITUTION_IDS: Record<string, number> = {
  // Community Colleges
  BCC: 58,        // Berkeley City College (from URL example)
  COA: 0,         // TODO: Need to discover
  LANEY: 0,       // TODO: Need to discover
  MERRITT: 0,     // TODO: Need to discover
  
  // UC Universities
  UCB: 0,         // UC Berkeley - TODO: Need to discover
  UCLA: 0,
  UCSD: 0,
  UCD: 0,
  UCSB: 0,
  UCI: 0,
  UCSC: 0,
  UCR: 0,
  UCM: 0,
  
  // CSU Universities
  SFSU: 0,
  SJSU: 0,
  CSUEB: 0,
  CSUMB: 0,
  SSU: 0,
};

// Agreement IDs (combination-specific)
// Format: "BCC-UCB" => agreement ID
const ASSIST_AGREEMENT_IDS: Record<string, number> = {
  "BCC-UCB": 79,  // From URL example
  // TODO: Need to discover more
};

// Academic year mappings
const ASSIST_YEARS: Record<string, number> = {
  "2024-2025": 76,  // From URL example
  // TODO: Add more years
};

/**
 * Build new format URL for ASSIST.org
 */
export function buildAssistUrl(
  ccCode: string,
  universityCode: string,
  academicYear: string = "2024-2025"
): string | null {
  const institutionId = ASSIST_INSTITUTION_IDS[ccCode];
  const yearId = ASSIST_YEARS[academicYear];
  const agreementKey = `${ccCode}-${universityCode}`;
  const agreementId = ASSIST_AGREEMENT_IDS[agreementKey];
  
  if (!institutionId || !yearId || !agreementId) {
    return null;
  }
  
  return `https://assist.org/transfer/results?year=${yearId}&institution=${institutionId}&agreement=${agreementId}&agreementType=to&viewAgreementsOptions=true&view=agreement`;
}

/**
 * Parse ASSIST.org URL to extract parameters
 */
export function parseAssistUrl(url: string): AssistUrlParams | null {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    const year = params.get("year");
    const institution = params.get("institution");
    const agreement = params.get("agreement");
    
    if (!year || !institution || !agreement) {
      return null;
    }
    
    return {
      year: parseInt(year, 10),
      institution: parseInt(institution, 10),
      agreement: parseInt(agreement, 10),
      agreementType: (params.get("agreementType") || "to") as "to" | "from",
      viewAgreementsOptions: params.get("viewAgreementsOptions") === "true",
      view: params.get("view") || "agreement",
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get our college code from ASSIST institution ID
 */
export function getCollegeCodeFromId(institutionId: number): string | null {
  for (const [code, id] of Object.entries(ASSIST_INSTITUTION_IDS)) {
    if (id === institutionId) {
      return code;
    }
  }
  return null;
}

/**
 * Helper to extract codes from URL (for browser console script)
 */
export function extractCodesFromUrl(url: string): {
  collegeCode: string | null;
  universityCode: string | null;
  year: number | null;
  agreementId: number | null;
} {
  const params = parseAssistUrl(url);
  
  if (!params) {
    return {
      collegeCode: null,
      universityCode: null,
      year: null,
      agreementId: null,
    };
  }
  
  const collegeCode = getCollegeCodeFromId(params.institution);
  
  // For university code, we'd need reverse mapping of agreement IDs
  // This is complex - better to extract from page or URL structure
  
  return {
    collegeCode,
    universityCode: null, // Need to discover mapping
    year: params.year,
    agreementId: params.agreement,
  };
}














