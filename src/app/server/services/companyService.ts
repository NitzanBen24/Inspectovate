import { getCachedCompanyInfo } from "../lib/cache/companyInfoCache";

// services/companyService.ts
export async function fetchCompanyForms(companyId: number) {
    return await getCachedCompanyInfo(companyId);
}