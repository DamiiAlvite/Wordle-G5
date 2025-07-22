import React from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions, Text} from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { Shadow } from 'react-native-shadow-2'


const TABS = [
  { name: 'Lunfardo', icon: 'book-variant', label: 'slangMode', iconLib: 'MaterialCommunityIcons' },
  { name: 'Clásico', icon: 'grid', label: 'classicMode', iconLib: 'MaterialCommunityIcons' },
  { name: 'Contrarreloj', icon: 'timer-outline', label: 'trialTimeMode', iconLib: 'Ionicons' }
]

export default function GameModeTabBar() {
  const router = useRouter()
  const pathname = usePathname()

  const renderIcon = (tab: typeof TABS[0], isActive: boolean) => {
    const iconColor = isActive ? '#5792EE' : '#9ca3af'
    const iconSize = 24
    
    if (tab.iconLib === 'MaterialCommunityIcons') {
      return (
        <MaterialCommunityIcons 
          name={tab.icon as any} 
          size={iconSize} 
          color={iconColor} 
        />
      )
    } else {
      return (
        <Ionicons 
          name={tab.icon as any} 
          size={iconSize} 
          color={iconColor} 
        />
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = pathname.includes(tab.label)
            return (
              <TouchableOpacity
                key={tab.name}
                style={[
                  styles.tab,
                  isActive && styles.activeTab
                ]}
                onPress={() => router.replace(`/(drawer)/(tabs)/${tab.label}`)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer
                ]}>
                  {renderIcon(tab, isActive)}
                </View>
                <Text style={[
                  styles.label,
                  isActive && styles.activeLabel
                ]}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(87, 146, 238, 0.1)',
  },
  iconContainer: {
    marginBottom: 4,
    padding: 2,
  },
  activeIconContainer: {
    // Additional styling for active icon if needed
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#5792EE',
    fontWeight: '600',
  },
})