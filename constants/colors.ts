export const Colors = {
  light: {
    primary: '#6366F1', // Indigo
    primaryDark: '#4F46E5',
    secondary: '#EC4899', // Pink
    accent: '#10B981', // Emerald
    background: '#F8FAFC',
    surface: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradient: {
      primary: ['#6366F1', '#8B5CF6'],
      secondary: ['#EC4899', '#F97316'],
      accent: ['#10B981', '#059669'],
      hero: ['#667EEA', '#764BA2'],
    },
  },
  dark: {
    primary: '#818CF8',
    primaryDark: '#6366F1',
    secondary: '#F472B6',
    accent: '#34D399',
    background: '#111827',
    surface: '#1F2937',
    card: '#374151',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    border: '#4B5563',
    borderLight: '#374151',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    gradient: {
      primary: ['#818CF8', '#A78BFA'],
      secondary: ['#F472B6', '#FB923C'],
      accent: ['#34D399', '#10B981'],
      hero: ['#667EEA', '#764BA2'],
    },
  },
};

export const getColors = (isDark: boolean) => isDark ? Colors.dark : Colors.light;

