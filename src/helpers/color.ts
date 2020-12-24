const COLORS = ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]
let colorDict: {[node:string]:string} = {}

const setNodeColor = (nodeTypes: string[])=>{
    colorDict = {}
    nodeTypes.forEach((nodeType, idx)=>{
        if (idx>COLORS.length-1){
            idx = idx% (COLORS.length-1)
        }
        colorDict[nodeType] = COLORS[idx]
    })
}

const getNodeColor = (nodeType:string)=>{
    if (colorDict[nodeType]===undefined){
        colorDict[nodeType] = COLORS[Object.keys(colorDict).length]
    }

    return colorDict[nodeType]
}

export {setNodeColor, getNodeColor}