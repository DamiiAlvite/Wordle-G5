import React from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions, Text} from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { Shadow } from 'react-native-shadow-2'
import { useTheme } from '@/context/themeContext'


const TABS = [
  { name: 'Lunfardo', icon: 'book-variant', label: 'slangMode', iconLib: 'MaterialCommunityIcons' },
  { name: 'Clásico', icon: 'grid', label: 'classicMode', iconLib: 'MaterialCommunityIcons' },
  { name: 'Contrarreloj', icon: 'timer-outline', label: 'timeTrialMode', iconLib: 'Ionicons' }
]

export default function GameModeTabBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()

  const renderIcon = (tab: typeof TABS[0], isActive: boolean) => {
    const iconColor = isActive ? theme.colors.primary : theme.colors.textSecondary
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
      <View style={[styles.tabBar, { backgroundColor: theme.colors.card }]}>
          {TABS.map((tab) => {
            const isActive = pathname.includes(tab.label)
            return (
              <TouchableOpacity
                key={tab.name}
                style={[
                  styles.tab,
                  isActive && [styles.activeTab, { backgroundColor: theme.colors.primary + '20' }]
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
                  { color: theme.colors.textSecondary },
                  isActive && [styles.activeLabel, { color: theme.colors.primary }]
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
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
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
  },
  iconContainer: {
    marginBottom: 4,
    padding: 2,
  },
  activeIconContainer: {
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    fontWeight: '600',
  },
})