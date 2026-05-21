import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import {RootState} from '../../../../../../setup'
import {
  createStageMaterialApi,
  deleteStageMaterial,
  getAllStageMaterial,
  updateStageMaterial,
} from '../../../../../modules/product-master-page/agency-type-master-page/AgencyTypeMaterialCRUD'
import {UserModel} from '../../../../../modules/auth/models/UserModel'
import {IMaterialInfoModel} from '../../../../../models/product-page/IMaterialInfoModel'
import Header from './Header'
import MaterialForm from './MaterialForm'
import MaterialTable from './MaterialTable'
import SearchBar from './SearchBar'
import SearchBarWithButton from './SearchBar'
import BlankDataImage from '../../../../common-pages/BlankDataImage'

const AgencyTypeMaterialInfo: React.FC = () => {
  const [mainSearch, setMainSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState(0) // 0: add, 1: update
  const [showAddUpdate, setShowAddUpdate] = useState(false)
  const [materialName, setMaterialName] = useState('')
  const [materialCompanyName, setMaterialCompanyName] = useState('')
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState({
    loading: false,
    materialInfoData: [] as IMaterialInfoModel[],
    tmpMaterialInfoData: [] as IMaterialInfoModel[],
    stageName: '',
    searchText: '',
    agencyTypeName: '',
    AgencyTypeID: 0,
    agencyWorkStageID: 0,
    materialInfoID: 0,
  })

  const loadData = async () => {
    setLoading(true)
    const locationState = location.state as any
    const {agencyTypeID, agencyWorkStageID, agencyTypeName, stageName, searchText, mainSearch} =
      locationState
    setMainSearch(mainSearch)

    const response = await getAllStageMaterial(agencyWorkStageID)
    setLoading(false)

    if (response.data.isSuccess) {
      setState({
        ...state,
        materialInfoData: response.data.responseObject,
        tmpMaterialInfoData: response.data.responseObject,
        stageName,
        searchText,
        agencyTypeName,
        AgencyTypeID: agencyTypeID,
        agencyWorkStageID,
      })
      setMainSearch(mainSearch)
    } else {
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [location.state])

  const handleAddOrUpdateMaterial = async () => {
    let response
    if (action === 0) {
      // Adding new material
      response = await createStageMaterialApi(
        state.agencyWorkStageID,
        materialName,
        materialCompanyName,
        user.employeeID,
        ''
      )
    } else {
      // Updating existing material
      response = await updateStageMaterial(
        state.materialInfoID,
        state.agencyWorkStageID,
        materialName,
        materialCompanyName
      )
    }

    if (response.data.isSuccess) {
      toast.success(action === 0 ? 'Created Successfully' : 'Updated Successfully')
      setMaterialName('')
      setMaterialCompanyName('')
      setShowAddUpdate(false)
      loadData()
    } else {
      toast.error(response.data.message)
    }
  }

  const handleDeleteMaterial = async (materialID: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const response = await deleteStageMaterial(materialID)
      if (response.data.isSuccess) {
        toast.success('Deleted Successfully')
        loadData()
      } else {
        toast.error(response.data.message)
      }
    }
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpMaterialInfoData.filter((user) => {
        return (
          user.materialName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.materialCompanyName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, materialInfoData: results})
    } else {
      setState({...state, materialInfoData: state.tmpMaterialInfoData})
    }
    setName(keyword)
  }

  return (
    <>
      <Header
        agencyTypeID={state.AgencyTypeID}
        stageName={state.stageName}
        mainSearch={mainSearch}
        searchText={state.searchText}
        agencyTypeName={state.agencyTypeName}
        agencyWorkStageID={state.agencyWorkStageID}
      />

      <div className='card'>
        {/* Search Bar Component */}
        <SearchBar
          setSearch={setMainSearch}
          filter={filter}
          searchValue={name}
          onAddNew={setShowAddUpdate}
          showAddUpdate={showAddUpdate}
          setAction={setAction}
        />

        {/* Material Form Component */}

        {/* <div className='card-body border-top p-9 ms-6'> */}
        {showAddUpdate && (
          <MaterialForm
            materialName={materialName}
            materialCompanyName={materialCompanyName}
            setMaterialName={setMaterialName}
            setMaterialCompanyName={setMaterialCompanyName}
            action={action}
            onSave={handleAddOrUpdateMaterial}
            onCancel={() => setShowAddUpdate(false)}
          />
        )}
      </div>
      {/* </div> */}
      {/* Add New Button and Table */}

      <div className='card mb-5 mb-xl-10 mt-3'>
        <div className='card-body border-top p-9 ms-6'>
          <MaterialTable
            loading={loading}
            materialData={state.materialInfoData}
            onEdit={(data) => {
              setMaterialName(data.materialName)
              setMaterialCompanyName(data.materialCompanyName)
              setShowAddUpdate(true)
              setAction(1)
              setState((prevState) => ({
                ...prevState,
                materialInfoID: data.agencyStageWiseMaterialID,
              }))
            }}
            onDelete={handleDeleteMaterial}
          />
          <BlankDataImage length={state.materialInfoData.length} loading={state.loading} />
        </div>
      </div>
    </>
  )
}

export default AgencyTypeMaterialInfo
