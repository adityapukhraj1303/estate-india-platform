const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// @desc    NLP Smart Search - parse natural language to filters
// @route   POST /api/ai/smart-search
exports.smartSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const response = await axios.post(`${AI_SERVICE_URL}/api/parse-query`, { query }, { timeout: 10000 });
    res.json({ success: true, filters: response.data.filters, interpreted: response.data.interpreted });
  } catch (error) {
    console.error('AI smart search error:', error.message);
    // Fallback: basic keyword parsing
    const filters = basicQueryParser(req.body.query);
    res.json({ success: true, filters, source: 'fallback', interpreted: req.body.query });
  }
};

// @desc    AI Price Prediction
// @route   POST /api/ai/predict-price
exports.predictPrice = async (req, res) => {
  try {
    const propertyData = req.body;
    const response = await axios.post(`${AI_SERVICE_URL}/api/predict-price`, propertyData, { timeout: 15000 });
    res.json({ success: true, ...response.data });
  } catch (error) {
    console.error('Price prediction error:', error.message);
    // Fallback: rule-based estimate
    const estimate = ruleBasedPriceEstimate(req.body);
    res.json({ success: true, ...estimate, source: 'fallback' });
  }
};

// @desc    AI Property Recommendations
// @route   POST /api/ai/recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const response = await axios.post(`${AI_SERVICE_URL}/api/recommendations`, { userId, preferences }, { timeout: 10000 });
    res.json({ success: true, recommendations: response.data.recommendations });
  } catch (error) {
    res.status(500).json({ error: 'AI service unavailable', message: error.message });
  }
};

// @desc    EMI Calculator
// @route   POST /api/ai/emi-calculate
exports.calculateEMI = async (req, res) => {
  try {
    const { principal, interestRate, tenureYears, downPayment = 0 } = req.body;

    if (!principal || !interestRate || !tenureYears) {
      return res.status(400).json({ error: 'Principal, interest rate, and tenure are required' });
    }

    const loanAmount = principal - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const tenureMonths = tenureYears * 12;

    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    // Yearly breakdown
    const schedule = [];
    let balance = loanAmount;
    for (let year = 1; year <= tenureYears; year++) {
      let yearlyPrincipal = 0, yearlyInterest = 0;
      for (let month = 1; month <= 12 && balance > 0; month++) {
        const interestPaid = balance * monthlyRate;
        const principalPaid = Math.min(emi - interestPaid, balance);
        yearlyPrincipal += principalPaid;
        yearlyInterest += interestPaid;
        balance -= principalPaid;
      }
      schedule.push({ year, principalPaid: Math.round(yearlyPrincipal), interestPaid: Math.round(yearlyInterest), balance: Math.max(0, Math.round(balance)) });
    }

    res.json({
      success: true,
      emi: Math.round(emi),
      loanAmount,
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      tenureMonths,
      schedule
    });
  } catch (error) {
    res.status(500).json({ error: 'Calculation error' });
  }
};

// @desc    General AI Chat
// @route   POST /api/ai/chat
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post(`${AI_SERVICE_URL}/api/chat`, { message });
    res.json({ success: true, reply: response.data.reply });
  } catch (error) {
    res.status(500).json({ error: 'AI chat service unavailable' });
  }
};

// Fallback: Basic query parser (keyword matching)
function basicQueryParser(query) {
  const filters = {};
  const q = query.toLowerCase();

  // Extract BHK
  const bhkMatch = q.match(/(\d)\s*bhk/);
  if (bhkMatch) filters.bedrooms = parseInt(bhkMatch[1]);

  // Extract budget
  const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|l\b)/);
  const croreMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:crore|cr\b)/);
  if (croreMatch) filters.maxPrice = parseFloat(croreMatch[1]) * 10000000;
  else if (lakhMatch) filters.maxPrice = parseFloat(lakhMatch[1]) * 100000;

  // Listing type
  if (q.includes('rent')) filters.listingType = 'rent';
  else if (q.includes('buy') || q.includes('sale') || q.includes('purchase')) filters.listingType = 'buy';

  // Property type
  if (q.includes('villa')) filters.type = 'villa';
  else if (q.includes('flat') || q.includes('apartment')) filters.type = 'apartment';
  else if (q.includes('plot') || q.includes('land')) filters.type = 'plot';
  else if (q.includes('house')) filters.type = 'house';

  // Furnishing
  if (q.includes('furnished')) {
    if (q.includes('semi')) filters.furnishing = 'semi-furnished';
    else filters.furnishing = 'fully-furnished';
  }

  return filters;
}

// Fallback: Rule-based price estimate
function ruleBasedPriceEstimate(data) {
  const { bedrooms, area, city, type, furnishing } = data;
  const baseRates = { Mumbai: 25000, Delhi: 18000, Bangalore: 15000, Pune: 12000, Chennai: 11000, Hyderabad: 10000 };
  const rate = baseRates[city] || 8000;
  const totalArea = area?.total || 1000;
  let price = rate * totalArea;

  if (furnishing === 'fully-furnished') price *= 1.15;
  else if (furnishing === 'semi-furnished') price *= 1.07;

  return {
    predictedPrice: Math.round(price),
    priceRange: { min: Math.round(price * 0.85), max: Math.round(price * 1.15) },
    confidence: 0.65,
    factors: ['location', 'area', 'furnishing']
  };
}
