import { CheckCircle, Star, BarChart3 } from 'lucide-react';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  startTime?: number;
  keyPoints: string[];
  category: 'featured' | 'advanced' | 'beginner';
}

// Easy configuration - just add new videos here!
const EDUCATIONAL_VIDEOS: VideoContent[] = [
  {
    id: '8zhmeQbzIi0',
    title: 'Smart Money Concepts Masterclass',
    description: 'Comprehensive guide to understanding institutional trading behavior, order flow analysis, and market structure concepts used by professional traders.',
    startTime: 19,
    category: 'featured',
    keyPoints: [
      'Market Structure Analysis',
      'Order Block Identification', 
      'Liquidity Concepts',
      'Real Trading Examples'
    ]
  },
  {
    id: 'nS_aQLQ-MBQ',
    title: 'Smart Money Concepts - Part 1',
    description: 'Introduction to Smart Money Concepts and understanding how institutional traders operate in the markets.',
    category: 'beginner',
    keyPoints: [
      'SMC Fundamentals',
      'Market Structure Basics',
      'Institutional vs Retail'
    ]
  },
  {
    id: 'nJamCP7l7HY',
    title: 'Smart Money Concepts - Part 2',
    description: 'Deep dive into order flow analysis and how smart money leaves footprints in the market.',
    category: 'beginner',
    keyPoints: [
      'Order Flow Analysis',
      'Smart Money Footprints',
      'Market Maker Behavior'
    ]
  },
  {
    id: '7l-FYbicT5U',
    title: 'Smart Money Concepts - Part 3',
    description: 'Understanding liquidity concepts and how institutions hunt for stops and create market moves.',
    category: 'beginner',
    keyPoints: [
      'Liquidity Pools',
      'Stop Hunting',
      'Liquidity Sweeps'
    ]
  },
  {
    id: 'G-CvU6m_QoU',
    title: 'Smart Money Concepts - Part 4',
    description: 'Advanced market structure analysis and identifying high probability trade setups.',
    category: 'advanced',
    keyPoints: [
      'Advanced Market Structure',
      'Trade Setup Identification',
      'Risk Management'
    ]
  },
  {
    id: '13Qqc0VoTak',
    title: 'Smart Money Concepts - Part 5',
    description: 'Order blocks and demand zones - understanding where smart money accumulates positions.',
    category: 'advanced',
    keyPoints: [
      'Order Blocks',
      'Demand Zones',
      'Supply Areas'
    ]
  },
  {
    id: 'e5f-Ua5xbkU',
    title: 'Smart Money Concepts - Part 6',
    description: 'Fair Value Gaps and market imbalances - trading institutional inefficiencies.',
    category: 'advanced',
    keyPoints: [
      'Fair Value Gaps',
      'Market Imbalances',
      'Gap Trading Strategies'
    ]
  },
  {
    id: 'WgegYApBOU0',
    title: 'Smart Money Concepts - Part 7',
    description: 'Change of Character (CHoCH) and Break of Structure (BOS) - trend analysis techniques.',
    category: 'advanced',
    keyPoints: [
      'Change of Character',
      'Break of Structure',
      'Trend Identification'
    ]
  },
  {
    id: 'zeEBw2BBgQY',
    title: 'Smart Money Concepts - Part 8',
    description: 'Inducement and manipulation - how smart money traps retail traders.',
    category: 'advanced',
    keyPoints: [
      'Market Manipulation',
      'Inducement Tactics',
      'Retail Trader Traps'
    ]
  },
  {
    id: 'VCQtbj01sEs',
    title: 'Smart Money Concepts - Part 9',
    description: 'Volume analysis and understanding institutional accumulation patterns.',
    category: 'advanced',
    keyPoints: [
      'Volume Analysis',
      'Accumulation Patterns',
      'Distribution Phases'
    ]
  },
  {
    id: '0PJouRQRqzA',
    title: 'Smart Money Concepts - Part 10',
    description: 'Time-based analysis and understanding market timing from institutional perspective.',
    category: 'advanced',
    keyPoints: [
      'Market Timing',
      'Session Analysis',
      'Institutional Schedule'
    ]
  },
  {
    id: 'lDyzZcVmzAE',
    title: 'Smart Money Concepts - Part 11',
    description: 'Psychology of smart money trading and developing an institutional mindset.',
    category: 'beginner',
    keyPoints: [
      'Trading Psychology',
      'Institutional Mindset',
      'Emotional Control'
    ]
  },
  {
    id: 'bVqvgzsP-To',
    title: 'Smart Money Concepts - Part 12',
    description: 'Risk management strategies used by institutional traders and money managers.',
    category: 'beginner',
    keyPoints: [
      'Risk Management',
      'Position Sizing',
      'Capital Preservation'
    ]
  },
  {
    id: '7BCnXN6drZU',
    title: 'Smart Money Concepts - Part 13',
    description: 'Advanced trading strategies combining multiple SMC concepts for high-probability setups.',
    category: 'advanced',
    keyPoints: [
      'Strategy Combination',
      'Multi-timeframe Analysis',
      'High Probability Setups'
    ]
  },
  {
    id: 'wjchfhwFxhk',
    title: 'Smart Money Concepts - Part 14',
    description: 'Case studies and real-world examples of smart money concepts in live market conditions.',
    category: 'advanced',
    keyPoints: [
      'Live Market Examples',
      'Case Studies',
      'Real-world Application'
    ]
  },
  {
    id: 'enwGyswTzUE',
    title: 'Smart Money Concepts - Part 15',
    description: 'Mastering smart money concepts - putting it all together for consistent trading success.',
    category: 'advanced',
    keyPoints: [
      'Concept Integration',
      'Consistent Application',
      'Trading Success Framework'
    ]
  }
];

