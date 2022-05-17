import React, { useEffect, useState } from 'react'
import { storage as Storage } from '@extend-chrome/storage'
import { FormControlLabel, Switch, TextField } from '@mui/material'
import ChangeLogoImage from '../../components/ChangeLogoImage'
import { LaqoliSyncSettings } from '../../types/LaqoliSyncSettings'
import { LaqoliLocalStorage } from '../../types/LaqoliLocalStorage'
import ChangeLogoSmallImage from '../../components/ChangeLogoSmallImage'

const BillPrintEdit = () => {
  const [logoEnabled, setLogoEnabled] = React.useState<boolean>(false)
  const [orderNumberEnabled, setOrderNumberEnabled] =
    React.useState<boolean>(false)
  const [phoneEnabled, setPhoneEnabled] = React.useState<boolean>(false)
  const [productImageEnabled, setProductImageEnabled] =
    React.useState<boolean>(false)

  useEffect(() => {
    // initial load
    Storage.sync
      .get('laqoliSyncSettings')
      .then(
        ({
          laqoliSyncSettings,
        }: {
          laqoliSyncSettings: LaqoliSyncSettings
        }) => {
          if (laqoliSyncSettings && laqoliSyncSettings.logoEnabled && laqoliSyncSettings.orderNumberEnabled && laqoliSyncSettings.phoneEnabled && laqoliSyncSettings.productImageEnabled) {
            setLogoEnabled(laqoliSyncSettings.logoEnabled)
            setOrderNumberEnabled(laqoliSyncSettings.orderNumberEnabled)
            setPhoneEnabled(laqoliSyncSettings.phoneEnabled)
            setProductImageEnabled(laqoliSyncSettings.productImageEnabled)
            console.log(laqoliSyncSettings)
          }
        },
      )

    Storage.local
      .get('laqoliLocalStorage')
      .then(
        ({
          laqoliLocalStorage,
        }: {
          laqoliLocalStorage: LaqoliLocalStorage
        }) => {
            console.log(laqoliLocalStorage);
            if (laqoliLocalStorage.identificationNumber) {
                setIdentificationNumber(laqoliLocalStorage.identificationNumber);
            }
        },
      )
  }, [])

  useEffect(() => {
    Storage.sync.set({
      laqoliSyncSettings: {
        logoEnabled,
        orderNumberEnabled,
        phoneEnabled,
        productImageEnabled,
      },
    })
  }, [logoEnabled, orderNumberEnabled, phoneEnabled, productImageEnabled])

  const [IdentificationNumber, setIdentificationNumber] = useState<string>('')
  useEffect(() => {
    const setLocalIdentificationNumber = async () => {
      const { laqoliLocalStorage }: { laqoliLocalStorage: LaqoliLocalStorage } =
        await Storage.local.get('laqoliLocalStorage')

      Storage.local.set({
        laqoliLocalStorage: {
          logo: laqoliLocalStorage.logo,
          logoSmall: laqoliLocalStorage.logoSmall,
          identificationNumber: IdentificationNumber,
        },
      })
    }
    setLocalIdentificationNumber()
  }, [IdentificationNumber])

  return (
    <div className="container">
      <div className="d-flex justify-content-center flex-column">
        <FormControlLabel
          control={
            <Switch
              checked={logoEnabled}
              onChange={(e) => setLogoEnabled(e.target.checked)}
            />
          }
          label="Logo"
        />
        <FormControlLabel
          control={
            <Switch
              checked={orderNumberEnabled}
              onChange={(e) => setOrderNumberEnabled(e.target.checked)}
            />
          }
          label="Order Number"
        />
        <FormControlLabel
          control={
            <Switch
              checked={phoneEnabled}
              onChange={(e) => setPhoneEnabled(e.target.checked)}
            />
          }
          label="Phone"
        />
        <FormControlLabel
          control={
            <Switch
              checked={productImageEnabled}
              onChange={(e) => setProductImageEnabled(e.target.checked)}
            />
          }
          label="Product Image"
        />
      </div>
      <div className="d-flex py-3">
        <ChangeLogoImage logoEnabled={logoEnabled} />
        <ChangeLogoSmallImage logoEnabled={logoEnabled} />
        <TextField
          label="Identification Number"
          value={IdentificationNumber}
          onChange={(e) => setIdentificationNumber(e.target.value)}
        />
      </div>
    </div>
  )
}

export default BillPrintEdit
