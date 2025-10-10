import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface PlaceholderImageProps {
  category: string;
  name: string;
  style?: any;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
  category, 
  name, 
  style 
}) => {
  const getGradientColors = (category: string) => {
    switch (category) {
      case 'tourism':
        return ['#3B82F6', '#1D4ED8'];
      case 'culinary':
        return ['#EF4444', '#DC2626'];
      case 'hotels':
        return ['#10B981', '#059669'];
      case 'events':
        return ['#F59E0B', '#D97706'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'tourism':
        return '🏔️';
      case 'culinary':
        return '🍜';
      case 'hotels':
        return '🏨';
      case 'events':
        return '🎉';
      default:
        return '📍';
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors(category)}
      style={[styles.container, style]}
    >
      <Text style={styles.icon}>{getIcon(category)}</Text>
      <Text style={styles.text} numberOfLines={2}>
        {name}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

