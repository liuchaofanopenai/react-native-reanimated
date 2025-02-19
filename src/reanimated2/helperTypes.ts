/* eslint-disable @typescript-eslint/no-explicit-any */
/*
This file is a legacy remainder of manual types from react-native-reanimated.d.ts file. 
I wasn't able to get rid of all of them from the code. 
They should be treated as a temporary solution
until time comes to refactor the code and get necessary types right. 
This will not be easy though! 
*/

import type {
  ColorValue,
  StyleProp,
  TransformsStyle as RNTransformsStyle,
} from 'react-native';
import type {
  AnimatableValue,
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  ILayoutAnimationBuilder,
  LayoutAnimationFunction,
  SharedValue,
} from '.';
import type { ReanimatedKeyframe } from './layoutReanimation/animationBuilder/Keyframe';
import type { DependencyList } from './hook/commonTypes';

type Adaptable<T> = T | ReadonlyArray<T | ReadonlyArray<T>> | SharedValue<T>;

type AdaptTransforms<T> = {
  [P in keyof T]: Adaptable<T[P]>;
};

type TransformsStyle = Pick<RNTransformsStyle, 'transform'>;

type TransformStyleTypes = TransformsStyle['transform'] extends
  | readonly (infer T)[]
  | undefined
  ? T
  : never;
type AnimatedTransform = AdaptTransforms<TransformStyleTypes>[];

export type AnimateStyle<S> = {
  [K in keyof S]: K extends 'transform'
    ? AnimatedTransform
    : S[K] extends ReadonlyArray<any>
    ? ReadonlyArray<AnimateStyle<S[K][0]>>
    : S[K] extends object
    ? AnimateStyle<S[K]>
    : S[K] extends ColorValue | undefined
    ? S[K] | number
    : S[K] | SharedValue<AnimatableValue>;
};

// provided types can either be their original types (like backgroundColor: pink)
// or inline shared values/derived values
type MaybeSharedValue<S> = {
  [K in keyof S]: S[K] | Readonly<SharedValue<Extract<S[K], AnimatableValue>>>;
};

type StylesOrDefault<T> = 'style' extends keyof T
  ? MaybeSharedValue<T['style']>
  : Record<string, unknown>;

type EntryOrExitLayoutType =
  | BaseAnimationBuilder
  | typeof BaseAnimationBuilder
  | EntryExitAnimationFunction
  | ReanimatedKeyframe;

/* 
  Style type properties (properties that extends StyleProp<ViewStyle>)
  can be defined with other property names than "style". For example `contentContainerStyle` in FlatList.
  Type definition for all style type properties should act similarly, hence we
  pick keys with 'Style' substring with the use of this utility type.
*/
type PickStyleProps<T> = Pick<
  T,
  {
    [Key in keyof T]-?: Key extends `${string}Style` ? Key : never;
  }[keyof T]
>;

type StyleAnimatedProps<P extends object> = {
  [K in keyof PickStyleProps<P>]: StyleProp<AnimateStyle<P[K]>>;
};

type JustStyleAnimatedProp<P extends object> = {
  style?: StyleProp<AnimateStyle<StylesOrDefault<P>>>;
};

type NonStyleAnimatedProps<P extends object> = {
  [K in keyof Omit<P, keyof PickStyleProps<P> | 'style'>]:
    | P[K]
    | SharedValue<P[K]>;
};

type LayoutProps = {
  layout?:
    | BaseAnimationBuilder
    | LayoutAnimationFunction
    | typeof BaseAnimationBuilder;
  entering?: EntryOrExitLayoutType;
  exiting?: EntryOrExitLayoutType;
};

type SharedTransitionProps = {
  sharedTransitionTag?: string;
  sharedTransitionStyle?: ILayoutAnimationBuilder;
};

type AnimatedPropsProp<P extends object> = NonStyleAnimatedProps<P> &
  JustStyleAnimatedProp<P> &
  StyleAnimatedProps<P> &
  LayoutProps &
  SharedTransitionProps;

export type AnimateProps<P extends object> = NonStyleAnimatedProps<P> &
  JustStyleAnimatedProp<P> &
  StyleAnimatedProps<P> &
  LayoutProps &
  SharedTransitionProps & {
    animatedProps?: Partial<AnimatedPropsProp<P>>;
  };

export type AnimatedProps<P extends object> = AnimateProps<P>;

export type AnimatedPropsAdapterFunction = (
  props: Record<string, unknown>
) => void;

export type useAnimatedPropsType = <T extends object>(
  updater: () => Partial<T>,
  deps?: DependencyList | null,
  adapters?:
    | AnimatedPropsAdapterFunction
    | AnimatedPropsAdapterFunction[]
    | null
) => Partial<T>;
