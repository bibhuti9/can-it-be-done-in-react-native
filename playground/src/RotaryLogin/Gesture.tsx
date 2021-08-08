import React from "react";
import { StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { canvas2Polar } from "react-native-redash";

import { center, RADIUS } from "./Quadrant";

const TAU = Math.PI * 2;

const normalize = (value: number) => {
  "worklet";
  const rest = value % TAU;
  return rest > 0 ? rest : TAU + rest;
};

const SIZE = RADIUS * 2;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  quadrant: {
    width: SIZE,
    height: SIZE,
  },
});

interface GestureProps {
  theta: Animated.SharedValue<number>;
}

const Gesture = ({ theta }: GestureProps) => {
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offset: number }
  >({
    onStart: (_, ctx) => {
      ctx.offset = theta.value;
    },
    onActive: ({ x, y }, ctx) => {
      const { theta: alpha } = canvas2Polar({ x, y }, { x: RADIUS, y: RADIUS });
      const delta = alpha - ctx.offset;
      theta.value = normalize(theta.value + delta);
      ctx.offset = alpha;
    },
    onEnd: () => {
      theta.value = withSpring(0);
    },
  });
  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={styles.quadrant} />
      </PanGestureHandler>
    </View>
  );
};

export default Gesture;