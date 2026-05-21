import React from 'react';
import { KTSVG } from '../../../_Ecd/helpers';

interface ProjectSearchInputProps {
  filter: (e: any) => void;
  name: string;
}

const ProjectSearchInput: React.FC<ProjectSearchInputProps> = ({ filter, name }) => {
  return (
    <div className="border-0 p-2">
      <form className="w-100 position-relative" autoComplete="off">
        <KTSVG
          path="/media/icons/duotune/general/gen021.svg"
          className="svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y"
        />
        <input
          type="text"
          className="form-control form-control-solid px-15 bg-white"
          placeholder="Search"
          onChange={filter}
          value={name}
        />
      </form>
    </div>
  );
};

export default ProjectSearchInput;
