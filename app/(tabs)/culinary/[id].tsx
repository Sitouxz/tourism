import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { LocationRow } from '@/components/ui/LocationRow';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getColors } from '@/constants/colors';
import { useAppStore } from '@/lib/store';
import { Item } from '@/types';

export default function CulinaryDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data, isFavorite, toggleFavorite, getNearbyItems } = useAppStore();
  const [item, setItem] = useState<Item | null>(null);
  const [nearbyItems, setNearbyItems] = useState<Item[]>([]);

  useEffect(() => {
    if (id && data.culinary) {
      const foundItem = data.culinary.find(item => item.id === id);
      if (foundItem) {
        setItem(foundItem);
        const nearby = getNearbyItems(foundItem, 'culinary');
        setNearbyItems(nearby);
      }
    }
  }, [id, data]);

  const handleOpenMaps = () => {
    if (item) {
      const url = `https://maps.google.com/maps?q=${item.latitude},${item.longitude}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Could not open maps');
      });
    }
  };

  const handleToggleFavorite = () => {
    if (item) {
      toggleFavorite(item.id);
    }
  };

  const handleNearbyPress = (itemId: string) => {
    router.push(`/culinary/${itemId}`);
  };

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Item not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>🍽️</Text>
        <View style={styles.ratingOverlay}>
          <RatingBadge rating={item.rating} size="medium" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            {item.name}
          </Text>
          <LocationRow district={item.district} />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleOpenMaps}
          >
            <Ionicons name="map" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Open in Maps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: isFavorite(item.id) ? colors.error : colors.surface,
                borderWidth: 1,
                borderColor: isFavorite(item.id) ? colors.error : colors.border,
              }
            ]}
            onPress={handleToggleFavorite}
          >
            <Ionicons 
              name={isFavorite(item.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite(item.id) ? "#FFFFFF" : colors.text} 
            />
            <Text style={[
              styles.actionButtonText,
              { color: isFavorite(item.id) ? "#FFFFFF" : colors.text }
            ]}>
              {isFavorite(item.id) ? "Favorited" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>

        {item.operatingHours && (
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Operating Hours
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {item.operatingHours}
            </Text>
          </View>
        )}

        {item.priceRange && (
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Price Range
            </Text>
            <Text style={[styles.priceText, { color: colors.accent }]}>
              {item.priceRange}
            </Text>
          </View>
        )}

        {nearbyItems.length > 0 && (
          <View style={styles.detailsSection}>
            <SectionTitle title="Nearby Restaurants" />
            {nearbyItems.map((nearbyItem) => (
              <TouchableOpacity
                key={nearbyItem.id}
                style={[styles.nearbyItem, { backgroundColor: colors.card }]}
                onPress={() => handleNearbyPress(nearbyItem.id)}
              >
                <View style={styles.nearbyContent}>
                  <Text style={[styles.nearbyTitle, { color: colors.text }]}>
                    {nearbyItem.name}
                  </Text>
                  <LocationRow district={nearbyItem.district} size="small" />
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imagePlaceholder: {
    fontSize: 64,
  },
  ratingOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  nearbyContent: {
    flex: 1,
  },
  nearbyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

