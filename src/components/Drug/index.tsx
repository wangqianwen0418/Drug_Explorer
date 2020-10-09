import React, {FC} from "react"
import DrugHeat from './DrugHeat'
import DrugPCP from './DrugPCP'

interface Props{
    drugMode:string,
    height: number,
    width: number,
    offsetX: number,
    selectedDrugID: string,
    selectDrug: (id:string)=>void
}
const Drug : FC<Props>= ({drugMode, height, width, offsetX, selectedDrugID, selectDrug})=>{
    return drugMode==='heat'?
    <DrugHeat height={height} width={width} offsetX={offsetX} selectedDrugID={selectedDrugID} selectDrug={selectDrug} />
    :
    <DrugPCP height={height} width={width} offsetX={offsetX} selectedDrugID={selectedDrugID} selectDrug={selectDrug} />

}

export default Drug