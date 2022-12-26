import { Asset } from 'expo-media-library';
import {
  StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { TypeOfContent } from '../../types';
import calcSizeOfPost from '../../utils/calcSizeOfPost';

interface AddDescriptionStepProps {
  profileName: string;
  description: string;
  onChangeDescription: (d: string) => void;
  imageSrc?: string;
  isImageProcessing: boolean;
  imageAsset: Asset;
}

export default function AddDescriptionStep({
  profileName,
  description,
  onChangeDescription,
  imageSrc,
  isImageProcessing,
  imageAsset,
}: AddDescriptionStepProps) {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 120 : 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.container}
    >
      <ScrollView>
        <View style={[styles.photoContainer, {
          ...calcSizeOfPost(TypeOfContent.FEED, imageAsset),
        }]}
        >
          {isImageProcessing ? (
            <View style={styles.loaderContainer}>
              <Text style={{ marginRight: 5 }}>Загрузка...</Text>
              <ActivityIndicator size="small" color="#292D32" />
            </View>
          ) : (
            <Image
              style={{ width: '100%', height: '100%' }}
              source={{ uri: imageSrc }}
            />
          )}
        </View>
        <Text style={styles.profileName}>{profileName}</Text>
        <TextInput
          value={description}
          onChangeText={(t) => onChangeDescription(t)}
          style={styles.input}
          placeholder="Добавьте подпись к публикации"
          placeholderTextColor="rgba(41, 45, 50, 0.6)"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {},
  photoContainer: {
    overflow: 'hidden',
    marginTop: 25,
    marginHorizontal: 0,
  },
  image: {},
  profileName: {
    fontSize: 16,
    lineHeight: 20,
    color: '#292D32',
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 16,
  },
  input: {
    marginHorizontal: 16,
    fontSize: 16,
    paddingBottom: 30,
  },
  loaderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
