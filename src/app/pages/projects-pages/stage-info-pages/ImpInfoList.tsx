import React from 'react'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankData from '../../common-pages/BlankData'
import {IStageInformationModel} from '../../../models/projects-page/IStageInfoModel'

type Props = {
  data: IStageInformationModel[]
  loading: boolean
}

const ImpInfoList: React.FC<Props> = ({data, loading}) => {
  return (
    <>
      <div className='card shadow-lg rounded-3 p-4 mb-4'>
        {/* Title Section */}
        <div className='bg-primary text-white text-center py-3 rounded-2 mb-4'>
          <h2 className='m-0 fw-bold'>IMP Information List</h2>
        </div>

        {/* Table Section */}
        <div className='table-responsive mt-4'>
          <table className='table table-bordered align-middle g-2'>
            <thead className='bg-light-primary'>
              <tr className='fw-bold fs-6'>
                <th className='w-100px'>Sr No.</th>
                <th className='w-300px'>IMP Information</th>
              </tr>
            </thead>
            <tbody className="border-bottom">
              <LoaderInTable loading={loading} column={2} />
              {data.length > 0 &&
                data.map((data, index) => (
                  <tr key={index} className='hoverable-row'>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>{index + 1}</span>
                    </td>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>
                        {data.impInformation}
                      </span>
                    </td>
                  </tr>
                ))}
              <BlankData length={data.length} loading={loading} colSpan={2} />
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ImpInfoList
