import type { ComponentType } from 'react';
import {
  Heart,
  Sparkles,
  Music2,
  Star,
  Sun,
  Coffee,
  MapPin,
  Laugh,
  Baby,
  Gift,
  Camera,
  Moon,
  Navigation,
} from 'lucide-react';

export const person = {
  name: 'Aanya',
  nickname: 'Aanyaaa',
  birthday: new Date(new Date().getFullYear() + (new Date() > new Date(new Date().getFullYear(), 9, 16) ? 1 : 0), 9, 16, 9, 0, 0).toISOString(),
  birthDateDisplay: '16th October',
  age: 24,
  fromYou: 'yours, always — Akhil',
};

export const heroImage =
  'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&h=1200&w=2000';

export const wishes: { icon: ComponentType<{ className?: string }>; title: string; body: string }[] = [
  {
    icon: Sun,
    title: 'You\'re full of life, excitement, love, curiosity, and care',
    body: 'Aanyaaa, you\'re literally full of life — that excitement, that curiosity about everything, the way you care about people without even trying. The more I know you, the more I want to know you. That\'s not supposed to make sense, but with you it does.',
  },
  {
    icon: Star,
    title: 'You make me want to explore life',
    body: 'Not just the big things — everything. You send me reels of places and food and couple stuff and somehow make all of it feel like something we\'re already doing together. You make normal days feel like something worth waking up for.',
  },
  {
    icon: Heart,
    title: 'You listen to literally everything I wanna say',
    body: 'You said that\'s one of the things you love — that I listen to everything you want to say. But you do the same for me. All my random office stories, the uncle I gave my seat to on the bus, the release that didn\'t go through — you actually care about all of it.',
  },
  {
    icon: Laugh,
    title: 'The yapping. Especially the yapping.',
    body: 'You said you yap a lot and it might be bakwaas or a majboori. Mujhe toh aap aur aapki yapping behad pasand hai. Karta rahi kijiye. I could listen to you talk about nothing for hours and it would still be the best part of my day.',
  },
  {
    icon: Coffee,
    title: 'You make the little things feel like something',
    body: 'Sharing reels back and forth, discussing what\'s for dinner, the way you say "ikkkrrr" when something\'s relatable, the food feed that haunts you at night — all of it. You turn ordinary phone-screen moments into the stuff I actually look forward to.',
  },
  {
    icon: Moon,
    title: 'You let me into your world, all of it',
    body: 'The big things and the small. Your family, your friends, your worries about the future, the anxiety you feel when something new happens — you shared all of it with me. You don\'t have to go through anything alone, and you let me be the person who\'s there. That means everything.',
  },
];

export interface MemoryItem {
  src: string;
  type: 'image' | 'video';
  alt: string;
  caption: string;
  date: string;
  category: 'photos' | 'videos' | 'highlights';
}

export const memories: MemoryItem[] = [
  {
    src: '/images/gifts/story_begins.jpg',
    type: 'image',
    alt: 'Our first photo together.',
    caption: 'Where our story quietly began with your smile',
    date: 'Our First Meet',
    category: 'highlights',
  },
  {
    src: '/images/gifts/1000085438.mp4',
    type: 'video',
    alt: 'Video memory of Aanya',
    caption: 'That smile that always makes my day',
    date: 'Reel Moment',
    category: 'videos',
  },
  {
    src: '/images/gifts/1000087385.jpg',
    type: 'image',
    alt: 'Stunning portrait of Aanya',
    caption: 'Golden hour aesthetics & pure elegance',
    date: 'Golden Hour Vibe',
    category: 'photos',
  },
  {
    src: '/images/gifts/1000090640.mp4',
    type: 'video',
    alt: 'Video snapshot of Aanya',
    caption: 'Reels and little video clips we exchange',
    date: 'Our Thing',
    category: 'videos',
  },
  {
    src: '/images/gifts/1000087383.jpg',
    type: 'image',
    alt: 'Aanya smiling softly',
    caption: 'The prettiest little smile in the room',
    date: 'Pure Happiness',
    category: 'photos',
  },
  {
    src: '/images/gifts/1000090644.mp4',
    type: 'video',
    alt: 'Special reel memory of Aanya',
    caption: 'This one always makes me smile non-stop',
    date: 'Top Reel',
    category: 'videos',
  },
  {
    src: '/images/gifts/1000087377.jpg',
    type: 'image',
    alt: 'Candid photo of Aanya',
    caption: 'Unfiltered, candid, and naturally gorgeous',
    date: 'Candid Moment',
    category: 'photos',
  },
  {
    src: '/images/gifts/1000089005.mp4',
    type: 'video',
    alt: 'Short video clip of Aanya',
    caption: 'The way you laugh and talk — 100/10 energy',
    date: 'Live Reel',
    category: 'videos',
  },
  {
    src: '/images/gifts/1000087399.jpg',
    type: 'image',
    alt: 'Photo memory of Aanya',
    caption: 'Every time I look at this photo, I just smile',
    date: 'Sweet Memories',
    category: 'photos',
  },
  {
    src: '/images/gifts/1000090671.mp4',
    type: 'video',
    alt: 'Video reel memory',
    caption: 'Forever my favorite person to make memories with',
    date: 'Endless Love',
    category: 'videos',
  },
];

