/**
 * Layout Animation Demo Component
 * 
 * Demonstrates layout animation patterns including:
 * - List item additions and removals with staggered animations
 * - Dynamic layout changes with smooth transitions
 * - Grid layout animations
 * - Accordion-style expand/collapse animations
 */

import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Layout,
  FadeInDown,
  FadeOutUp,
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
  LayoutAnimationConfig,
} from 'react-native-reanimated';

import { Box } from '../../base/Box';
import { Text } from '../../base/Text';
import { Button } from '../../form/Button';
import { Card } from '../../layout/Card';
import { useCurrentTheme } from '../../../theme';
import { LAYOUT_ANIMATION, SPRING_CONFIG, ANIMATION_DURATION } from '../constants';

interface LayoutAnimationDemoProps {
  title?: string;
}

interface ListItem {
  id: number;
  title: string;
  color: string;
}

interface AccordionItem {
  id: number;
  title: string;
  content: string;
  expanded: boolean;
}

const AnimatedListDemo: React.FC = () => {
  const theme = useCurrentTheme();
  const [items, setItems] = useState<ListItem[]>([
    { id: 1, title: 'First Item', color: theme.colors.colors.primary[500] },
    { id: 2, title: 'Second Item', color: theme.colors.colors.secondary[500] },
    { id: 3, title: 'Third Item', color: theme.colors.colors.success[500] },
  ]);
  const [nextId, setNextId] = useState(4);

  const colors = [
    theme.colors.colors.primary[500],
    theme.colors.colors.secondary[500],
    theme.colors.colors.success[500],
    theme.colors.colors.warning[500],
    theme.colors.colors.error[500],
  ];

  const addItem = () => {
    const newItem: ListItem = {
      id: nextId,
      title: `Item ${nextId}`,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setItems(prev => [...prev, newItem]);
    setNextId(prev => prev + 1);
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const shuffleItems = () => {
    setItems(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  return (
    <LayoutAnimationConfig skipEntering>
      <Box style={styles.listDemo}>
        <Box style={styles.listControls}>
          <Button onPress={addItem} variant="primary" size="small" style={styles.controlButton}>
            Add Item
          </Button>
          <Button onPress={shuffleItems} variant="secondary" size="small" style={styles.controlButton}>
            Shuffle
          </Button>
        </Box>
        
        <Box style={styles.animatedList}>
          {items.map((item) => (
            <Animated.View
              key={item.id}
              entering={FadeInRight.delay(LAYOUT_ANIMATION.STAGGER_DELAY).springify()}
              exiting={FadeOutLeft.duration(LAYOUT_ANIMATION.EXIT_DURATION)}
              layout={LinearTransition.springify().damping(15)}
            >
              <Card padding="md" style={[styles.listItem, { borderLeftColor: item.color }]}>
                <Box style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                  <Button
                    onPress={() => removeItem(item.id)}
                    variant="ghost"
                    size="small"
                    style={styles.removeButton}
                  >
                    ✕
                  </Button>
                </Box>
              </Card>
            </Animated.View>
          ))}
        </Box>
      </Box>
    </LayoutAnimationConfig>
  );
};

const GridLayoutDemo: React.FC = () => {
  const theme = useCurrentTheme();
  const [gridItems, setGridItems] = useState<ListItem[]>(
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      title: `Grid ${i + 1}`,
      color: theme.colors.colors.primary[400 + (i % 3) * 100],
    }))
  );
  const [isGrid, setIsGrid] = useState(true);

  const toggleLayout = () => {
    setIsGrid(prev => !prev);
  };

  const addGridItem = () => {
    const newItem: ListItem = {
      id: Math.max(...gridItems.map(item => item.id)) + 1,
      title: `Grid ${gridItems.length + 1}`,
      color: theme.colors.colors.secondary[500],
    };
    setGridItems(prev => [...prev, newItem]);
  };

  const removeGridItem = (id: number) => {
    setGridItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <LayoutAnimationConfig skipEntering>
      <Box style={styles.gridDemo}>
        <Box style={styles.listControls}>
          <Button
            onPress={toggleLayout}
            variant="primary"
            size="small"
            style={styles.controlButton}
          >
            {isGrid ? 'List View' : 'Grid View'}
          </Button>
          <Button
            onPress={addGridItem}
            variant="secondary"
            size="small"
            style={styles.controlButton}
          >
            Add
          </Button>
        </Box>
        
        <Animated.View
          style={[
            styles.gridContainer,
            isGrid ? styles.gridLayout : styles.listLayout,
          ]}
          layout={LinearTransition.springify().damping(15)}
        >
          {gridItems.map((item) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(LAYOUT_ANIMATION.STAGGER_DELAY).springify()}
              exiting={FadeOutUp.duration(LAYOUT_ANIMATION.EXIT_DURATION)}
              layout={LinearTransition.springify().damping(15)}
              style={isGrid ? styles.gridItemContainer : styles.listItemContainer}
            >
              <Card
                padding="md"
                style={[
                  styles.gridItem,
                  { backgroundColor: item.color },
                  isGrid ? styles.gridItemStyle : styles.listItemStyle,
                ]}
              >
                <Text style={styles.gridItemTitle}>{item.title}</Text>
                <Button
                  onPress={() => removeGridItem(item.id)}
                  variant="ghost"
                  size="small"
                  style={styles.gridRemoveButton}
                >
                  ✕
                </Button>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>
      </Box>
    </LayoutAnimationConfig>
  );
};

const AccordionDemo: React.FC = () => {
  const theme = useCurrentTheme();
  const [accordionItems, setAccordionItems] = useState<AccordionItem[]>([
    {
      id: 1,
      title: 'What are layout animations?',
      content: 'Layout animations automatically animate changes to component size, position, and other layout properties when they change.',
      expanded: false,
    },
    {
      id: 2,
      title: 'How do they work?',
      content: 'React Native Reanimated provides layout animations that run on the UI thread for smooth 60fps animations during layout changes.',
      expanded: false,
    },
    {
      id: 3,
      title: 'When to use them?',
      content: 'Use layout animations for dynamic content, expanding/collapsing sections, list modifications, and any time content size changes.',
      expanded: false,
    },
  ]);

  const toggleAccordionItem = (id: number) => {
    setAccordionItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const AccordionItem: React.FC<{ item: AccordionItem }> = ({ item }) => {
    const height = useSharedValue(item.expanded ? 'auto' : 0);
    const opacity = useSharedValue(item.expanded ? 1 : 0);

    const animatedStyle = useAnimatedStyle(() => ({
      height: height.value,
      opacity: opacity.value,
    }));

    React.useEffect(() => {
      if (item.expanded) {
        height.value = withSpring('auto', SPRING_CONFIG.GENTLE);
        opacity.value = withTiming(1, { duration: ANIMATION_DURATION.NORMAL });
      } else {
        height.value = withSpring(0, SPRING_CONFIG.GENTLE);
        opacity.value = withTiming(0, { duration: ANIMATION_DURATION.FAST });
      }
    }, [item.expanded]);

    return (
      <Animated.View
        layout={LinearTransition.springify().damping(15)}
        style={styles.accordionItem}
      >
        <Button
          onPress={() => toggleAccordionItem(item.id)}
          variant="ghost"
          style={[
            styles.accordionHeader,
            { backgroundColor: theme.colors.background.secondary }
          ]}
        >
          <Box style={styles.accordionHeaderContent}>
            <Text style={styles.accordionTitle}>{item.title}</Text>
            <Text style={styles.accordionIcon}>
              {item.expanded ? '−' : '+'}
            </Text>
          </Box>
        </Button>
        
        <Animated.View style={[styles.accordionContent, animatedStyle]}>
          <Text style={[styles.accordionText, { color: theme.colors.text.secondary }]}>
            {item.content}
          </Text>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <Box style={styles.accordionDemo}>
      {accordionItems.map((item) => (
        <AccordionItem key={item.id} item={item} />
      ))}
    </Box>
  );
};

const DynamicSizeDemo: React.FC = () => {
  const theme = useCurrentTheme();
  const [boxSize, setBoxSize] = useState(100);
  const [isCircle, setIsCircle] = useState(false);

  const sizes = [60, 100, 140, 180];
  const currentIndex = sizes.indexOf(boxSize);

  const cycleSizes = () => {
    const nextIndex = (currentIndex + 1) % sizes.length;
    setBoxSize(sizes[nextIndex]);
  };

  const toggleShape = () => {
    setIsCircle(prev => !prev);
  };

  return (
    <LayoutAnimationConfig skipEntering>
      <Box style={styles.sizeDemo}>
        <Box style={styles.listControls}>
          <Button onPress={cycleSizes} variant="primary" size="small" style={styles.controlButton}>
            Change Size
          </Button>
          <Button onPress={toggleShape} variant="secondary" size="small" style={styles.controlButton}>
            {isCircle ? 'Square' : 'Circle'}
          </Button>
        </Box>
        
        <Box style={styles.sizeContainer}>
          <Animated.View
            layout={LinearTransition.springify().damping(15)}
            style={[
              styles.dynamicBox,
              {
                width: boxSize,
                height: boxSize,
                borderRadius: isCircle ? boxSize / 2 : 12,
                backgroundColor: theme.colors.colors.primary[500],
              },
            ]}
          >
            <Text style={styles.boxText}>
              {boxSize}×{boxSize}
            </Text>
          </Animated.View>
        </Box>
        
        <Text variant="caption" style={[styles.sizeInfo, { color: theme.colors.text.secondary }]}>
          Size: {boxSize}px | Shape: {isCircle ? 'Circle' : 'Square'}
        </Text>
      </Box>
    </LayoutAnimationConfig>
  );
};

export const LayoutAnimationDemo: React.FC<LayoutAnimationDemoProps> = ({
  title = "Layout Animation Patterns",
}) => {
  const theme = useCurrentTheme();

  return (
    <ScrollView style={styles.container}>
      <Box padding="lg">
        <Text variant="heading" size="large" style={styles.title}>
          {title}
        </Text>
        
        <Text variant="body" size="medium" style={[styles.description, { color: theme.colors.text.secondary }]}>
          Layout animations provide smooth transitions when component dimensions, positions, or arrangements change.
        </Text>

        <Box style={styles.section}>
          <Text variant="heading" size="medium" style={styles.sectionTitle}>
            Animated List Operations
          </Text>
          <Text variant="body" size="small" style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
            Adding, removing, and reordering items with smooth animations
          </Text>
          <AnimatedListDemo />
        </Box>

        <Box style={styles.section}>
          <Text variant="heading" size="medium" style={styles.sectionTitle}>
            Dynamic Layout Changes
          </Text>
          <Text variant="body" size="small" style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
            Switching between grid and list layouts
          </Text>
          <GridLayoutDemo />
        </Box>

        <Box style={styles.section}>
          <Text variant="heading" size="medium" style={styles.sectionTitle}>
            Accordion Expand/Collapse
          </Text>
          <Text variant="body" size="small" style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
            Smooth height animations for collapsible content
          </Text>
          <AccordionDemo />
        </Box>

        <Box style={styles.section}>
          <Text variant="heading" size="medium" style={styles.sectionTitle}>
            Dynamic Size Changes
          </Text>
          <Text variant="body" size="small" style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
            Animating size and shape transformations
          </Text>
          <DynamicSizeDemo />
        </Box>

        <Text variant="caption" style={[styles.note, { color: theme.colors.text.tertiary }]}>
          Layout animations automatically handle complex layout changes while maintaining smooth 60fps performance.
        </Text>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  sectionSubtitle: {
    marginBottom: 16,
    lineHeight: 18,
  },
  listDemo: {
    marginTop: 8,
  },
  listControls: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  controlButton: {
    marginRight: 8,
  },
  animatedList: {
    gap: 8,
  },
  listItem: {
    borderLeftWidth: 4,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  removeButton: {
    paddingHorizontal: 8,
    minWidth: 32,
  },
  gridDemo: {
    marginTop: 8,
  },
  gridContainer: {
    flexWrap: 'wrap',
  },
  gridLayout: {
    flexDirection: 'row',
  },
  listLayout: {
    flexDirection: 'column',
  },
  gridItemContainer: {
    width: '48%',
    marginRight: '2%',
    marginBottom: 8,
  },
  listItemContainer: {
    width: '100%',
    marginBottom: 8,
  },
  gridItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemStyle: {
    height: 80,
  },
  listItemStyle: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  gridItemTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  gridRemoveButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    minHeight: 24,
    paddingHorizontal: 0,
  },
  accordionDemo: {
    marginTop: 8,
  },
  accordionItem: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  accordionHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'left',
  },
  accordionIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  accordionContent: {
    overflow: 'hidden',
  },
  accordionText: {
    padding: 16,
    lineHeight: 20,
  },
  sizeDemo: {
    marginTop: 8,
    alignItems: 'center',
  },
  sizeContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  dynamicBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sizeInfo: {
    textAlign: 'center',
    fontWeight: '500',
  },
  note: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
});