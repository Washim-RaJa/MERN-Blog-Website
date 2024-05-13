import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';



export default function DashProfile() {
  const { currentUser } = useSelector((state)=> state.user);
  const [ imageFile, setImageFile ] = useState(null)
  const [ imageFileUrl, setImageFileUrl ] = useState(null)
  const [ imageFileUploadProgress , setImageFileUploadProgress ] = useState(null);
  const [ imageFileUploadError , setImageFileUploadError ] = useState(null);
  const [ formData, setFormData ] = useState({});
  const dispatch = useDispatch();
  const [ imageFileUploading, setImageFileUploading ] = useState(false);
  const [ updateUserSuccess, setUpdateUserSuccess ] = useState(null);
  const [ updateUserError, setUpdateUserError ] = useState(null);


  const filePickerRef = useRef();
  const handleImageChange = (e)=> {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file))
    }
  }
  useEffect( ()=> {
    if (imageFile) {
      uploadImage()
    }
  },[imageFile])

  // we've actived our storage in Firebase for images
  const uploadImage = async()=> {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 && 
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // upload progress in %
        setImageFileUploadProgress(progress.toFixed(0))   // toFixed(0) - rounds off the decimal
      },
      () => {   // Error Handling
        setImageFileUploadError('Could not upload image (File must be less than 2MB) ');
        setImageFileUploadProgress(null);
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl)
          setImageFileUploadProgress(null)
          setFormData({...formData, profilePicture: downloadUrl});
          setImageFileUploading(false);
        })
      }

    )
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e)=> {
    e.preventDefault()
    setUpdateUserError(null);
    setUpdateUserSuccess(null)
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made')
      return
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload')
      return;
    }
    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message)
      } else {
        dispatch(updateSuccess(data))
        setUpdateUserSuccess("User's profile Updated successfully !")
      }

    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={()=> filePickerRef.current.click()}
        >
          { imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress/100})`
                }
              }}
            />
          )}
          <img
            src= {imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={
              `w-full h-full rounded-full border-8 border-[lightgray] object-cover text-center
              ${ imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`
            }
          />
        </div>

        { imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />

        <Button type='submit' gradientDuoTone={'purpleToBlue'} outline>
          Update
        </Button>

      </form>

      <div className="flex justify-between mt-5 text-red-500">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (<Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>)}
      {updateUserError && (<Alert color='failure' className='mt-5'>{updateUserError}</Alert>)}
    </div>
  )
}
