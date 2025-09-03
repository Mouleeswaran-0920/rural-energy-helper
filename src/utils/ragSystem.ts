// RAG (Retrieval-Augmented Generation) System for Renewable Energy Knowledge Base

interface Document {
  id: string;
  content: string;
  title: string;
  category: string;
  metadata: Record<string, any>;
}

interface SearchResult {
  document: Document;
  score: number;
  relevantChunk: string;
}

// Renewable Energy Knowledge Base
const knowledgeBase: Document[] = [
  {
    id: 'solar-basics',
    title: 'Solar Energy Fundamentals',
    category: 'solar',
    content: `Solar energy is generated through photovoltaic (PV) panels that convert sunlight into electricity. A typical rooftop solar system includes solar panels, an inverter, mounting structure, and electrical components. 

Key benefits include:
- Reduced electricity bills by 70-90%
- 25-year system warranty
- Environmental sustainability
- Increased property value
- Energy independence

System sizing: 1kW system generates approximately 4-5 units per day depending on location and weather conditions. For every ₹1000 monthly electricity bill, you need approximately 1kW solar capacity.

Installation process: Site survey → System design → Approvals → Installation → Grid connection → Net metering setup`,
    metadata: { readTime: 5, difficulty: 'beginner' }
  },
  {
    id: 'pm-kusum-scheme',
    title: 'PM-KUSUM Scheme Details',
    category: 'schemes',
    content: `The Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM) is a central government scheme with three components:

Component A: 10,000 MW of Decentralized Ground Mounted Grid Connected Renewable Power Plants
- Capacity: 500 kW to 2 MW
- Subsidy: 30% by Central Government, 30% by State Government
- Farmer contribution: 10%, remaining 30% through bank loan

Component B: Installation of 20 Lakh Standalone Solar Powered Agriculture Pumps
- Pump capacity: 7.5 HP
- Subsidy: 30% Central + 30% State + 10% Farmer + 30% bank loan
- Direct benefit transfer to farmer accounts

Component C: Solarisation of 15 Lakh Grid Connected Agriculture Pumps
- Individual pump capacity: 7.5 HP
- Subsidy structure same as Component B
- Reduces electricity subsidy burden on state governments

Eligibility: All categories of farmers including FPOs, cooperatives, panchayats, and Kisan Udyog Groups`,
    metadata: { readTime: 7, lastUpdated: '2024-03-15' }
  },
  {
    id: 'rooftop-solar-subsidy',
    title: 'Rooftop Solar Subsidy Scheme',
    category: 'schemes',
    content: `Central Government Subsidy for Rooftop Solar (Grid Connected):

Residential Sector Subsidy Rates:
- Up to 3kW: 40% of benchmark cost or ₹18,000 per kW, whichever is lower
- Above 3kW and up to 10kW: 20% of benchmark cost or ₹9,000 per kW for capacity above 3kW
- Above 10kW: No central subsidy (state subsidies may apply)

Group Housing Society/Residential Welfare Association:
- Up to 500kW: 20% of benchmark cost or ₹9,000 per kW, whichever is lower

Institutional Sector:
- Up to 500kW: 20% of benchmark cost

Implementation: Through state nodal agencies and empaneled installers. Direct Benefit Transfer (DBT) to beneficiary accounts after installation and commissioning.

Net Metering: Bi-directional meter installed for selling excess power to grid. Settlement on annual basis with feed-in tariff rates.

Documents Required: Identity proof, address proof, electricity bill, bank account details, roof rights certificate`,
    metadata: { readTime: 6, lastUpdated: '2024-03-10' }
  },
  {
    id: 'wind-energy-rural',
    title: 'Small Wind Energy Systems for Rural Areas',
    category: 'wind',
    content: `Small wind energy systems (up to 25kW) are suitable for rural and remote areas with good wind resources.

Types of Small Wind Systems:
- Horizontal axis wind turbines (HAWT): More efficient, suitable for areas with consistent wind direction
- Vertical axis wind turbines (VAWT): Suitable for turbulent wind conditions, easier maintenance

Site Requirements:
- Average wind speed: Minimum 4-5 m/s at hub height
- Clear area: 150m radius from turbine
- Height: 10-30 meters above ground
- Away from obstacles like buildings and trees

Cost Economics:
- Capital cost: ₹3-5 lakhs per kW
- Operation & Maintenance: 2-3% of capital cost annually
- Capacity Utilization Factor: 15-25% depending on wind resource
- Payback period: 8-12 years

Government Support:
- Accelerated depreciation: 40% in first year for commercial installations
- Generation Based Incentive (GBI): ₹0.50 per kWh for first 10 years
- Concessional customs duty on wind turbine components

Applications: Water pumping, battery charging, grid-connected power generation, hybrid systems with solar PV`,
    metadata: { readTime: 8, applications: ['water-pumping', 'grid-connected', 'hybrid'] }
  },
  {
    id: 'biogas-systems',
    title: 'Biogas Systems and Government Support',
    category: 'biogas',
    content: `Biogas is produced through anaerobic digestion of organic waste including cattle dung, kitchen waste, crop residues, and other biomass.

Types of Biogas Plants:
- Fixed dome (Chinese model): Low maintenance, longer life, suitable for cold regions
- Floating gas holder (Indian model): Easy operation, immediate gas indication
- Balloon type: Low cost, suitable for small families
- Prefabricated: Quick installation, good for demonstration

Family Size and Plant Capacity:
- 4-6 members: 2 cubic meter plant (8-10 kg fresh dung daily)
- 6-8 members: 3 cubic meter plant (12-15 kg fresh dung daily)
- 8-10 members: 4 cubic meter plant (16-20 kg fresh dung daily)

Government Schemes:
- National Biogas and Manure Management Programme (NBMMP)
- Central subsidy: ₹10,000-15,000 per plant depending on type and size
- State subsidies: Additional ₹2,000-5,000 (varies by state)
- Special subsidies for SC/ST/BPL families: Up to 90% of cost

Benefits:
- Clean cooking fuel equivalent to 3-4 LPG cylinders per month
- Organic fertilizer (slurry) for agriculture
- Reduced drudgery for women
- Reduction in indoor air pollution
- Carbon credits eligibility

Installation: Through state implementing agencies and trained masons. 6-8 weeks construction period with 1-year maintenance warranty.`,
    metadata: { readTime: 9, beneficiaries: 5000000 }
  },
  {
    id: 'energy-efficiency',
    title: 'Energy Efficiency Measures for Rural Areas',
    category: 'efficiency',
    content: `Energy efficiency is the most cost-effective way to reduce energy consumption and bills.

LED Lighting:
- 80% less energy consumption than incandescent bulbs
- 25 times longer lifespan
- Government schemes: UJALA - LEDs at ₹40-70 per bulb
- Rural applications: Street lighting, household lighting, agricultural applications

Energy Efficient Appliances:
- Star-rated refrigerators, air conditioners, washing machines
- BEE (Bureau of Energy Efficiency) star labels indicate efficiency
- 5-star appliances consume 40-50% less energy than 3-star
- EESL bulk procurement makes efficient appliances affordable

Agricultural Energy Efficiency:
- Star-rated agricultural pump sets
- Efficient motors and controllers
- Solar water pumping systems
- Precision farming techniques
- Drip irrigation systems

Building Efficiency:
- Thermal insulation using locally available materials
- Natural ventilation design
- Orientation for maximum solar gain in winter, minimum in summer
- Cool roofs with reflective materials
- Energy efficient construction materials

Government Programs:
- Perform, Achieve and Trade (PAT) scheme
- Standards & Labeling Programme
- Energy Efficiency in SMEs
- Municipal Energy Efficiency Programme (MEEP)

Rural Specific Measures:
- Biomass cook stoves (80% efficiency vs 15% in traditional chulhas)
- Solar water heating systems
- Passive solar building design
- Community-based energy management`,
    metadata: { readTime: 7, savingsPotential: '30-50%' }
  }
];

