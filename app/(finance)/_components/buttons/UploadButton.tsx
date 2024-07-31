'use client';

import { useCSVReader } from 'react-papaparse';
import { Upload } from 'lucide-react';
import { Button } from '@/shared/components';

interface Props {
  onUpload: (results: any) => void;
}

function UploadButton({ onUpload }: Props): JSX.Element {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <>
          <Button type='button' name='upload' size='sm' variant='secondary' {...getRootProps()}>
            <Upload className='size-4 mr-2' /> Import
          </Button>
        </>
      )}
    </CSVReader>
  );
}
export default UploadButton;
