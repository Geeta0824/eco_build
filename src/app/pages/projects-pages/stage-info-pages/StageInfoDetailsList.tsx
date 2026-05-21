import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {
  IStageDocumentModel,
  IStageInformationModel,
  IStageMaterialModel,
  IStagePhotoModel,
  IStageRemarksModel,
} from '../../../models/projects-page/IStageInfoModel'
import {
  GetProjectStageWise_Document_For_SuperVisorAPI,
  GetProjectStageWise_Imp_Info_For_SuperVisorAPI,
  GetProjectStageWise_MaterialInfo_For_SuperVisorAPI,
  GetProjectStageWise_Remarks_For_SuperVisorAPI,
  getProjectStageWise_Photos_For_SuperVisorAPI,
} from '../../../modules/project-master-page/stage-info/StageInfoCRUD'
import MaterialInfoList from './MaterialInfoList'
import PhotoInfoList from './PhotoInfoList'
import DocumentInfoList from './DocumentInfoList'
import RemarksList from './RemarksList'
import ImpInfoList from './ImpInfoList'

interface IStageInfoState {
  loading: boolean
  materialData: IStageMaterialModel[]
  photoData: IStagePhotoModel[]
  documentData: IStageDocumentModel[]
  impInfoData: IStageInformationModel[]
  remarksData: IStageRemarksModel[]
  stageDetails: {
    stageName: string
    supervisorName: string
    approveBy: string
    targetDate: string
    approveDate: string
    completeDate: string
    projectID: number
    stageID: number
    projectCategoryID: number
    day: string
    searchText: string
  }
}

const initialStageDetails = {
  stageName: '',
  supervisorName: '',
  approveBy: '',
  targetDate: '',
  approveDate: '',
  completeDate: '',
  projectID: 0,
  stageID: 0,
  projectCategoryID: 0,
  day: '',
  searchText: '',
}

const StageInfoListPage: React.FC = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IStageInfoState>({
    loading: false,
    materialData: [],
    photoData: [],
    documentData: [],
    impInfoData: [],
    remarksData: [],
    stageDetails: initialStageDetails,
  })

  useEffect(() => {
    const stageInfo = location.state as any
    if (stageInfo) {
      setState((prevState) => ({
        ...prevState,
        loading: true,
        stageDetails: {
          stageName: stageInfo.stageName || '',
          supervisorName: stageInfo.supervisorName || '',
          approveBy: stageInfo.approveByName || '',
          targetDate: stageInfo.targetDate || '',
          approveDate: stageInfo.targetDateApproveDate || '',
          completeDate: stageInfo.stageCompleteDate || '',
          projectID: stageInfo.projectID || 0,
          stageID: stageInfo.stageID || 0,
          projectCategoryID: stageInfo.projectCategoryID || 0,
          day: stageInfo.day || 0,
          searchText: stageInfo.searchText || '',
        },
      }))
      fetchStageInfo(stageInfo.stageID, stageInfo.projectID, stageInfo.projectCategoryID)
    }
  }, [location])

  const fetchStageInfo = async (stageID: number, projectID: number, projectCategoryID: number) => {
    try {
      const materialResponse = await GetProjectStageWise_MaterialInfo_For_SuperVisorAPI(
        stageID,
        projectID,
        projectCategoryID
      )
      const materialData = materialResponse.data.responseObject || []
      if (materialResponse.data.isSuccess) {
        const photoResponse = await getProjectStageWise_Photos_For_SuperVisorAPI(
          stageID,
          projectID,
          projectCategoryID
        )
        const photoData = photoResponse.data.responseObject || []
        if (photoResponse.data.isSuccess) {
          const documentResponse = await GetProjectStageWise_Document_For_SuperVisorAPI(
            stageID,
            projectID,
            projectCategoryID
          )
          const documentData = documentResponse.data.responseObject || []
          if (documentResponse.data.isSuccess) {
            const impInfoResponse = await GetProjectStageWise_Imp_Info_For_SuperVisorAPI(
              stageID,
              projectID,
              projectCategoryID
            )
            const impInfoData = impInfoResponse.data.responseObject || []
            if (impInfoResponse.data.isSuccess) {
              const remarksResponse = await GetProjectStageWise_Remarks_For_SuperVisorAPI(
                stageID,
                projectID,
                projectCategoryID
              )
              const remarksData = remarksResponse.data.responseObject || []
              if (remarksResponse.data.isSuccess) {
                setState((prevState) => ({
                  ...prevState,
                  loading: false,
                  materialData,
                  photoData,
                  documentData,
                  impInfoData,
                  remarksData,
                }))
              } else {
                toast.error(remarksResponse.data.message || 'Failed to fetch remarks data')
              }
            } else {
              toast.error(impInfoResponse.data.message || 'Failed to fetch important info data')
            }
          } else {
            toast.error(documentResponse.data.message || 'Failed to fetch document data')
          }
        } else {
          toast.error(photoResponse.data.message || 'Failed to fetch photo data')
        }
      } else {
        toast.error(materialResponse.data.message || 'Failed to fetch material data')
      }
    } catch (error) {
      toast.error('An error occurred while fetching stage information')
    }
  }

  const {materialData, photoData, documentData, impInfoData, remarksData, stageDetails, loading} =
    state

  return (
    <>
      <MaterialInfoList data={materialData} loading={loading} {...stageDetails} />
      <ImpInfoList data={impInfoData} loading={loading} />
      <RemarksList data={remarksData} loading={loading} />
      <PhotoInfoList data={photoData} loading={loading} />
      <DocumentInfoList data={documentData} loading={loading} />
    </>
  )
}

export default StageInfoListPage
