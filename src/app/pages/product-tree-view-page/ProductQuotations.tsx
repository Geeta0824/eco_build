import React, {useEffect, useState} from 'react'
import styled from '@emotion/styled'
import {Tree, TreeNode} from 'react-organizational-chart'
import {Link, useLocation} from 'react-router-dom'
import {modularTypeForTreeData} from '../other-dropDowns/otherDropDowns'
import {IProjectTypeodel} from '../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownList_ForTreeAPI} from '../../modules/project-master-page/project-master/ProjectCRUD'
import {toast} from 'react-toastify'

const StyledNode = styled.div`
  padding: 10px;
  border-radius: 0px;
  display: inline-block;
  border: 1px solid red;
  lineHeight="30px"
>
`

interface IQuoMst {
  loading: boolean
  projectTypeData: IProjectTypeodel[]
  selMainEmployeeID: number
  selMainCustomerID: number
  selMainSearch: string
}

const StyledTreeExample = () => {
  const location = useLocation()
  const [state, setState] = useState<IQuoMst>({
    loading: false,
    projectTypeData: [] as IProjectTypeodel[],
    selMainEmployeeID: 0,
    selMainCustomerID: 0,
    selMainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getprojectTypeData()
    }, 100)
  }, [])

  function getprojectTypeData() {
    GetProjectTypeDropdownList_ForTreeAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            projectTypeData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectTypeData: [], loading: false})
      })
  }

  return (
    <Tree
      lineWidth={'2px'}
      lineColor={'black'}
      lineBorderRadius={'0px'}
      label={<StyledNode className='fs-3 bg-success text-white'>Products</StyledNode>}
    >
      <TreeNode className='fs-2' label={<StyledNode className='bg-warning'>Vista</StyledNode>}>
        {state.projectTypeData.length > 0 &&
          state.projectTypeData.map((data, index) => {
            return (
              <TreeNode
                className='fs-5'
                label={
                  <Link
                    className='text-white text-hover-primary'
                    to={{
                      pathname: `/quotations/ready-made-quotation/list`,
                      state: {
                        projectTypeID: data.projectTypeID,
                        employeeID: state.selMainEmployeeID,
                        customerID: state.selMainCustomerID,
                        mainSearch: state.selMainSearch,
                      },
                    }}
                  >
                    <StyledNode className='bg-dark'>{data.projectType}</StyledNode>
                  </Link>
                }
              />
            )
          })}
      </TreeNode>
      <TreeNode className='fs-2' label={<StyledNode className='bg-warning'>Custom</StyledNode>}>
        <TreeNode
          className='fs-5'
          label={
            <Link
              className='text-white text-hover-primary'
              to={{
                pathname: `/quotations/diy-quotation/list`,
                state: {
                  employeeID: state.selMainEmployeeID,
                  customerID: state.selMainCustomerID,
                  mainSearch: state.selMainSearch,
                },
              }}
            >
              <StyledNode className='bg-dark'>DIY</StyledNode>
            </Link>
          }
        />
        <TreeNode
          className='fs-5'
          label={
            <StyledNode className='bg-dark'>
              <Link
                className='text-white text-hover-primary'
                to={{
                  pathname: `/dnc-quotation/design-and-consultancy/list`,
                  state: {
                    employeeID: state.selMainEmployeeID,
                    customerID: state.selMainCustomerID,
                    mainSearch: state.selMainSearch,
                  },
                }}
              >
                D & C
              </Link>
            </StyledNode>
          }
        />
        {/* <TreeNode label={<StyledNode className='bg-dark'>Grand Child</StyledNode>}>
        <TreeNode label={<StyledNode className='bg-dark'>Great Grand Child 1</StyledNode>} />
        <TreeNode label={<StyledNode className='bg-dark'>Great Grand Child 2</StyledNode>} />
      </TreeNode> */}
      </TreeNode>
      <TreeNode className='fs-2' label={<StyledNode className='bg-warning'>Modular</StyledNode>}>
        {modularTypeForTreeData.length > 0 &&
          modularTypeForTreeData.map((data, index) => {
            return (
              <TreeNode
                className='fs-5'
                label={
                  <Link
                    className='text-white text-hover-primary'
                    to={{
                      pathname: `/modular/modular-quotation/list`,
                      state: {
                        modularTypeID: data.modularTypeID,
                        employeeID: state.selMainEmployeeID,
                        customerID: state.selMainCustomerID,
                        mainSearch: state.selMainSearch,
                      },
                    }}
                  >
                    <StyledNode className='bg-dark'>{data.modularTypeName}</StyledNode>
                  </Link>
                }
              />
            )
          })}
      </TreeNode>
    </Tree>
  )
}

export default StyledTreeExample
