const natural = require('natural');
const compromise = require('compromise');

class NLPService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.sentimentAnalyzer = new natural.SentimentAnalyzer(
      'English',
      natural.PorterStemmer,
      'afinn'
    );

    // Threat pattern dictionaries
    this.incelPatterns = [
      'blackpill', 'femoid', 'roastie', 'stacy', 'chad', 'becky',
      'gymcel', 'heightcel', 'looksmatch', 'hypergamy', 'juggernaut',
      'its over', 'rope', 'ldar', 'sui fuel'
    ];

    this.mgtowPatterns = [
      'awalt', 'gynocentrism', 'divorce rape', 'the wall', 'red pill',
      'plantation', 'simps', 'white knight', 'female nature'
    ];

    this.puaPatterns = [
      'neg', 'kino', 'amog', 'dhv', 'ioi', 'last minute resistance',
      'day game', 'night game', 'hb10', 'approach anxiety', 'game',
      'alpha male', 'beta male'
    ];

    this.groomingPatterns = [
      'age is just a number', 'mature for your age', 'our secret',
      'dont tell', 'special friend', 'send pics', 'meet up',
      'alone together', 'trust me'
    ];

    this.extremistPatterns = [
      'race war', 'cleanse', 'purge', 'ethnic', 'supremacy',
      'inferior race', 'final solution', 'day of the rope',
      'beta uprising', 'erb', 'supreme gentleman'
    ];

    this.violencePatterns = [
      'kill', 'murder', 'rape', 'assault', 'attack', 'shoot',
      'stab', 'bomb', 'massacre', 'terrorism', 'violence'
    ];

    this.dehumanizationPatterns = [
      'subhuman', 'animal', 'inferior', 'worthless', 'trash',
      'vermin', 'filth', 'parasite', 'creature'
    ];
  }

  preprocessText(text) {
    // Tokenize
    const tokens = this.tokenizer.tokenize(text.toLowerCase());

    // Remove stopwords
    const stopwords = natural.stopwords;
    const filteredTokens = tokens.filter(token => !stopwords.includes(token));

    // Analyze with compromise for context
    const doc = compromise(text);

    return {
      original: text,
      tokens: filteredTokens,
      sentences: doc.sentences().out('array'),
      entities: doc.people().out('array'),
      sentiment: this.analyzeSentiment(tokens)
    };
  }

  analyzeSentiment(tokens) {
    const score = this.sentimentAnalyzer.getSentiment(tokens);
    return {
      score: score,
      polarity: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
  }

  analyzePatterns(preprocessed) {
    const text = preprocessed.original.toLowerCase();
    const tokens = preprocessed.tokens;

    const results = {
      incel: this.countPatternMatches(text, tokens, this.incelPatterns),
      mgtow: this.countPatternMatches(text, tokens, this.mgtowPatterns),
      pua: this.countPatternMatches(text, tokens, this.puaPatterns),
      grooming: this.countPatternMatches(text, tokens, this.groomingPatterns),
      extremist: this.countPatternMatches(text, tokens, this.extremistPatterns),
      violence: this.countPatternMatches(text, tokens, this.violencePatterns),
      dehumanization: this.countPatternMatches(text, tokens, this.dehumanizationPatterns)
    };

    // Calculate threat score
    const threatScore = this.calculatePatternThreatScore(results);

    // Determine category
    const category = this.determineCategoryFromPatterns(results);

    // Find matched patterns
    const patterns = this.getMatchedPatterns(results);

    return {
      threatScore,
      category,
      patterns,
      sentiment: preprocessed.sentiment,
      details: results
    };
  }

  countPatternMatches(text, tokens, patterns) {
    let count = 0;
    const matched = [];

    patterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        count += matches.length;
        matched.push({ pattern, count: matches.length });
      }
    });

    return { count, matched };
  }

  calculatePatternThreatScore(results) {
    let score = 0;

    // Weighted scoring
    score += results.violence.count * 15;
    score += results.extremist.count * 12;
    score += results.grooming.count * 10;
    score += results.dehumanization.count * 8;
    score += results.incel.count * 6;
    score += results.mgtow.count * 5;
    score += results.pua.count * 4;

    return Math.min(score, 100);
  }

  determineCategoryFromPatterns(results) {
    const scores = {
      violence: results.violence.count * 15,
      extremist: results.extremist.count * 12,
      grooming: results.grooming.count * 10,
      incel: results.incel.count * 6,
      mgtow: results.mgtow.count * 5,
      pua: results.pua.count * 4
    };

    const maxCategory = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    if (scores[maxCategory] === 0) return 'safe';
    if (maxCategory === 'violence' || maxCategory === 'extremist') return 'extremist';
    return maxCategory;
  }

  getMatchedPatterns(results) {
    const patterns = [];

    Object.keys(results).forEach(category => {
      if (results[category].matched && results[category].matched.length > 0) {
        results[category].matched.forEach(match => {
          patterns.push({
            category,
            pattern: match.pattern,
            count: match.count
          });
        });
      }
    });

    return patterns;
  }

  extractKeyPhrases(text, count = 5) {
    const doc = compromise(text);

    // Extract noun phrases
    const nounPhrases = doc.match('#Noun+').out('array');

    // Extract verb phrases
    const verbPhrases = doc.match('#Verb+').out('array');

    // Combine and rank by frequency
    const phrases = [...nounPhrases, ...verbPhrases];
    const frequency = {};

    phrases.forEach(phrase => {
      frequency[phrase] = (frequency[phrase] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([phrase, freq]) => ({ phrase, frequency: freq }));
  }
}

module.exports = new NLPService();
