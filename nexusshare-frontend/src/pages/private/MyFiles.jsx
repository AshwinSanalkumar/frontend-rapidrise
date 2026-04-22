import React from 'react';
import FileBrowser from '../../components/common/FileBrowser';

const MY_FILES_EMPTY_STATE = {
  icon: 'fa-search',
  title: 'No files found',
  message: "We couldn't find anything matching your search. Try checking your spelling or use different keywords."
};

const MyFiles = () => {
  return (
    <FileBrowser 
      title="My Files" 
      subtitle="Select a file to generate a secure sharing link." 
      emptyState={MY_FILES_EMPTY_STATE}
    />
  );
};

export default MyFiles;