export const timeline: {
  date: string;
  title: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
    {
      date: '15th May 2026',
      title: 'Our first meet',
      body: 'You messaged it was nice meeting you and I took 3 hours to respond to that. And when I mentioned the next month how I always reply in minutes, you mentioned you didn\'t when we first messaged. Well baby gurl, I was thinking of the best thing to say and it took time — because you deserve the best thought out messages, and I hope we can continue this throughout.',
      icon: MapPin,
    },
    {
      date: 'The beginning',
      title: 'Our first long conversations',
      body: 'What started as casual messages turned into something neither of us expected. We talked about everything and nothing, and somewhere in between, you became the person I want to text first every single day.',
      icon: Sparkles,
    },
    {
      date: 'Our thing',
      title: 'The reels, the memes, the tag-her/him posts',
      body: 'We built our own little world through Instagram reels and memes. Couple card games, "tag your person" posts, funny relatable videos — every shared reel was a tiny way of saying "this is us."',
      icon: Camera,
    },
    {
      date: 'Those nights',
      title: 'The card games and deep questions',
      body: 'We did those flamingo card games where we answered questions about our future together. You told me you want equality and respect in a marriage, that you hate it when anyone shouts at you. I told you I\'d always listen, stay calm, and explain with love. We dreamed out loud together or dreamed out on texts visually together.',
      icon: Heart,
    },
    {
      date: 'The big talks',
      title: 'When we talked about our future',
      body: 'Kids, marriage, a winter wedding in Nov or Feb, a daughter, the way you want to raise them yourself, the way I said I\'d support you through all of it. You told me about your anxiety with new things, and I told you I\'d always be there. Nothing would go wrong — maybe a detour, but I\'d be there.',
      icon: Baby,
    },
    {
      date: 'Every single day',
      title: 'The "kya kha rhe ho?" and the good nights',
      body: 'Every evening: "what\'s for dinner?" Every night: "good nighttt, have a nicee sleep." Every morning: "Hiiiii good morning." The chai, the food feeds that torture you, the office stories, the bus rides, the video calls when you\'re sleepy. This is our routine, and I wouldn\'t trade it for anything.',
      icon: Coffee,
    },
    {
      date: 'Now',
      title: 'Bengaluru to Delhi — long distance',
      body: 'You moved to Delhi. Palam. And just like that, our map grew a whole new pin. Long distance is hard — the late calls, the missing, the not-knowing-when. But here\'s what I know: every flight booked, every "call you when I land" text, every night spent on video instead of next to you is worth it. The distance is temporary. Us is not. And one day, the map is going to have just one pin again.',
      icon: MapPin,
    },
    {
      date: 'Today',
      title: 'This little corner of the internet',
      body: 'Because a simple birthday message wasn\'t enough. Because you deserve more than a forwarded wish. So I built this — every word, every page, for you. Happy birthday, Aanyaaa.',
      icon: Star,
    },
  ];

