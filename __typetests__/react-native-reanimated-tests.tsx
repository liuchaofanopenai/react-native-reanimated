/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback, forwardRef, useRef } from 'react';
import type { FlatListProps, ViewProps, ImageProps } from 'react-native';
import { StyleSheet, Button, View, Image } from 'react-native';
import type {
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {
  PanGestureHandler,
  PinchGestureHandler,
  FlatList,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useAnimatedGestureHandler,
  Easing,
  withTiming,
  withSpring,
  cancelAnimation,
  withDelay,
  withRepeat,
  withSequence,
  withDecay,
  useWorkletCallback,
  runOnUI,
  useAnimatedReaction,
  interpolateColor,
  makeMutable,
  createAnimatedPropAdapter,
  useAnimatedProps,
  useAnimatedRef,
} from '..';
import {
  dispatchCommand,
  measure,
  scrollTo,
  setGestureState,
} from '../src/reanimated2/NativeMethods';

class Path extends React.Component<{ fill?: string }> {
  render() {
    return null;
  }
}

type Item = {
  id: number;
};

const SomeFC = (props: ViewProps) => {
  return <View {...props} />;
};

const SomeFCWithRef = forwardRef((props: ViewProps) => {
  return <View {...props} />;
});

// Class Component -> Animated Class Component
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedTypedFlatList =
  Animated.createAnimatedComponent<FlatListProps<Item[]>>(FlatList);

// Function Component -> Animated Function Component
const AnimatedFC = Animated.createAnimatedComponent(SomeFC);
const AnimatedFCWithRef = Animated.createAnimatedComponent(SomeFCWithRef);

function CreateAnimatedComponentTest1() {
  const animatedProps = useAnimatedProps(() => ({ fill: 'blue' }));
  return (
    <AnimatedPath
      animatedProps={animatedProps}
      style={{ backgroundColor: 'red' }}
    />
  );
}

function CreateAnimatedComponentTest2() {
  const animatedProps = useAnimatedProps(() => ({ fill2: 'blue' }));
  return (
    // @ts-expect-error
    <AnimatedPath animatedProps={animatedProps} />
  );
}

function CreateAnimatedComponentTest3() {
  const animatedProps = useAnimatedProps(
    () => ({ pointerEvents: 'none' } as const)
  );
  return (
    <Animated.View animatedProps={animatedProps}>
      <AnimatedPath />
    </Animated.View>
  );
}

function CreateAnimatedFlatListTest1() {
  const renderItem = useCallback(
    ({ item, index }: { item: Item[]; index: number }) => {
      if (Math.random()) {
        return null;
      }
      return <View style={{ width: 100 }} />;
    },
    []
  );
  return (
    <>
      <AnimatedTypedFlatList
        style={{ flex: 1 }}
        data={[]}
        renderItem={renderItem}
      />
      <AnimatedFlatList
        // @ts-expect-error
        style={{ flex: 1, red: false }}
        data={[]}
        renderItem={() => null}
      />
      <AnimatedImage style={{ flex: 1 }} source={{ uri: '' }} />
    </>
  );
}

function CreateAnimatedFlatListTest2() {
  return (
    <>
      <Animated.FlatList
        data={[{ foo: 1 }]}
        renderItem={({ item, index }) => <View key={item.foo} />}
      />
    </>
  );
}

// This tests checks if the type of the contentContainerStyle
// (or any other '...Style') is treated the same
// as the style prop of the AnimatedFlatList.
function CreateAnimatedFlatListTest3(
  contentContainerStyle: React.ComponentProps<
    typeof AnimatedFlatList
  >['contentContainerStyle']
) {
  const newContentContainerStyle = [contentContainerStyle, { flex: 1 }];

  return (
    <AnimatedFlatList
      data={[{ foo: 1 }]}
      renderItem={() => null}
      contentContainerStyle={newContentContainerStyle}
    />
  );
}

// This tests checks if the type of the contentContainerStyle
// (or any other '...Style') is treated the same
// as the style prop of the AnimatedFlatList.
function CreateAnimatedFlatListTest4(
  contentContainerStyle: React.ComponentProps<typeof AnimatedFlatList>['style']
) {
  return (
    <AnimatedFlatList
      data={[{ foo: 1 }]}
      renderItem={() => null}
      contentContainerStyle={contentContainerStyle}
    />
  );
}

function TestClassComponentRef() {
  const animatedRef = useAnimatedRef<React.Component<ImageProps>>();
  return <AnimatedImage ref={animatedRef} source={{}} />;
}

function TestFunctionComponentRef() {
  const animatedRef = useAnimatedRef<React.Component<ViewProps>>();
  return (
    <AnimatedFC
      // @ts-expect-error ref is not available on plain function-components
      ref={animatedRef}
    />
  );
}

function TestFunctionComponentForwardRef() {
  const animatedRef = useAnimatedRef<React.Component<ViewProps>>();
  return <AnimatedFCWithRef ref={animatedRef} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    height: 50,
    backgroundColor: 'blue',
  },
});

