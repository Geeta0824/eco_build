import React, {useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {IPDFPhotoMstModel} from '../../../models/master-page/IPDFPhotoMstModel'
import {Link, useHistory} from 'react-router-dom'

type props = {
  data: IPDFPhotoMstModel
  handleShowImage1: (id: string) => void
  handleShowImage2: (id: string) => void
  handleShowImage3: (id: string) => void
  handleShowImage4: (id: string) => void
  handleShowPage2Image: (id: string) => void
  handleShowPage3OptionalImage: (id: string) => void
  handleShowPage4OptionalImage: (id: string) => void
  handleShow: (id: number) => void
  name: string
}

const PDFPhotoMasterCard: React.FC<props> = ({
  data,
  handleShowImage1,
  handleShowImage2,
  handleShowImage3,
  handleShowImage4,
  handleShowPage2Image,
  handleShowPage3OptionalImage,
  handleShowPage4OptionalImage,
  handleShow,
  name,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  // const navigate = useNavigate()
  const history = useHistory()

  const handleRowClick = () => {
    history.push(`/master/pdf-photo-mst/edit/${data.pdfPhotoID}`, {
      state: {searchText: name},
    })
  }

  return (
    <tr
      key={data.pdfPhotoID}
      className='cursor-pointer'
      onClick={handleRowClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title='Click to edit'
    >
      <td className='text-dark text-hover-primary fs-6'>{data.quotationCategoryName}</td>
      <td className='text-dark text-hover-primary fs-6'>
        {data.quotationCategoryID === 1 ? (
          <div>{data.projectTypeName}</div>
        ) : (
          <div className='text-dark text-hover-primary fs-6'>N.A</div>
        )}
      </td>

      {/* Images */}
      {[
        data.photo1Path,
        data.page2PhotoPath,
        data.page3_OptionalPath,
        data.page4_OptionalPath,
        data.photo2Path,
        data.photo3Path,
      ].map((path, i) => (
        <td key={i}>
          <div className='d-flex align-items-center gap-2'>
            <div
              className='symbol symbol-45px me-5'
              onClick={(e) => {
                e.stopPropagation() // prevent row click
                const showFunctions = [
                  handleShowImage1,
                  handleShowPage2Image,
                  handleShowPage3OptionalImage,
                  handleShowPage4OptionalImage,
                  handleShowImage2,
                  handleShowImage3,
                ]
                showFunctions[i](path)
              }}
            >
              <img
                src={
                  path
                    ? process.env.REACT_APP_API_URL + path
                    : toAbsoluteUrl('/media/img/NoProductImage.png')
                }
                alt=''
              />
            </div>
          </div>
        </td>
      ))}

      {/* Last image with delete icon */}
      <td>
        <div className='position-relative d-flex align-items-center' style={{paddingRight: '30px'}}>
          <div
            className='symbol symbol-45px me-3'
            onClick={(e) => {
              e.stopPropagation() // prevent row click
              handleShowImage4(data.photo4Path)
            }}
          >
            <img
              src={
                data.photo4Path
                  ? process.env.REACT_APP_API_URL + data.photo4Path
                  : toAbsoluteUrl('/media/img/NoProductImage.png')
              }
              alt=''
            />
          </div>

          {isHovered && (
            <div
              className='position-absolute d-flex flex-column align-items-end p-2'
              style={{right: '5px'}}
            >
              {' '}
              <Link
                to={{
                  pathname: `/master/pdf-photo-mst/edit/${data.pdfPhotoID}`,
                  state: {searchText: name},
                }}
                title='Click to edit'
                className='btn btn-icon btn-sm me-1 pt-5 ps-2'
                style={{transform: 'translateY(-5px)'}}
              >
                <KTSVG
                  path='/media/icons/duotune/art/art005.svg'
                  className='svg-icon-3 svg-icon-primary'
                />
              </Link>
              <div
                onClick={(e) => {
                  e.stopPropagation() // prevent row click
                  handleShow(data.pdfPhotoID)
                }}
                title='Click to delete'
                className='btn btn-icon btn-sm pb-2'
                style={{transform: 'translateY(-1px)'}}
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen027.svg'
                  className='svg-icon-2 svg-icon-danger'
                />
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

export {PDFPhotoMasterCard}