export const quiz: {
  question: string;
  options: string[];
  answer: number;
  story: string;
}[] = [
    {
      question: 'What do I always tell you about knowing you?',
      options: [
        'The more I know you, the less I understand',
        'The more I know you, the more I want to know you',
        'I know you a little too much',
        'Knowing you is knowing myself',
      ],
      answer: 1,
      story: 'The more I know you, the more I want to know you. Doesn\'t make sense, but with you it does.',
    },
    {
      question: 'What did you say I do that you love?',
      options: [
        'You listen to literally everything I wanna say',
        'You always bring me food',
        'You send me reels first',
        'You always call me cute',
      ],
      answer: 0,
      story: 'You said it yourself — "that you literally listen to everything that I wanna say." And I always will.',
    },
    {
      question: 'What do I always tell you about your yapping?',
      options: [
        'It\'s too much, please stop',
        'Mujhe aap aur aapki yapping behad pasand hai',
        'I pretend to listen',
        'I save it all for later',
      ],
      answer: 1,
      story: 'Mujhe toh aap aur aapki yapping behad pasand hai. Karta raha kijiye. Never stop.',
    },
    {
      question: 'What do I tell you about exploring life?',
      options: [
        'You make me want to explore life',
        'You make me want to stay home',
        'You make me want to travel the world alone',
        'You make me want to sleep more',
      ],
      answer: 0,
      story: 'You make me want to explore life. Not just the big things — everything.',
    },
    {
      question: 'What did I say about flirting, even when we\'re old?',
      options: [
        'I\'ll stop when we\'re 40',
        'Even 80 year old oldiee is gonna flirt with this cute gorgeous girl',
        'I\'ll flirt only on birthdays',
        'I\'ll write you letters instead',
      ],
      answer: 1,
      story: 'C\'mon babygurl that\'s never gonna end. Even 80 year old oldiee is gonna flirt with this cute gorgeous girl.',
    },
    {
      question: 'What was our conversation about when we discussed movies?',
      options: [
        'We only watch anime',
        'We talked about watching movies together, PJs and popcorn',
        'We never discuss movies',
        'We only watch horror films',
      ],
      answer: 1,
      story: 'You sent me that reel — "PJs and popcorn." That\'s our kind of plan. Movie nights when we\'re together.',
    },
  ];

export const playlist: { title: string; artist: string; note: string }[] = [
  { title: 'Mast Magan', artist: '2 STATES', note: 'One of the first Reels you sent me, and asked me a song which suited you, It indeed suits you and hopefully you remain magn forever with me"' },
  { title: 'Yeh Jawaani Hai Deewani', artist: 'Pritam', note: 'The movie we talked about. The one that feels like us — adventure, friendship, and choosing each other.' },
  { title: 'Laughter Chefs', artist: 'TV Show OST', note: 'You were watching it, you said "mazza aaya tha mujhe dekhne mein wo." Hopefully the show continues and we can cook togther laugh on the jokes and sit on and make it couch-watch list.' },
  { title: 'Friends (Theme)', artist: 'The Rembrandts', note: 'Your Favorite multi time watch, will definitly want to see this together.' },
  { title: 'Modern Family', artist: 'TV Show OST', note: 'The show I sent you the reel about. Three generations, everyday chaos, lots of love. Basically us in a few years.' },
  { title: 'Big Bang Theory', artist: 'Barenaked Ladies', note: 'You sent me this reel too. "Bazinga." You called me a nerd and I said "sure if I\'m a nerd. Nerd X Baddie you said Huh."' },
];

export const coupons: { icon: ComponentType<{ className?: string }>; title: string; body: string; url?: string }[] = [
  {
    icon: Coffee,
    title: 'Tea in Bed, Direct',
    body: 'I\'ll bring you chai straight to bed, the way you said I should — pyaar se uthana yaar. No early morning torture. You\'re not a morning person, and I won\'t make you one.',
  },
  {
    icon: Camera,
    title: 'A Thousand Photos (or more)',
    body: 'You worried about phone storage with all the photos. I said I\'ll buy a 2TB hard disk. Pose khtam honge par clicking nhi. This coupon is for unlimited photos, wherever, whenever.',
  },
  {
    icon: Gift,
    title: 'I\'ll Help You Get Dressed',
    body: 'You asked what I\'d do while you get ready. I said I\'d help you get dressed and wait patiently. Whichever my baby is in the mood for. Redeemable every time we go out.',
  },
  {
    icon: Music2,
    title: 'Eat Off My Plate',
    body: 'You always want what I\'m eating. I said I\'d let you eat off my plate, and if you want more, we\'ll order one more. This coupon makes that official policy for life.',
  },
  {
    icon: Navigation,
    title: 'Get Me Home — Always',
    body: 'I don\'t want you to ever be lost. Remember when I told you to download offline maps and you complained about the memory? So I built this — it gives you an idea of how to always get home and to your family, even with no signal. Hoping you never have to use it, but making it just in case you do. Tap to open it.',
    url: 'https://aanya-ai.pages.dev/#get-me-home',
  },
];

export const nav = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Wishes', path: '/wishes' },
  { label: 'Memories', path: '/memories' },
  { label: 'Timeline', path: '/timeline' },
  { label: 'Quiz', path: '/quiz' },
  { label: 'Music & Gifts', path: '/gifts' },
] as const;
