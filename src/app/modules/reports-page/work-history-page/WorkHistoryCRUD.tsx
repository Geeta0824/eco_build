import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

//=====================Customer URL======================
export const GET_WORK_HISTORY_LIST = `${BASE_API_URL}/AddonItemMst/GetWorkHistoryList`


// *************************===========list================*******************************************
export function getWorkHistoryList() {
  return axios.get(GET_WORK_HISTORY_LIST)
}