/**
 * Reanimated 2 Functions
 */

// makeMutable
function MakeMutableTest() {
  const mut = makeMutable(0);
  const mut2 = makeMutable(true);

  return <Animated.View style={styles.container} />;
}

/**
 * Reanimated 2 Hooks
 */

// useSharedValue
function SharedValueTest() {
  const translate = useSharedValue(0);
  const translate2 = useSharedValue(0);
  const translate3 = useSharedValue(0);

  const sharedBool = useSharedValue<boolean>(false);
  if (sharedBool.value) {
    sharedBool.value = false;
  }

  return <Animated.View style={styles.container} />;
}

// useAnimatedStyle
function AnimatedStyleTest() {
  const width = useSharedValue(50);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });
  return <Animated.View style={[styles.box, animatedStyle]} />;
}

// useAnimatedStyle with arrays (invalid return)
function AnimatedStyleArrayTest() {
  const width = useSharedValue(50);
  // @ts-expect-error since the animated style cannot be an array.
  const animatedStyle = useAnimatedStyle(() => {
    return [styles.box, { width: width.value }];
  });
  return <Animated.View style={[styles.box, animatedStyle]} />;
}

// useAnimatedStyle with null (invalid return)
function AnimatedStyleNullTest() {
  const width = useSharedValue(50);
  // @ts-expect-error since the animated style cannot be "false".
  const animatedStyle = useAnimatedStyle(() => false);
  return <Animated.View style={[styles.box, animatedStyle]} />;
}

// useAnimatedStyle with number (invalid return)
function AnimatedStyleNumberTest() {
  const width = useSharedValue(50);
  // @ts-expect-error since the animated style cannot be a number.
  const animatedStyle = useAnimatedStyle(() => 5);
  return <Animated.View style={[styles.box, animatedStyle]} />;
}

// useDerivedValue
function DerivedValueTest() {
  const progress = useSharedValue(0);
  const width = useDerivedValue(() => {
    return progress.value * 250;
  });
  // @ts-expect-error width is readonly
  width.value = 100;
  return (
    <Button title="Random" onPress={() => (progress.value = Math.random())} />
  );
}

// useAnimatedScrollHandler
function AnimatedScrollHandlerTest() {
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });
  const stylez = useAnimatedStyle(() => {
    return {
      color: 'red',
      backgroundColor: 0x00ff00,
      transform: [
        {
          translateY: translationY.value,
        },
        {
          rotate: `${Math.PI}rad`,
        },
      ],
    };
  });
  // @ts-expect-error Valid rotation is a string (either radians or degrees)
  const style2 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: Math.PI,
        },
      ],
    };
  });
  // @ts-expect-error color cannot be an object
  const style3 = useAnimatedStyle(() => {
    return {
      color: {},
    };
  });
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, stylez]} />
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} />
    </View>
  );
}

