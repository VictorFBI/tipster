import { useState } from "react";
import {
  Image,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const DEFAULT_HEIGHT = 250;

interface ImageSliderProps {
  images: string[];
  /** Height of each image in the slider (default: 250) */
  height?: number;
}

/** Horizontal image slider with page indicator dots */
export function ImageSlider({
  images,
  height = DEFAULT_HEIGHT,
}: ImageSliderProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (containerWidth === 0) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / containerWidth);
    setActiveIndex(index);
  };

  return (
    <View
      style={{ marginTop: 8 }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={containerWidth}
          snapToAlignment="start"
          disableIntervalMomentum
        >
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={{
                width: containerWidth,
                height,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* Page indicator dots */}
      {images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 8,
            gap: 6,
          }}
        >
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === activeIndex ? 8 : 6,
                height: index === activeIndex ? 8 : 6,
                borderRadius: index === activeIndex ? 4 : 3,
                backgroundColor:
                  index === activeIndex
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
