import React, {useState} from 'react'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankData from '../../common-pages/BlankData'
import {IStagePhotoModel} from '../../../models/projects-page/IStageInfoModel'
import {ModalPopUpImageView_Only} from '../../common-pages/ModalPopUpImageView_Only'

type Props = {
  data: IStagePhotoModel[]
  loading: boolean
}

interface IBHK {
  loading: boolean
  imageShow: string
}

const PhotoInfoList: React.FC<Props> = ({data, loading}) => {
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
          <h2 className='m-0 fw-bold'>Photo List</h2>
        </div>

        {/* Table Section */}
        <div className='table-responsive mt-4'>
          {/* Begin::Table */}
          <table className='table table-bordered align-middle g-2'>
            <thead className='bg-light-primary'>
              <tr className='fw-bolder fs-5'>
                <th className='w-100px'>SR No.</th>
                <th className='w-200px'>Photo Title</th>
                <th className='w-100px'>Photo</th>
              </tr>
            </thead>
            <tbody className="border-bottom">
              <LoaderInTable loading={loading} column={15} />
              {data.length > 0 &&
                data.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>{index + 1}</span>
                    </td>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>{item.photoTitle}</span>
                    </td>
                    <td>
                      <div
                        className='symbol symbol-45px me-5 cursor-pointer'
                        onClick={() => handleShowFlag(item.photoPath)}
                      >
                        {item.photoPath !== '' ? (
                          <img
                            src={process.env.REACT_APP_API_URL + item.photoPath}
                            alt={item.photoTitle}
                          />
                        ) : (
                          <img
                            src={toAbsoluteUrl('/media/img/NoProductImage.png')}
                            alt='No image'
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              <BlankData length={data.length} loading={loading} colSpan={5} />
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Image Modal ==================== */}
      <ModalPopUpImageView_Only
        title={'Stage Information Photo'}
        imageShow={state.imageShow}
        show={showFlag}
        isPdf={false}
        handleClose={handleCloseFlag}
      />
    </>
  )
}

export default PhotoInfoList
