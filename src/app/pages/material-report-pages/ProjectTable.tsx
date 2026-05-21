import React from 'react';
import { Pagination } from 'antd';
import { Link } from 'react-router-dom';
import { KTSVG } from '../../../_Ecd/helpers';
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable';

interface ProjectTableProps {
  projectData: any[];
  total: number;
  page: number;
  postPerPage: number;
  onPageChange: (page: number) => void;
  onSizeChange: (current: any, pageSize: any) => void;
  handleShow: () => void;
  loading: boolean;  
  colSpan: number;  
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projectData,
  total,
  page,
  postPerPage,
  onPageChange,
  onSizeChange,
  handleShow,
  loading,
  colSpan,  
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-rounded align-middle border g-2">
        <thead className="bg-light-primary">
          <tr className="fw-bolder fs-5">
            <th className="min-w-150px">Material Name</th>
            <th className="min-w-150px text-center">Montdor Material Name</th>
            <th className="min-w-150px text-end">PMC Material Name</th>
          </tr>
        </thead>
        <tbody className="border-bottom">
          {projectData.length === 0 ? (
            <BlankDataImageInTable 
              length={projectData.length} 
              loading={loading}
              colSpan={colSpan}  
            />
          ) : (
            projectData.map((stage) => (
              <tr key={stage.stageID}>
                <td colSpan={4} className="text-primary text-center text-hover-primary fw-bolder fs-4">
                  {stage.stageName}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="text-center">
        <Pagination
          onChange={onPageChange}
          pageSize={postPerPage}
          total={total}
          current={page}
          showSizeChanger
          onShowSizeChange={onSizeChange}
        />
      </div>
    </div>
  );
};

export default ProjectTable;
