import { facillties } from "@/app/utils/AppContent";
import { Manufacture, Technicians } from "@/app/utils/types/entities";
import { OptionsMap } from "@/app/utils/types/formTypes";

//todo use this in server
export const getOptionsMap = (technicians: Technicians[], manufactures: Manufacture[], provider: string | boolean): OptionsMap => ({
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