// useAnimatedGestureHandler with context
function AnimatedGestureHandlerTest() {
  const x = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: (_) => {
      x.value = 0;
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}

function AnimatedPinchGestureHandlerTest() {
  const x = useSharedValue(0);
  const gestureHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: (event) => {
        x.value = event.scale;
      },
      onEnd: () => {
        x.value = withTiming(1);
      },
    });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: x.value,
        },
      ],
    };
  });
  return (
    <PinchGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PinchGestureHandler>
  );
}

/**
 * Reanimated 2 Animations
 */

// withTiming
function WithTimingTest() {
  const width = useSharedValue(50);
  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(
        width.value,
        {
          duration: 500,
          easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
        },
        (finished) => {}
      ),
    };
  });
  return (
    <View>
      <Animated.View style={[styles.box, style]} />
      <Button onPress={() => (width.value = Math.random() * 300)} title="Hey" />
    </View>
  );
}

function WithTimingToValueAsColorTest() {
  const style = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        'rgba(255,105,180,0)',
        {
          duration: 500,
          easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
        },
        (_finished) => {}
      ),
    };
  });
  return (
    <View>
      <Animated.View style={[styles.box, style]} />
    </View>
  );
}

// withSpring
function WithSpringTest() {
  const x = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx: { startX: number }) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: (_) => {
      x.value = withSpring(0, {}, (finished) => {});
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}

function WithSpringToValueAsColorTest() {
  const style = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring('rgba(255,105,180,0)', {}, (_finished) => {}),
    };
  });
  return (
    <View>
      <Animated.View style={[styles.box, style]} />
    </View>
  );
}

// cancelAnimation
function CancelAnimationTest() {
  const x = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      cancelAnimation(x);
    },
    onActive: (event, ctx: { startX: number }) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: (_) => {
      x.value = 0;
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}