class RAGSystem {
  private documents: Document[];
  private vectorCache: Map<string, number[]>;

  constructor() {
    this.documents = knowledgeBase;
    this.vectorCache = new Map();
  }

  // Simple text similarity scoring (in production, use proper embeddings)
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    // Jaccard similarity with keyword weighting
    let score = intersection.size / union.size;
    
    // Boost score for renewable energy keywords
    const renewableKeywords = ['solar', 'wind', 'biogas', 'renewable', 'energy', 'subsidy', 'scheme', 'efficiency', 'pump', 'installation', 'cost'];
    const keywordBonus = renewableKeywords.reduce((bonus, keyword) => {
      if (text1.toLowerCase().includes(keyword) && text2.toLowerCase().includes(keyword)) {
        return bonus + 0.1;
      }
      return bonus;
    }, 0);
    
    return Math.min(score + keywordBonus, 1.0);
  }

  // Chunk text into smaller pieces for better retrieval
  private chunkText(text: string, chunkSize: number = 300): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  // Search for relevant documents and chunks
  search(query: string, topK: number = 3): SearchResult[] {
    const results: SearchResult[] = [];
    
    for (const doc of this.documents) {
      const chunks = this.chunkText(doc.content);
      let bestScore = 0;
      let bestChunk = '';
      
      // Score document title
      const titleScore = this.calculateSimilarity(query, doc.title);
      
      // Score content chunks
      for (const chunk of chunks) {
        const chunkScore = this.calculateSimilarity(query, chunk);
        if (chunkScore > bestScore) {
          bestScore = chunkScore;
          bestChunk = chunk;
        }
      }
      
      // Combine title and content scores
      const finalScore = Math.max(titleScore * 1.2, bestScore);
      
      if (finalScore > 0.1) { // Minimum relevance threshold
        results.push({
          document: doc,
          score: finalScore,
          relevantChunk: bestChunk
        });
      }
    }
    
    // Sort by score and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  // Generate context for AI model
  generateContext(query: string, topK: number = 3): string {
    const searchResults = this.search(query, topK);
    
    if (searchResults.length === 0) {
      return "I don't have specific information about that topic in my knowledge base. However, I can provide general guidance on renewable energy topics.";
    }
    
    let context = "Based on the renewable energy knowledge base:\n\n";
    
    searchResults.forEach((result, index) => {
      context += `${index + 1}. ${result.document.title} (Relevance: ${(result.score * 100).toFixed(1)}%)\n`;
      context += `${result.relevantChunk}\n\n`;
    });
    
    return context;
  }

  // Get confidence score for a query
  getConfidence(query: string): number {
    const results = this.search(query, 1);
    if (results.length === 0) return 0;
    return Math.min(results[0].score * 100, 95); // Cap at 95%
  }

  // Add new document to knowledge base
  addDocument(document: Document): void {
    this.documents.push(document);
  }

  // Get statistics about the knowledge base
  getStats(): { totalDocuments: number; categories: string[] } {
    const categories = [...new Set(this.documents.map(doc => doc.category))];
    return {
      totalDocuments: this.documents.length,
      categories
    };
  }
}

// Export singleton instance
export const ragSystem = new RAGSystem();
export type { SearchResult, Document };