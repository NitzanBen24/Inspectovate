import { useContext } from "react";
import { ManufactureContext } from "../contexts/ManufacturesContext";

export const useManufacture = () => {
    const context =  useContext(ManufactureContext);

    if (context === undefined) {
        throw new Error('useManufacture must be used within a UserProvider');
      }
      
      return context;
}