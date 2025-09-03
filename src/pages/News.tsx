import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, Calendar, Zap, Leaf, Sun, Wind } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'solar' | 'wind' | 'policy' | 'technology' | 'subsidy';
  publishedAt: Date;
  source: string;
  url: string;
  readTime: string;
}

// Mock news data - In production, this would come from an API
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'PM-KUSUM Scheme Reaches 1 Million Farmers',
    summary: 'The PM-KUSUM scheme has successfully provided solar-powered irrigation to over 1 million farmers across India, reducing electricity costs by 60%.',
    content: 'The Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM) has achieved a significant milestone by reaching over 1 million farmers across rural India. This scheme provides financial assistance for installing solar pumps, grid-connected solar plants, and solarization of existing grid-connected pumps.',
    category: 'solar',
    publishedAt: new Date(2024, 2, 15),
    source: 'MNRE India',
    url: '#',
    readTime: '3 min read'
  },
  {
    id: '2',
    title: 'New Subsidy Rates for Rooftop Solar Announced',
    summary: 'Central government increases subsidy rates for residential rooftop solar installations up to 40% for systems under 3kW.',
    content: 'The Ministry of New and Renewable Energy (MNRE) has announced enhanced subsidy rates for rooftop solar installations. Residential consumers can now get up to 40% subsidy for systems up to 3kW and 20% for systems between 3kW to 10kW capacity.',
    category: 'subsidy',
    publishedAt: new Date(2024, 2, 12),
    source: 'Economic Times',
    url: '#',
    readTime: '2 min read'
  },
  {
    id: '3',
    title: 'Wind Energy Capacity Crosses 75 GW Milestone',
    summary: 'India achieves another renewable energy milestone with wind power capacity exceeding 75 GW, contributing significantly to clean energy goals.',
    content: 'India has crossed the 75 GW wind energy capacity milestone, reinforcing its position as the fourth-largest wind power producer globally. This achievement brings the country closer to its renewable energy target of 500 GW by 2030.',
    category: 'wind',
    publishedAt: new Date(2024, 2, 10),
    source: 'Renewable Energy World',
    url: '#',
    readTime: '4 min read'
  },
  {
    id: '4',
    title: 'Rural Electrification Through Mini-Grids Expands',
    summary: 'Government launches new initiative to electrify remote villages through solar mini-grid systems, targeting 10,000 villages.',
    content: 'The rural electrification program has been expanded with a focus on solar mini-grid systems for remote villages. This initiative aims to provide reliable electricity to 10,000 villages that are not connected to the main power grid.',
    category: 'policy',
    publishedAt: new Date(2024, 2, 8),
    source: 'Power Ministry',
    url: '#',
    readTime: '5 min read'
  },
  {
    id: '5',
    title: 'Breakthrough in Perovskite Solar Cell Efficiency',
    summary: 'Indian researchers achieve 28% efficiency in perovskite solar cells, opening new possibilities for affordable solar technology.',
    content: 'Researchers at IIT Delhi have achieved a breakthrough efficiency of 28% in perovskite solar cells, which could significantly reduce the cost of solar power generation and make it more accessible for rural applications.',
    category: 'technology',
    publishedAt: new Date(2024, 2, 5),
    source: 'Science Daily',
    url: '#',
    readTime: '6 min read'
  }
];

const categoryIcons = {
  solar: Sun,
  wind: Wind,
  policy: Leaf,
  technology: Zap,
  subsidy: Zap
};

const categoryColors = {
  solar: 'bg-energy-solar text-black',
  wind: 'bg-energy-wind text-white',
  policy: 'bg-energy-bio text-white',
  technology: 'bg-accent text-white',
  subsidy: 'bg-primary text-white'
};

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>(mockNews);

  const categories = ['all', 'solar', 'wind', 'policy', 'technology', 'subsidy'];

  useEffect(() => {
    let filtered = mockNews;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredNews(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Renewable Energy News
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest developments in renewable energy, government policies, and clean technology innovations.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All News' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => {
            const CategoryIcon = categoryIcons[item.category];
            const categoryColor = categoryColors[item.category];

            return (
              <Card key={item.id} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={`${categoryColor} gap-1 text-xs`}>
                      <CategoryIcon className="w-3 h-3" />
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(item.publishedAt, { addSuffix: true })}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {item.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs h-7"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      Read More
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 p-4 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            📊 <strong>Stay Informed:</strong> This news section provides the latest updates on renewable energy policies, 
            technological advances, and government schemes. For real-time updates, enable notifications in your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
}