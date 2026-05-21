import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup/redux/RootReducer'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {getAllEmpEducationByEmpID} from '../../../../modules/organization-page/employee-master-page/education-details/EmployeeEducationCRUD'
import {Link, useParams} from 'react-router-dom'
import {IEmployeeEducationModel} from '../../../../models/organization-page/Employee/IEmployeeEducationModel'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {Pagination} from 'antd'

type Props = {}
interface IMyProfile {
  loading: boolean
  empEduData: IEmployeeEducationModel[]
}

export function ViewCustomerEducation() {
  const {employeeID} = useParams<{employeeID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    empEduData: [] as IEmployeeEducationModel[],
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getMyEducationData()
    }, 100)
  }, [])

  function getMyEducationData() {
    getAllEmpEducationByEmpID(parseInt(employeeID))
      .then((response) => {
        const personData = response.data.responseObject
     //  console.log(personData)
        setState({...state, empEduData: personData, loading: false})
        setTotal(personData.length)
      })
      .catch((error) => {
        alert(error)
        setState({...state, empEduData: [] as IEmployeeEducationModel[], loading: false})
      })
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.empEduData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IEmployeeEducationModel[] = state.empEduData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const {empEduData} = state

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Institute Name</th>
                  <th className='min-w-150px'>Subject Name</th>
                  <th className='min-w-150px'>Education Category</th>
                  <th className='min-w-140px'>Passing Year&nbsp;(%)</th>
                  <th className='min-w-25px text-center'>View</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <div className={state.loading === true ? 'card mb-5 mb-xl-10 h-100' : 'd-none'}>
                  <div className='card-body border-top p-9 ms-10'>
                    <div className='d-flex justify-content-center m-5 p-5'>
                      <div
                        className='spinner-border'
                        style={{width: '3rem', height: '3rem'}}
                        role='status'
                      >
                        <span className='visually-hidden'>Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.instituteName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.subjectName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.eduCategoryName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block fs-6'>
                            {data.passingYear}&nbsp;({data.percentage}%)
                          </span>
                        </td>
                        <td className='text-center'>
                          <Link
                            to={`/organization/employee/view/${data.employeeEducationID}/personal`}
                            className='btn btn-icon btn-bg-light text-success bg-hover-success text-hover-inverse-success btn-sm'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                {/* =================== Blank Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={5}
                />
              </tbody>
            </table>
          </div>
          <div className='text-center'>
            <Pagination
              onChange={(value: any) => setPage(value)}
              pageSize={postPerPage}
              total={total}
              current={page}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChange}
              showTotal={(total) => `Total ${total} items`}
            />
          </div>
        </div>
      </div>
    </>
  )
}
