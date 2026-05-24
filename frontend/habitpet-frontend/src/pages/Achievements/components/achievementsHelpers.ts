import {
  Spa,
  DirectionsWalk,
  SelfImprovement,
  Psychology,
  AllInclusive,
  Shield,
  Security,
  Brightness5,
  WorkspacePremium,
  FilterHdr,
  Restaurant,
  LocalDining,
  SportsEsports,
  Favorite,
  FavoriteBorder,
  CalendarToday,
  DateRange,
  EventAvailable,
  TrendingUp,
  AutoAwesome,
} from '@mui/icons-material';

export const iconMap: Record<string, React.ComponentType<any>> = {
  spa: Spa,
  directions_walk: DirectionsWalk,
  self_improvement: SelfImprovement,
  psychology: Psychology,
  all_inclusive: AllInclusive,
  shield: Shield,
  security: Security,
  brightness_5: Brightness5,
  workspace_premium: WorkspacePremium,
  filter_hdr: FilterHdr,
  restaurant: Restaurant,
  local_dining: LocalDining,
  sports_esports: SportsEsports,
  favorite: Favorite,
  favorite_border: FavoriteBorder,
  calendar_today: CalendarToday,
  date_range: DateRange,
  event_available: EventAvailable,
  trending_up: TrendingUp,
  auto_awesome: AutoAwesome,
};

export const getDifficultyStyle = (rarity: string) => {
  switch (rarity) {
    case 'Very Easy':
      return { border: '#eae6df', text: '#7c766b', label: 'Very Easy' };
    case 'Easy':
      return { border: '#ffd1a7', text: '#ff8624', label: 'Easy' };
    case 'Medium':
      return { border: '#437F70', text: '#437F70', label: 'Medium' };
    case 'Hard':
      return { border: '#c59265', text: '#c59265', label: 'Hard' };
    case 'Super Hard':
      return { border: '#d71920', text: '#d71920', label: 'Super Hard' };
    default:
      return { border: '#e6e3dd', text: '#4A6070', label: rarity };
  }
};

export const difficultyOrder: Record<string, number> = {
  'Very Easy': 1,
  'Easy': 2,
  'Medium': 3,
  'Hard': 4,
  'Super Hard': 5,
};

export const formatUnlockDate = (dateStr: string | null) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