const COMING_SOON_TOPICS = [
  'Advanced Order Blocks',
  'Live Market Analysis', 
  'Risk Management',
  'Psychology & Discipline',
  'Fair Value Gap Trading',
  'Liquidity Sweeps',
  'Market Maker Models',
  'ICT Concepts'
];

export function VideoEducation() {
  const featuredVideo = EDUCATIONAL_VIDEOS.find(v => v.category === 'featured');

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Learn Smart Money Concepts Through Video
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Master institutional trading strategies with our curated video education series. 
            Watch expert analysis and real-world examples of smart money concepts in action.
          </p>
        </div>

        {/* Featured Video */}
        {featuredVideo && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
                  <iframe 
                    width="100%" 
                    height="400" 
                    src={`https://www.youtube.com/embed/${featuredVideo.id}?${featuredVideo.startTime ? `start=${featuredVideo.startTime}&` : ''}rel=0&modestbranding=1&fs=0&disablekb=1`}
                    title={featuredVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="w-full h-[250px] md:h-[300px] lg:h-[400px]"
                    style={{ border: 'none' }}
                  ></iframe>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1 rounded-lg inline-block">
                  <span className="block bg-white text-gray-900 px-3 py-1 rounded text-sm font-semibold">
                    Featured Education
                  </span>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {featuredVideo.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {featuredVideo.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    💡 Pro Tip:
                  </p>
                  <p className="text-sm text-blue-700">
                    Watch this video multiple times and take notes. Understanding these concepts 
                    is crucial for reading institutional behavior in the markets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Videos Grid - Will show when more videos are added */}
        {EDUCATIONAL_VIDEOS.filter(v => v.category !== 'featured').length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              More Educational Content
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {EDUCATIONAL_VIDEOS.filter(v => v.category !== 'featured').map((video) => (
                <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <iframe 
                      width="100%" 
                      height="200" 
                      src={`https://www.youtube.com/embed/${video.id}?${video.startTime ? `start=${video.startTime}&` : ''}rel=0&modestbranding=1&fs=0&disablekb=1`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      style={{ border: 'none' }}
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                      video.category === 'advanced' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {video.category === 'advanced' ? 'Advanced' : 'Beginner'}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{video.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                    <div className="space-y-2">
                      {video.keyPoints.slice(0, 3).map((point, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        <div className="bg-gradient-to-r from-gray-100 to-blue-50 rounded-2xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              More Educational Videos Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              We&apos;re constantly adding new video content to help you master smart money concepts. 
              Stay tuned for advanced tutorials, live market analysis, and case studies.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {COMING_SOON_TOPICS.map((topic, index) => (
                <div key={index} className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 