// withDelay
function WithDelayTest() {
  const x = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, _ctx) => {
      cancelAnimation(x);
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: (_) => {
      x.value = withDelay(1000, withTiming(70));
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}

// withRepeat
function WithRepeatTest() {
  const x = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, _ctx) => {
      cancelAnimation(x);
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: (_) => {
      x.value = withRepeat(withTiming(70), 1, true, (finished) => {});
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}

// withSequence
function WithSequenceTest() {
  const x = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, _ctx) => {
      cancelAnimation(x);
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: (_) => {
      x.value = withSequence(withTiming(70), withTiming(70));
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}

// withDecay
function WithDecayTest() {
  const x = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx: { startX: number }) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: (evt) => {
      x.value = withDecay({
        velocity: evt.velocityX,
        clamp: [0, 200],
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}

// useWorkletCallback
function UseWorkletCallbackTest() {
  const workletCallback = useWorkletCallback((a: number, b: number) => {
    return a + b;
  }, []);

  runOnUI(() => {
    const res = workletCallback(1, 1);

    console.log(res);
  })();

  return <Animated.View style={styles.container} />;
}

// useWorkletCallback
function UseAnimatedReactionTest() {
  const [state, setState] = useState();
  const sv = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return sv.value;
    },
    (value) => {
      console.log(value);
    }
  );

  useAnimatedReaction(
    () => {
      return sv.value;
    },
    (value) => {
      console.log(value);
    },
    []
  );

  useAnimatedReaction(
    () => {
      return sv.value;
    },
    (value) => {
      console.log(value);
    },
    [state]
  );

  useAnimatedReaction(
    () => {
      return sv.value;
    },
    (value, previousResult) => {
      console.log(value, previousResult);
    }
  );

  return null;
}

// interpolateColor
function interpolateColorTest() {
  const sv = useSharedValue(0);

  interpolateColor(sv.value, [0, 1], [0x00ff00, 0x0000ff]);
  interpolateColor(sv.value, [0, 1], ['red', 'blue']);
  interpolateColor(sv.value, [0, 1], ['#00FF00', '#0000FF'], 'RGB');
  interpolateColor(sv.value, [0, 1], ['#FF0000', '#00FF99'], 'HSV');

  return null;
}

// update props
function updatePropsTest() {
  const adapter1 = createAnimatedPropAdapter((props) => {}, []);
  const adapter2 = createAnimatedPropAdapter((props) => {}, ['prop1', 'prop2']);
  const adapter3 = createAnimatedPropAdapter(() => {});

  // @ts-expect-error works only for useAnimatedProps
  useAnimatedStyle(() => ({}), undefined, [adapter1, adapter2, adapter3]);

  // THIS SHOULD BE FIXED SOON
  useAnimatedProps(() => ({}), null, adapter1);

  // THIS SHOULD BE FIXED SOON
  useAnimatedProps(() => ({}), null, [adapter2, adapter3]);
}

// test partial animated props
function testPartialAnimatedProps() {
  const ap = useAnimatedProps<ImageProps>(() => ({
    borderRadius: 100,
  }));
  const aps = useAnimatedProps<ImageProps>(() => ({
    source: { uri: 'whatever' },
  }));

  // should pass because source is set
  const test1 = <AnimatedImage source={{ uri: 'whatever' }} />;

  // should pass because source is set and `animatedProps` doesn't change that
  const test2 = (
    <AnimatedImage source={{ uri: 'whatever' }} animatedProps={ap} />
  );

  // @ts-expect-error This is a correct usage but it doesn't pass
  // and seems tricky to make it work correctly
  // (I have tried and it's probably not worth the time at the moment).
  const test3 = <AnimatedImage animatedProps={aps} />;

  // should pass because source is set normally and in `animatedProps`
  const test4 = (
    <AnimatedImage source={{ uri: 'whatever' }} animatedProps={aps} />
  );

  /* 
    NativeMethods:
  */

  // test measure
  function testMeasure() {
    const animatedRef = useAnimatedRef<Animated.View>();
    measure(animatedRef);
    const plainRef = useRef<Animated.View>();
    // @ts-expect-error should only work for Animated refs?
    measure(plainRef);
  }

  // test dispatchCommand
  function testDispatchCommand() {
    const animatedRef = useAnimatedRef<Animated.View>();
    // TODO I don't know how to fix it at the moment
    dispatchCommand(animatedRef, 'command', [1, 2, 3]);
    const plainRef = useRef<Animated.View>();
    // @ts-expect-error should only work for Animated refs?
    dispatchCommand(plainRef, 'command', [1, 2, 3]);
    // @ts-expect-error args are not optional
    dispatchCommand(animatedRef, 'command');
  }

  // test scrollTo
  function testScrollTo() {
    const animatedRef = useAnimatedRef<Animated.ScrollView>();
    scrollTo(animatedRef, 0, 0, true);
    const plainRef = useRef<Animated.ScrollView>();
    // @ts-expect-error should only work for Animated refs
    scrollTo(plainRef, 0, 0, true);
    const animatedViewRef = useAnimatedRef<Animated.View>();
  }

  // test setGestureState
  function testSetGestureState() {
    setGestureState(1, 2);
    // not sure what more I can test here
  }

  // test InlineStyles

  function testInlineStyles1() {
    const animatedIndex = useSharedValue(0);
    const backgroundColor = useDerivedValue(() => {
      return interpolateColor(
        animatedIndex.value,
        [0, 1, 2],
        ['#273D3A', '#8B645C', '#60545A']
      );
    });
    <Animated.View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor,
      }}
    />;
  }

  function testInlineStyles2() {
    const animatedFlex = useSharedValue(0);
    <Animated.View
      style={{
        flex: animatedFlex,
        height: '100%',
      }}
    />;
  }
}
