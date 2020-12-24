
import axios from "axios"
import {IEdgeTypes} from 'types'
import {URL} from 'Const'

const axiosInstance = axios.create({
    baseURL: `${URL}/`,
    // timeout: 1000,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});

const requestNodeTypes = (async():Promise<string[]> => {
    const url = './data/node_types.json'
    let response = await axiosInstance.get(url)
    return response.data
})

const requestEdgeTypes = (async():Promise<IEdgeTypes> => {
    const url = './data/edge_types.json'
    let response = await axiosInstance.get(url)
    return response.data
})

const requestMetaPaths = (async() => {
    const url = './data/meta_path_json.json'
    let response = await axiosInstance.get(url)
    return response.data
})

const requestAttention = (async(nodeIDs: (string|undefined)[]) => {

    let results:any = {}
    const url = './data/test_attention.json'
    let response = await axiosInstance.get(url)
    
    nodeIDs.forEach( (nodeID)=>{
        if (nodeID){
            results[nodeID] = response.data[nodeID]
        }
    })
    
    return results
    
})


export {requestNodeTypes, requestEdgeTypes, requestMetaPaths, requestAttention}