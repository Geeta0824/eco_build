import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GetProjectWise_MaterialInfo_Report = `${BASE_API_URL}/PMCWorkStageStructure/GetProjectWise_MaterialInfo_Report`

export function GetProjectWise_MaterialInfo_ReportAPI(
  projectID: number,
  projectCategoryID: number
) {
  return axios.post(GetProjectWise_MaterialInfo_Report, {projectID, projectCategoryID})
}
