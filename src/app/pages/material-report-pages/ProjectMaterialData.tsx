import React from 'react'
import {IProjectMaterialModel} from '../../models/Reports-page/IWorkHistoryModel'

interface ProjectMaterialDataProps {
  projectMaterialData: IProjectMaterialModel[]
}

const ProjectMaterialData: React.FC<ProjectMaterialDataProps> = ({projectMaterialData}) => {
  return (
    <>
      {projectMaterialData.map((stage) => (
        <React.Fragment key={stage.stageID}>
          {/* Enhanced Stage Header */}
          <tr className='border border-2 border-dark'>
            <td
              colSpan={4}
              className='py-4 text-center text-white text-hover-primary bg-hover-dark'
              style={{
                background: 'linear-gradient(90deg, #ff7eb3 0%, #ff758c 100%)',
                // borderRadius: '8px',
                marginBottom: '10px',
              }}
            >
              <div className='d-flex align-items-center justify-content-center'>
                <i className='bi bi-layers-fill me-3 fs-4 text-white'></i>
                <span className='fs-3 fw-bold text-uppercase'>{stage.stageName}</span>
              </div>
            </td>
          </tr>

          {/* Materials List */}
          {stage.materials.map((material) => (
            <tr
              className='align-middle'
              key={material.materialID}
              style={{
                transition: '0.3s ease',
                backgroundColor: 'rgba(240, 240, 240, 0.5)',
                borderRadius: '5px',
                marginBottom: '5px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Material Image and Name */}
              <td>
                <div className='d-flex align-items-center'>
                  <div className='symbol symbol-50px mx-3'>
                    <img
                      src={
                        material.photoPath
                          ? process.env.REACT_APP_API_URL + material.photoPath
                          : '/media/img/NoProductImage.png'
                      }
                      alt={material.materialName || 'No Image'}
                      className='rounded shadow-sm'
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <div>
                    <p className='mb-0 fw-semibold text-dark fs-5'>
                      {material.materialName || 'N/A'}
                    </p>
                  </div>
                </div>
              </td>

              {/* Montdor Material Name */}
              <td className='text-center'>
                <span
                  className='badge px-3 py-2 fs-6 fw-semibold'
                  style={{
                    background: '#daf7a6',
                    color: '#34495e',
                    borderRadius: '12px',
                  }}
                >
                  {material.montodorMaterialName || 'N/A'}
                </span>
              </td>

              {/* PMC Material Name */}
              <td className='text-center'>
                {material.pmcMaterialName ? (
                  <span
                    className='badge px-3 py-2 fs-6 fw-semibold'
                    style={{
                      background: '#ffb74d',
                      color: '#3e2723',
                      borderRadius: '12px',
                    }}
                  >
                    {material.pmcMaterialName || 'N/A'}
                  </span>
                ) : (
                  <span
                    className='px-3 py-2 fs-6 fw-semibold'
                  >
                    {material.pmcMaterialName || 'N/A'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </>
  )
}

export default ProjectMaterialData
