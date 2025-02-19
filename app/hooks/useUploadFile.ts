import { useState } from 'react'
import { storage } from '../firebaseIntance'

export const useFileStorage = () => {
  const [file, setFile] = useState('')
  const fileHandler = async (fileProps:File) => {
    const file = fileProps
    const storegeRef = storage.ref()
    const filePath = storegeRef.child(file.name)
    await filePath.put(file)
    const linkUrl = await filePath.getDownloadURL()
    setFile(linkUrl)

    return linkUrl
  }
  return { file, fileHandler }
}
