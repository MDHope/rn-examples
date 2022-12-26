import { Dimensions, StyleSheet } from 'react-native';
import { State } from 'react-native-gesture-handler';
import Animated, {
  useCode, useValue, cond, eq, set, add, multiply, clockRunning, not, floor, divide, call, Extrapolate, abs, sub, sin, greaterThan, concat,
} from 'react-native-reanimated';
import {
  snapPoint, useClock, usePanGestureHandler, timing,
} from 'react-native-redash';
import STORIES_VIEWER_CONFIG from '../config';
import { GroupedStoryTypeWithInfo } from '../types';

const { RATIO, ANIMATION_PERSPECTIVE } = STORIES_VIEWER_CONFIG;

interface UseCubeAnimationProps {
  content: Array<GroupedStoryTypeWithInfo>;
  translateGroup: Animated.Value<number>;
  handleChangeGroup: (index: number) => void;
  onOpenInfoModalHandler: () => void;
  currentStory: number;
  currentGroup: number;
}

export default function useCubeAnimation({
  content,
  translateGroup,
  handleChangeGroup,
  onOpenInfoModalHandler,
  currentStory,
  currentGroup,
}: UseCubeAnimationProps) {
  const { width } = Dimensions.get('screen');

  const snapPoints = content.map((_, i) => i * width);

  const clock = useClock();
  const OffsetX = useValue<number>(0);
  const Index = useValue<number>(0);

  const {
    gestureHandler, state, velocity, translation,
  } = usePanGestureHandler();

  const to = snapPoint(translateGroup, multiply(velocity.x, -1), snapPoints);

  useCode(() => [
    cond(eq(state, State.BEGAN), [
      set(OffsetX, translateGroup),
    ]),
    cond(eq(state, State.ACTIVE), [
      set(translateGroup, add(OffsetX, multiply(translation.x, -1.75))),
    ]),
    cond(eq(state, State.END), [
      set(translateGroup, timing({ clock, from: translateGroup, to })),
      set(OffsetX, translateGroup),
      cond(not(clockRunning(clock)), [
        set(Index, floor(divide(translateGroup, width))),
        call([Index], (args) => {
          const i = args[0];
          handleChangeGroup(i);
        }),
      ]),
    ]),
  ], [content]);

  useCode(() => [
    cond(eq(state, State.END), [
      cond(greaterThan(multiply(translation.y, -1), 100), [
        call([], () => {
          onOpenInfoModalHandler();
        }),
      ]),
    ]),
  ], [currentStory, currentGroup]);

  const getStyle = (index: number) => {
    const offset = width * index;
    const inputRange = [offset - width, offset + width];
    const angle = Math.atan((ANIMATION_PERSPECTIVE / width) / 2);

    const translateX = translateGroup.interpolate({
      inputRange,
      outputRange: [width / RATIO, -width / RATIO],
      extrapolate: Extrapolate.CLAMP,
    });
    const rotateY = translateGroup.interpolate({
      inputRange,
      outputRange: [angle, -angle],
      extrapolate: Extrapolate.CLAMP,
    });

    const alpha = abs(rotateY);
    const gamma = sub(angle, alpha);
    const beta = sub(Math.PI, alpha, gamma);
    const w = sub(width / 2, multiply(width / 2, divide(sin(gamma), sin(beta))));
    const translateX1 = cond(greaterThan(rotateY, 0), w, multiply(w, -1));

    return {
      ...StyleSheet.absoluteFillObject,
      transform: [
        { perspective: ANIMATION_PERSPECTIVE },
        { translateX },
        { rotateY: concat(rotateY, 'rad') },
        { translateX: translateX1 },
      ],
    };
  };

  return {
    getStyle,
    gestureHandler,
  };
}
