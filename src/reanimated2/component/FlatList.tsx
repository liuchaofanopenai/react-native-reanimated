import type { ForwardedRef } from 'react';
import React, { Component, forwardRef } from 'react';
import type { FlatListProps, LayoutChangeEvent } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import { AnimatedView } from './View';
import createAnimatedComponent from '../../createAnimatedComponent';
import type { ILayoutAnimationBuilder } from '../layoutReanimation/animationBuilder/commonTypes';
import type { StyleProps } from '../commonTypes';
import type { AnimateProps } from '../helperTypes';

const AnimatedFlatList = createAnimatedComponent(FlatList as any) as any;

interface AnimatedFlatListProps {
  onLayout: (event: LayoutChangeEvent) => void;
  // implicit `children` prop has been removed in @types/react^18.0.0
  children: React.ReactNode;
  inverted?: boolean;
  horizontal?: boolean;
}

const createCellRenderer = (
  itemLayoutAnimation?: ILayoutAnimationBuilder,
  cellStyle?: StyleProps
) => {
  const cellRenderer = (props: AnimatedFlatListProps) => {
    return (
      <AnimatedView
        // TODO TYPESCRIPT This is temporary cast is to get rid of .d.ts file.
        layout={itemLayoutAnimation as any}
        onLayout={props.onLayout}
        style={cellStyle}>
        {props.children}
      </AnimatedView>
    );
  };

  return cellRenderer;
};

interface ReanimatedFlatListPropsWithLayout<T> extends FlatListProps<T> {
  itemLayoutAnimation?: ILayoutAnimationBuilder;
}

// TODO TYPESCRIPT This is a temporary type to get rid of .d.ts file.
declare class ReanimatedFlatListClass<T> extends Component<
  AnimateProps<ReanimatedFlatListPropsWithLayout<T>>
> {
  getNode(): FlatList;
}

export interface ReanimatedFlatListProps<ItemT> extends FlatListProps<ItemT> {
  itemLayoutAnimation?: ILayoutAnimationBuilder;
}

export const ReanimatedFlatList = forwardRef(
  (props: ReanimatedFlatListProps<any>, ref: ForwardedRef<FlatList>) => {
    const { itemLayoutAnimation, ...restProps } = props;

    const cellStyle = restProps?.inverted
      ? restProps?.horizontal
        ? styles.horizontallyInverted
        : styles.verticallyInverted
      : undefined;

    const cellRenderer = React.useMemo(
      () => createCellRenderer(itemLayoutAnimation, cellStyle),
      [cellStyle]
    );

    return (
      <AnimatedFlatList
        ref={ref}
        {...restProps}
        CellRendererComponent={cellRenderer}
      />
    );
  }
  // TODO TYPESCRIPT this was a cast before
  // ) as <T>(
  //   props: ReanimatedFlatListProps<T> & RefAttributes<FlatList<any>>
  // ) => React.ReactElement;
);

const styles = StyleSheet.create({
  verticallyInverted: { transform: [{ scaleY: -1 }] },
  horizontallyInverted: { transform: [{ scaleX: -1 }] },
});

export type ReanimatedFlatList<T> = typeof ReanimatedFlatListClass<T> &
  FlatList<T>;
