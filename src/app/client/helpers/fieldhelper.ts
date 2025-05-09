import { facillties } from "@/app/utils/AppContent";
import { Manufacture, Technicians } from "@/app/utils/types/entities";
import { OptionKeys, OptionsMap, PdfField } from "@/app/utils/types/formTypes";

//todo use this in server
const _getOptionsMap = (technicians: Technicians[], manufactures: Manufacture[], provider: string | boolean): OptionsMap => ({
    provider: Array.from(new Set(technicians.map((tech) => tech.employer))),
    electrician: technicians
        .filter((tech) => tech.profession === 'electrician' && tech.employer === provider)
        .map((tech) => ({ val: tech.name, id: tech.id })),
    planner: technicians
        .filter((tech) => tech.profession === 'planner' && tech.employer === provider)
        .map((tech) => ({ val: tech.name, id: tech.id })),
    convertor: manufactures
        .filter((item) => item.type === 'convertor' || item.type === 'both')
        .map((item) => item.name),
    panel: manufactures
        .filter((item) => item.type === 'panel' || item.type === 'both')
        .map((item) => item.name),
    facillity: facillties
});


export const getInspectionDropdownOptions = (field: PdfField,technicians: Technicians[], manufactures: Manufacture[], provider: string | boolean) => {
 
    const optionsMap = _getOptionsMap(technicians, manufactures, provider);
    const fieldName = field.name.replace("-ls", "");
    
    return optionsMap[fieldName as OptionKeys];
}