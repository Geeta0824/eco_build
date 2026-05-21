import React, {useState} from 'react'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankData from '../../common-pages/BlankData'
import {IStageDocumentModel} from '../../../models/projects-page/IStageInfoModel'
import {ModalPopUpImageView_Only} from '../../common-pages/ModalPopUpImageView_Only'

type Props = {
  data: IStageDocumentModel[]
  loading: boolean
}

interface IBHK {
  loading: boolean
  imageShow: string
}

const DocumentInfoList: React.FC<Props> = ({data, loading}) => {
  const pathUrl = process.env.REACT_APP_API_URL
  const [state, setState] = useState<IBHK>({
    loading: false,
    imageShow: '',
  })

  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: pathUrl + selImg, loading: false})
    setShowFlag(true)
  }

  return (
    <>
      <div className='card shadow-lg rounded-3 p-4 mb-4'>
        {/* Title Section */}
        <div className='bg-primary text-white text-center py-3 rounded-2 mb-4'>
          <h2 className='m-0 fw-bold'>Document List</h2>
        </div>

        {/* Table Section */}
        <div className='table-responsive mt-4'>
          <table className='table table-bordered align-middle g-2'>
            <thead className='bg-light-primary'>
              <tr className='fw-bold fs-5'>
                <th className='w-100px'>Sr No.</th>
                <th className='w-200px'>Document Title</th>
                <th className='w-100px'>Document</th>
              </tr>
            </thead>
            <tbody className="border-bottom">
              <LoaderInTable loading={loading} column={15} />
              {data.length > 0 &&
                data.map((doc, index) => (
                  <tr key={index} className='hoverable-row'>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>{index + 1}</span>
                    </td>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>{doc.documentTitle}</span>
                    </td>
                    <td>
                      <div
                        className='symbol symbol-45px me-5 cursor-pointer'
                        onClick={() => handleShowFlag(doc.documentPath)}
                      >
                        <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                      </div>
                    </td>
                  </tr>
                ))}
              <BlankData length={data.length} loading={loading} colSpan={5} />
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== PDF Modal ==================== */}
      <ModalPopUpImageView_Only
        title={'Stage Infomation Document'}
        imageShow={state.imageShow}
        show={showFlag}
        isPdf={true}
        handleClose={handleCloseFlag}
      />
    </>
  )
}

export default DocumentInfoList
