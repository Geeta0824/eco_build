import React, {useState} from 'react'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankData from '../../common-pages/BlankData'
import {IStageRemarksModel} from '../../../models/projects-page/IStageInfoModel'

type Props = {
  data: IStageRemarksModel[]
  loading: boolean
}

interface IBHK {
  loading: boolean
  imageShow: string
}

const RemarksList: React.FC<Props> = ({data, loading}) => {
  const [state, setState] = useState<IBHK>({
    loading: false,
    imageShow: '',
  })

  return (
    <>
      <div className='card shadow-lg rounded-3 p-4 mb-4'>
        {/* Title Section */}
        <div className='bg-primary text-white text-center py-3 rounded-2 mb-4'>
          <h2 className='m-0 fw-bold'>Remark List</h2>
        </div>

        {/* Table Section */}
        <div className='table-responsive mt-4'>
          {/* Begin::Table */}
          <table className='table table-bordered align-middle g-2'>
            <thead className='bg-light-primary'>
              <tr className='fw-bolder fs-5'>
                <th className='w-100px'>SR No.</th>
                <th className='w-300px'>Remarks</th>
              </tr>
            </thead>
            <tbody className="border-bottom">
              {/* Loader */}
              <LoaderInTable loading={loading} column={2} />

              {/* Remarks Data */}
              {data.length > 0 &&
                data.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>{index + 1}</span>
                    </td>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>{item.remarks}</span>
                    </td>
                  </tr>
                ))}

              {/* No Data Placeholder */}
              <BlankData length={data.length} loading={loading} colSpan={2} />
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default RemarksList
