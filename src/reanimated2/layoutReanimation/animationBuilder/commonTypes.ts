import type { EasingFn } from '../../Easing';
import type { StyleProps } from '../../commonTypes';

export interface KeyframeProps extends StyleProps {
  easing?: EasingFn;
  [key: string]: any;
}

export type LayoutAnimation = {
  initialValues: StyleProps;
  animations: StyleProps;
  callback?: (finished: boolean) => void;
};

export type AnimationFunction = (a?: any, b?: any, c?: any) => any; // this is just a temporary mock

export interface EntryAnimationsValues {
  targetOriginX: number;
  targetOriginY: number;
  targetWidth: number;
  targetHeight: number;
  targetGlobalOriginX: number;
  targetGlobalOriginY: number;
  windowWidth: number;
  windowHeight: number;
}

export interface ExitAnimationsValues {
  currentOriginX: number;
  currentOriginY: number;
  currentWidth: number;
  currentHeight: number;
  currentGlobalOriginX: number;
  currentGlobalOriginY: number;
  windowWidth: number;
  windowHeight: number;
}

export type EntryExitAnimationFunction =
  | ((targetValues: EntryAnimationsValues) => LayoutAnimation)
  | ((targetValues: ExitAnimationsValues) => LayoutAnimation)
  | (() => LayoutAnimation);

export type AnimationConfigFunction<T> = (targetValues: T) => LayoutAnimation;

export interface LayoutAnimationsValues {
  [key: string]: number;
  currentOriginX: number;
  currentOriginY: number;
  currentWidth: number;
  currentHeight: number;
  currentGlobalOriginX: number;
  currentGlobalOriginY: number;
  targetOriginX: number;
  targetOriginY: number;
  targetWidth: number;
  targetHeight: number;
  targetGlobalOriginX: number;
  targetGlobalOriginY: number;
  windowWidth: number;
  windowHeight: number;
}

export enum LayoutAnimationType {
  ENTERING = 1,
  EXITING = 2,
  LAYOUT = 3,
  SHARED_ELEMENT_TRANSITION = 4,
}

export type LayoutAnimationFunction = (
  targetValues: LayoutAnimationsValues
) => LayoutAnimation;

export type LayoutAnimationStartFunction = (
  tag: number,
  type: LayoutAnimationType,
  yogaValues: LayoutAnimationsValues,
  config: LayoutAnimationFunction
) => void;

export interface ILayoutAnimationBuilder {
  build: () => LayoutAnimationFunction;
}

export interface BaseLayoutAnimationConfig {
  duration?: number;
  easing?: EasingFn;
  type?: AnimationFunction;
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamping?: number;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
}

export interface BaseBuilderAnimationConfig extends BaseLayoutAnimationConfig {
  rotate?: number | string;
}

export type LayoutAnimationAndConfig = [
  AnimationFunction,
  BaseBuilderAnimationConfig
];

export interface IEntryExitAnimationBuilder {
  build: () => EntryExitAnimationFunction;
}

export interface IEntryAnimationBuilder {
  build: () => AnimationConfigFunction<EntryAnimationsValues>;
}

export interface IExitAnimationBuilder {
  build: () => AnimationConfigFunction<ExitAnimationsValues>;
}

export type EntryExitAnimationsValues =
  | EntryAnimationsValues
  | ExitAnimationsValues;
