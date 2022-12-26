import { useEffect } from 'react';
import { RootStackScreenProps } from '../../../types';
import EditProfileComponent from '../components/EditProfile/EditProfileComponent';
import useGetAvatar from '../hooks/useGetAvatar';
import useIdentity from '../hooks/useIdentity';
import useUploadAvatar from '../hooks/useUploadAvatar';
import useUserData from '../hooks/useUserData';
import { useUpdateUserDataMutation } from '../storage/api';
import { EditUserDataType } from '../types';

interface EditProfileScreenProps extends RootStackScreenProps<'EditProfile'> {}

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const userData = useUserData();
  const identity = useIdentity();
  const [updateUserData, { isLoading, isSuccess }] = useUpdateUserDataMutation();
  const userAvatar = useGetAvatar(identity.data?.name);

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('Profile');
    }
  }, [isSuccess]);

  const { pickImage } = useUploadAvatar(identity.data?.name);

  const onBack = () => navigation.navigate('Profile');

  const onFormSubmit = (values: EditUserDataType) => {
      updateUserData(values);
  };

  return (
  <EditProfileComponent
    initialValues={userData.data}
    onSubmit={onFormSubmit}
    onBack={onBack}
    avatarImg={userAvatar.data}
    isLoading={isLoading}
    onUploadImageClickHandler={pickImage}
  />
)
}
