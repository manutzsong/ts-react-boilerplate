import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LaqoliSyncSettings } from '../types/LaqoliSyncSettings';
import { storage as Storage } from '@extend-chrome/storage';
import { LaqoliLocalStorage } from '../types/LaqoliLocalStorage';
const ChangeLogoSmallImage = ({
  logoEnabled,
}: {
  logoEnabled: LaqoliSyncSettings['logoEnabled'];
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [laqoliLocalStorageState, setLaqoliLocalStorageState] =
    useState<LaqoliLocalStorage>();

  useEffect(() => {
    Storage.local
      .get('laqoliLocalStorage')
      .then(
        ({
          laqoliLocalStorage,
        }: {
          laqoliLocalStorage: LaqoliLocalStorage;
        }) => {
          setLaqoliLocalStorageState(laqoliLocalStorage);
          if (laqoliLocalStorage.logoSmall) {
            setPreview(laqoliLocalStorage.logoSmall);
          }
        },
      );
  }, []);
  useEffect(() => {
    if (selectedFile) {
      // create the preview
      const objectUrl = URL.createObjectURL(selectedFile);

      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        Storage.local.set({
          laqoliLocalStorage: {
            ...laqoliLocalStorageState,
            logoSmall: reader.result,
          },
        });
      };

      setPreview(objectUrl);
      // Storage.local.set({
      //   logo : objectUrl,
      // });
      return () => URL.revokeObjectURL(objectUrl);
    }
    // free memory when ever this component is unmounted
  }, [selectedFile]);

  const onSelectFile = (files: FileList | null): void => {
    if (files) {
      setSelectedFile(files[0]);
    }
  };

  if (logoEnabled) {
    return (
      <div className="d-flex justify-content-center">
        <img src={preview} alt="google logo" style={{ width: '100px' }} />
        <Button variant="contained" component="label">
          Upload File
          <input
            type="file"
            hidden
            onChange={(e) => onSelectFile(e.target.files)}
          />
        </Button>
      </div>
    );
  } else {
    return <></>;
  }
};

export default ChangeLogoSmallImage;
