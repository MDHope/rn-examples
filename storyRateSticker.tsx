import {
  Text, StyleSheet, Animated, View, TextInput,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import { useState } from 'react';
import useContentDeleteZone from '../../../../hooks/useContentDeleteZone';
import useGestureMove from '../../../../hooks/useGestureMove';
import { StoryRateType } from '../../../../types';
import CustomLinearGradient from '../../../../../ui/Elements/CustomLinearGradient';
import SelectColor from './SelectColor';

interface StoryRateProps {
  storyRate: StoryRateType;
  isEditable?: boolean;
  saveStoryRate: (rate: StoryRateType) => void;
  onDeleteStoryRate?: () => void;
  onReachDeleteZone?: (isReached: boolean) => void;
  isReachedDeleteZone?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

function CustomThumb() {
  return (
    <Text style={styles.emojiThumbIcon}>
      🔥
    </Text>
  );
}

function TrackMark({ width }: { width: number }) {
  return (
    <CustomLinearGradient
      colors={['#00FFE0', '#0085FF']}
      style={[styles.customTrackStyle, { width }]}
      end={{ x: 1, y: 0 }}
    />
  );
}

export default function StoryRate({
  storyRate,
  saveStoryRate,
  onDeleteStoryRate,
  onReachDeleteZone,
  isReachedDeleteZone,
  onDragEnd,
  onDragStart,
  isEditable = true,
}: StoryRateProps) {
  const [rate, setRate] = useState(0);

  const { onLayoutChange } = useContentDeleteZone({ storyContentGesture: storyRate.gesture, onChangeDeleteZone: onReachDeleteZone });

  const onMoveX = (x: number) => {
    saveStoryRate({
      ...storyRate,
      gesture: {
        ...storyRate.gesture,
        x,
      },
    });
  };

  const onMoveY = (y: number) => {
    saveStoryRate({
      ...storyRate,
      gesture: {
        ...storyRate.gesture,
        y,
      },
    });
  };

  const {
    onMoveEvent, moveX, moveY, onHandleStateChange,
  } = useGestureMove(storyRate.gesture, onMoveX, onMoveY, onDragStart, onDragEnd, isReachedDeleteZone ? onDeleteStoryRate : undefined);

  return (
    <PanGestureHandler
      onHandlerStateChange={isEditable ? onHandleStateChange : undefined}
      onGestureEvent={isEditable ? onMoveEvent : undefined}
    >
      <TapGestureHandler>
        <Animated.View
          style={[styles.container, { backgroundColor: storyRate.backgroundColor }, {
            transform: [
              { translateX: moveX },
              { translateY: moveY },
            ],
          }]}
          onLayout={onLayoutChange}
        >
          {isEditable ? (
            <SelectColor
              onColorClickHandler={(backgroundColor) => saveStoryRate({ ...storyRate, backgroundColor })}
              selectedColor={storyRate.backgroundColor}
            />
          ) : null}
          <TextInput
            value={storyRate.question}
            onChangeText={(text) => saveStoryRate({ ...storyRate, question: text })}
            style={styles.titleInput}
            placeholderTextColor="rgba(41, 45, 50, 0.7)"
            placeholder="Заголовок..."
            multiline
            editable={isEditable}
          />
          <View style={styles.rateContainer}>
            <Slider
              value={rate}
              minimumTrackTintColor="rgba(41, 45, 50, 0.1)"
              onValueChange={(v) => setRate(v as number)}
              trackStyle={styles.trackStyle}
              renderThumbComponent={CustomThumb}
              renderTrackMarkComponent={() => <TrackMark width={214 * rate} />}
            />
          </View>
        </Animated.View>
      </TapGestureHandler>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    width: 290,
    alignSelf: 'center',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 26,
  },
  titleInput: {
    fontWeight: '700',
    color: '#292D32',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  rateContainer: {
    width: '100%',
  },
  thumbStyle: {},
  trackStyle: {
    height: 10,
    backgroundColor: 'rgba(41, 45, 50, 0.1)',
    borderRadius: 6,
    marginRight: 10,
    marginLeft: 12,
  },
  emojiThumbIcon: {
    fontSize: 40,
    paddingBottom: 5,
  },
  customTrackStyle: {
    height: 10,
    borderRadius: 6,
    maxWidth: 214,
    marginLeft: 10,
  },
});
