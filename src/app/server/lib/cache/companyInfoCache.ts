// lib/cache/companyInfoCache.ts
import { getCompanyInfo } from "../db/dbObject";

const companyCache = new Map<number, any>();

export async function getCachedCompanyInfo(company_id: number) {

    if (companyCache.has(company_id)) return companyCache.get(company_id);
    
    const info = await getCompanyInfo(company_id);
    companyCache.set(company_id, info);
    
    return info;
}
