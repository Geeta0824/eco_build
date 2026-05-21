import {FC} from 'react'
import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {UserModel} from '../../../modules/auth/models/UserModel'
import React from 'react'
type Props = {
  user: UserModel
  data: IProjectModel
  badgeColor: string
  badgeColor2: string
  statusColor: string
  progress: number
  handleQuotation: (_id: string) => void
  downloadPojectFile: (_id: string) => void
  handleShowStage: (_id: number, _id2: number, name: string, name1: string) => void
  handleShowDesign: (_id: number, _id2: number, name: string, name1: string) => void
  handleShow: (_id: number) => void
  handleShowProjectDetails: (_id: number) => void
  selProjectID: number
  handleshowChange: (_id: number) => void
  handleShowEmpMap: (EmpMapData: IProjectModel) => void
  handleShowDesignerRemarkMap: (id: number, societyName: string) => void
  name: string
}
// const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
const ProjectCard: FC<Props> = ({
  user,
  data,
  badgeColor,
  badgeColor2,
  statusColor,
  progress,
  handleQuotation,
  downloadPojectFile,
  handleShowStage,
  handleShowDesign,
  handleShow,
  handleShowProjectDetails,
  selProjectID,
  handleshowChange,
  handleShowEmpMap,
  handleShowDesignerRemarkMap,
  name,
}) => {
  return (
    <>
      <span className='card border border-2 border-primary border-hover'>
        <div className='card-body p-5'>
          <div className='d-flex'>
            <div className='w-100'>
              <div className='flex-grow-1 card'>
                <div className='d-flex flex-column'>
                  <div className='me-2'>
                    <span
                      className='text-dark cursor-pointer text-hover-primary fw-bolder fs-3'
                      onClick={() => handleShowProjectDetails(data.projectID)}
                    >
                      {data.projectName}
                    </span>
                  </div>
                  <div
                    className={
                      user.roleID === 2 || user.roleID === 3 || user.designationID === 4
                        ? 'fw-bolder text-info d-flex'
                        : 'd-none'
                    }
                  >
                    <p className='text-info fs-6 text-center me-3 pt-1 align-self-center'>
                      Final Amount : &nbsp;&nbsp;&nbsp;₹ {data.finalAmount}
                    </p>
                  </div>
                </div>
              </div>

              <div className='d-flex justify-content-between align-items-center mb-3'>
                <div className='border border-gray-300 border-dashed rounded min-w-125px py-2 px-4'>
                  <div className='fs-6 text-primary fw-bolder'>
                    {data.firstName + ' ' + data.lastName}
                  </div>
                  <div className='fw-bold text-gray-400'>{data.mobileNumber}</div>
                </div>
                <div className='card-toolbar mb-3 me-4 mx-1'>
                  <span className={`badge badge-light-${badgeColor} fw-bolder me-auto p-2 mt-1`}>
                    {data.projectCategoryName}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={
                user.roleID === 2 || user.roleID === 3
                  ? 'flex-shrink-1 d-flex flex-column'
                  : 'd-none'
              }
            >
              {/* -------------------------- Edit ---------------------------- */}
              <Link
                to={{
                  pathname: `/projects/project/edit/${data.projectID}/edit`,
                  state: {
                    projName: data.projectName,
                    projectCategoryID: data.projectCategoryID,
                    customerName: data.firstName + ' ' + data.lastName,
                    projectCategoryName: data.projectCategoryName,
                    projectID: data.projectID,
                    projectAmount: data.projectAmount,
                    finalAmount: data.finalAmount,
                    additionalAmount: data.additionalAmount,
                    reductionAmount: data.reductionAmount,
                    searchText: name,
                  },
                }}
                className='btn btn-icon btn-bg-light bg-hover-primaryMain text-hover-inverse-primaryMain btn-sm mb-2 pulse2-grow-on-hover'
                data-bs-toggle='tooltip'
                title='Edit'
              >
                <KTSVG
                  path='/media/icons/duotune/art/art005.svg'
                  className='svg-icon-3 svg-icon-primaryMain'
                />
                {/* <span className='pulse-ring'></span> */}
              </Link>
              {/* -------------------------- Delete ---------------------------- */}
              <span
                onClick={() => handleShow(data.projectID)}
                data-bs-toggle='tooltip'
                title='Delete'
                className='btn btn-icon btn-bg-light pulse2-grow-on-hover bg-hover-danger text-hover-inverse-danger btn-sm mb-2'
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen027.svg'
                  className='svg-icon-3 svg-icon-danger'
                />
                {/* <span className='pulse-ring'></span> */}
              </span>
            </div>
          </div>
          <div className='row g-0 mb-3'>
            <div className='col mr-8'>
              <div className='d-flex align-items-center'>
                <div className='fs-6 text-info fw-bolder'>{data.projectType}</div>
              </div>
            </div>
            <div className='col'>
              <div className='fs-6 text-warning fw-bolder'>
                {data.bhkName}({data.carpetArea})
              </div>
            </div>
          </div>
          <div
            className={
              user.roleID === 2 || user.roleID === 3 || user.designationID === 4
                ? 'row g-0 mb-3'
                : 'd-none'
            }
          >
            <div className='col mr-8'>
              <div className='fs-7 text-muted fw-bold'>Project Amount</div>
              <div className='d-flex align-items-center'>
                <div className='fs-6 fw-bold text-primaryMain'>₹ {data.projectAmount}</div>
              </div>
            </div>
            <div className='col'>
              <div className='fs-7 text-muted fw-bold'>
                Addon<span style={{color: '#800000'}}> | Reduction</span> Amt
              </div>
              <div className='fs-6 fw-bold' style={{color: '#e95800'}}>
                ₹ {data.additionalAmount}
                <span style={{color: '#800000'}}> | {data.reductionAmount}</span>
              </div>
            </div>
          </div>
          <div
            className={
              user.roleID === 2 || user.roleID === 3 || user.designationID === 4
                ? 'row g-0 mb-3'
                : 'd-none'
            }
          >
            <div className='col mr-8'>
              <div className='fs-7 text-muted fw-bold'>Paid Amount</div>
              <div className='d-flex align-items-center'>
                <div className='fs-6 fw-bold text-success'>₹ {data.paidAmount}</div>
              </div>
            </div>
            <div className='col'>
              <div className='fs-7 text-muted fw-bold'>Remaining Amount</div>
              <div className='fs-6 fw-bold text-danger'>₹ {data.remainingAmount}</div>
            </div>
          </div>
          <span
            className={`d-flex justify-content-between align-items-center g-3`}
            // style={{overflowWrap: 'break-word'}}
            // onClick={() => handleshowChange(selProjectID)}
          >
            <span
              className={`bg-light-${badgeColor2} rounded p-3 mx-1 mb-3 text-${badgeColor2} text-hover-primary cursor-pointer border `}
              style={{overflowWrap: 'break-word'}}
              onClick={() => handleshowChange(selProjectID)}
            >
              {data.projectStatusName}
            </span>
            <span
              className={
                user.roleID === 2 || user.designationID === 4 || user.designationID === 1008
                  ? 'btn btn-icon btn-bg-light pulse2-grow-on-hover mb-3 text-info bg-hover-info text-hover-inverse-info btn-sm me-2'
                  : 'd-none'
              }
              title='Employee Map'
              onClick={() => handleShowEmpMap(data)}
            >
              <span className='fa fa-users fa-2x'></span>
            </span>
            {/* <span
              className={
                user.roleID === 2 || user.roleID === 3
                  ? 'btn btn-icon btn-bg-light bg-hover-primaryMain mb-3 text-hover-inverse-primaryMain btn-sm text-primaryMain me-2 pulse2-grow-on-hover'
                  : 'd-none'
              }
              data-bs-toggle='tooltip'
              title='Photos'
              // onClick={() => handleQuotation(data.quetFilePath)}
            >
              <KTSVG
                path='/media/icons/duotune/general/gen006.svg'
                className='svg-icon-1 svg-icon-primaryMain'
              />
            </span> */}

            {/* ========================== Proj Album =========================== */}
            <Link
              to={{
                pathname: `/projects/project/album/list`,
                state: {
                  projName: data.projectName,
                  projectID: data.projectID,
                  customerName: data.firstName + ' ' + data.lastName,
                  searchText: name,
                },
              }}
              className={
                user.roleID === 2 || user.roleID === 5 || user.designationID === 4
                  ? 'btn btn-icon btn-bg-light bg-hover-primaryMain mb-3 text-hover-inverse-primaryMain btn-sm text-primaryMain me-2 pulse2-grow-on-hover'
                  : 'd-none'
              }
              data-bs-toggle='tooltip'
              title='Photos'
              // onClick={() => handleQuotation(data.quetFilePath)}
            >
              <KTSVG
                path='/media/icons/duotune/general/gen006.svg'
                className='svg-icon-1 svg-icon-primaryMain'
              />
            </Link>
            {/* =================== Proj Document ========= */}
            <Link
              to={{
                pathname: `/projects/project/proj-document/list`,
                state: {
                  projName: data.projectName,
                  projectID: data.projectID,
                  customerName: data.firstName + ' ' + data.lastName,
                  searchText: name,
                },
              }}
              className={
                user.roleID === 2 || user.roleID === 5 || user.designationID === 4
                  ? 'btn btn-icon btn-bg-light bg-hover-success mb-3 text-hover-inverse-success btn-sm text-success me-2 pulse2-grow-on-hover'
                  : 'd-none'
              }
              data-bs-toggle='tooltip'
              title='Document'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen005.svg'
                className='svg-icon-1 svg-icon-success'
              />
            </Link>
            <span
              onClick={() => handleShowDesignerRemarkMap(data.projectID, data.projectName)}
              className={
                user.roleID === 2 || user.roleID === 6
                  ? //|| user.designationID === 4
                    'btn btn-icon btn-bg-light bg-hover-success mb-3 text-hover-inverse-success btn-sm text-success me-2 pulse2-grow-on-hover'
                  : 'd-none'
              }
              data-bs-toggle='tooltip'
              title='Designer Remarks'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen057.svg'
                className='svg-icon-1 svg-icon-success'
              />
            </span>
          </span>

          <div className='d-flex justify-content-between mt-2'>
            {/* -------------------------- Additional Item Service ---------------------------- */}
            <Link
              to={{
                pathname: `/projects/project/add-ded/additional/list`,
                state: {
                  projName: data.projectName,
                  projectID: data.projectID,
                  customerName: data.firstName + ' ' + data.lastName,
                  searchText: name,
                },
              }}
              data-bs-toggle='tooltip'
              title='Additional Item Service'
              className={
                user.roleID === 2 || user.roleID === 3 || user.designationID === 4
                  ? 'btn btn-icon btn-bg-light pulse2-grow-on-hover bg-hover-dark text-hover-inverse-dark btn-sm me-2'
                  : 'd-none'
              }
            >
              <KTSVG
                path='/media/icons/duotune/ecommerce/ecm009.svg'
                className='svg-icon-3 svg-icon-dark'
              />
            </Link>
            {/* -------------------------- Invoice ---------------------------- */}
            <Link
              to={{
                pathname: `/projects/project/invoice/list`,
                state: {
                  projName: data.projectName,
                  projectID: data.projectID,
                  customerName: data.firstName + ' ' + data.lastName,
                  projectAmount: data.projectAmount,
                  paidAmount: data.paidAmount,
                  remainingAmount: data.remainingAmount,
                  searchText: name,
                },
              }}
              data-bs-toggle='tooltip'
              title='Invoice'
              className={
                user.roleID === 2 || user.roleID === 3 || user.designationID === 4
                  ? 'btn btn-icon btn-bg-light pulse2-grow-on-hover bg-hover-info text-hover-inverse-info btn-sm me-2 text-info'
                  : 'd-none'
              }
            >
              <span className='fa fa-receipt fs-2'></span>
              {/* <span className='pulse-ring'></span> */}
            </Link>
            {/* -------------------------- 3D Images ---------------------------- */}
            <Link
              to={{
                pathname: `/projects/project/photos/list`,
                state: {
                  projName: data.projectName,
                  projectID: data.projectID,
                  customerName: data.firstName + ' ' + data.lastName,
                  searchText: name,
                },
              }}
              data-bs-toggle='tooltip'
              title='3D Images'
              className={
                user.roleID === 2 || user.roleID === 3 || user.designationID === 4
                  ? 'btn btn-icon btn-bg-light pulse2-grow-on-hover bg-hover-warning text-hover-inverse-warning btn-sm me-2 text-warning'
                  : 'd-none'
              }
            >
              <span className='fa fa-images fs-2'></span>
              {/* <span className='pulse-ring'></span> */}
            </Link>
            {/* -------------------------- PMC Assign Request ---------------------------- */}
            <Link
              to={{
                pathname: `/projects/project/pmc-assign-req/${data.projectID}/list`,
                state: {
                  projName: data.projectName,
                  projectID: data.projectID,
                  customerName: data.firstName + ' ' + data.lastName,
                  searchText: name,
                },
              }}
              data-bs-toggle='tooltip'
              title='PMC Assign Request'
              className={
                user.roleID === 2 || user.roleID === 3 || user.designationID === 4
                  ? 'btn btn-icon btn-bg-light pulse2-grow-on-hover bg-hover-success text-hover-inverse-success btn-sm me-2'
                  : 'd-none'
              }
            >
              <KTSVG
                path='/media/icons/duotune/communication/com011.svg'
                className='svg-icon-3 svg-icon-success'
              />
              {/* <span className='pulse-ring'></span> */}
            </Link>
            {/* -------------------------- Stage ---------------------------- */}
            {data.projectCategoryID == 1 ||
            data.projectCategoryID == 2 ||
            data.projectCategoryID == 3 ||
            data.projectCategoryID == 8 ||
            data.projectCategoryID == 9 ||
            data.projectCategoryID == 10 ? (
              <span
                onClick={() =>
                  handleShowStage(
                    data.projectID,
                    data.projectStageID,
                    data.projectName,
                    data.projectCategoryName
                  )
                }
                data-bs-toggle='tooltip'
                title='Stage'
                className={
                  user.roleID === 2 ||
                  user.roleID === 3 ||
                  user.roleID === 5 ||
                  user.designationID === 4
                    ? 'btn btn-icon btn-bg-light pulse2-grow-on-hover bg-hover-primaryMain text-hover-inverse-primaryMain btn-sm me-2'
                    : 'd-none'
                }
              >
                <KTSVG
                  path='/media/icons/duotune/abstract/abs027.svg'
                  className='svg-icon-3 svg-icon-primaryMain'
                />
                {/* <span className='pulse-ring'></span> */}
              </span>
            ) : (
              <></>
            )}

            {/* -------------------------- Designer Stage ---------------------------- */}
            {data.projectCategoryID == 1 ||
            data.projectCategoryID == 2 ||
            data.projectCategoryID == 3 ||
            data.projectCategoryID == 8 ||
            data.projectCategoryID == 9 ||
            data.projectCategoryID == 10 ? (
              <span
                onClick={() =>
                  handleShowDesign(
                    data.projectID,
                    data.projectStageID,
                    data.projectName,
                    data.projectCategoryName
                  )
                }
                data-bs-toggle='tooltip'
                title='Designer Stage'
                className={
                  user.roleID === 2 || user.roleID === 6 || user.designationID === 4
                    ? 'btn btn-icon btn-bg-light pulse2-grow-on-hover bg-hover-primaryMain text-hover-inverse-primaryMain btn-sm me-2'
                    : 'd-none'
                }
              >
                <KTSVG
                  path='/media/icons/duotune/abstract/abs029.svg'
                  className='svg-icon-3 svg-icon-primaryMain'
                />
                {/* <span className='pulse-ring'></span> */}
              </span>
            ) : (
              <></>
            )}
            {/* -------------------------- Download Project ---------------------------- */}
            {/* {data.projectFilePath === '' ? (
              <span className='btn btn-icon btn-bg-light bg-hover-primary btn-sm text-dark text-hover-primary d-block mb-1 fs-6'>N.A</span>
            ) : ( */}
            <span
              className={
                user.roleID === 2 || user.roleID === 3 || user.designationID === 4
                  ? 'btn btn-icon btn-bg-light pulse2-grow-on-hover bg-hover-primary text-hover-inverse-primary btn-sm me-2'
                  : 'd-none'
              }
              title='Download Project'
              onClick={() => downloadPojectFile(data.projectFilePath)}
            >
              <KTSVG
                path='/media/icons/duotune/files/fil017.svg'
                className='svg-icon-3 svg-icon-primary'
              />
              {/* <span className='pulse-ring'></span> */}
            </span>
            {/* )} */}
            {/* -------------------------- Download Quotation ---------------------------- */}
            {/* {data.quetFilePath === '' ? (
              <span className='btn btn-icon btn-bg-light bg-hover-primary btn-sm text-dark text-hover-primary d-block mb-1 fs-6'>
                N.A
              </span>
            ) : ( */}
            <span
              className={
                user.roleID === 2 || user.roleID === 3 || user.designationID === 4
                  ? 'btn btn-icon btn-bg-light bg-hover-dark text-hover-inverse-dark btn-sm text-dark me-2 pulse2-grow-on-hover'
                  : 'd-none'
              }
              data-bs-toggle='tooltip'
              title='Download Quotation'
              onClick={() => handleQuotation(data.quetFilePath)}
            >
              <span className='fa fa-download fs-2'></span>
              {/* <span className='pulse-ring'></span> */}
            </span>
          </div>
        </div>
      </span>
    </>
  )
}

export {ProjectCard}
