// Central Mock API Service for AI Khet Saathi
// Simulated asynchronous delay to test React loading & error handling states

const DELAY_MS = 250;

const initialFarmerProfile = {
  id: 'usr-1',
  name: 'Ramesh Patil',
  mobile: '+91 98765 43210',
  village: 'Satara',
  district: 'Satara',
  state: 'Maharashtra',
  role: 'farmer',
  avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
  joinedDate: '2025-04-12',
  language: 'en'
};

const initialFarms = [
  {
    id: 'farm-1',
    name: 'Main Farm (मुख्य शेत)',
    village: 'Satara Rural',
    area: 2.0,
    unit: 'acre',
    notes: 'Well irrigation with fertile black cotton soil.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    createdAt: '2025-05-10'
  },
  {
    id: 'farm-2',
    name: 'Riverbank Land (नदीकाठचे रान)',
    village: 'Koregaon',
    area: 1.5,
    unit: 'acre',
    notes: 'Canal water access, ideal for sugarcane and cotton.',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    createdAt: '2025-06-01'
  }
];

const initialCrops = [
  {
    id: 'crop-1',
    name: 'Soybean (सोयाबीन)',
    farmId: 'farm-1',
    farmName: 'Main Farm',
    variety: 'JS 335',
    season: 'Kharif 2026',
    area: 2.0,
    sowingDate: '2026-06-15',
    expectedHarvestDate: '2026-10-15',
    notes: 'Treated seeds with Rhizobium before sowing.',
    status: 'active'
  },
  {
    id: 'crop-2',
    name: 'Cotton (कापूस)',
    farmId: 'farm-2',
    farmName: 'Riverbank Land',
    variety: 'Bt Cotton Bollgard II',
    season: 'Kharif 2026',
    area: 1.5,
    sowingDate: '2026-06-01',
    expectedHarvestDate: '2026-11-30',
    notes: 'Drip irrigation installed with 4-ft spacing.',
    status: 'active'
  },
  {
    id: 'crop-3',
    name: 'Sugarcane (ऊस)',
    farmId: 'farm-1',
    farmName: 'Main Farm',
    variety: 'Co 86032',
    season: 'Annual 2026',
    area: 1.0,
    sowingDate: '2026-01-10',
    expectedHarvestDate: '2027-01-15',
    notes: 'Ratoon management planned post harvesting.',
    status: 'active'
  }
];

const initialActivities = [
  {
    id: 'act-1',
    cropId: 'crop-1',
    cropName: 'Soybean',
    farmId: 'farm-1',
    farmName: 'Main Farm',
    type: 'Sowing',
    date: '2026-06-15',
    productName: 'JS 335 Certified Seed',
    quantity: '15',
    unit: 'kg',
    cost: 2500,
    income: 0,
    notes: 'Sown with seed drill after first rainfall.',
    image: null
  },
  {
    id: 'act-2',
    cropId: 'crop-1',
    cropName: 'Soybean',
    farmId: 'farm-1',
    farmName: 'Main Farm',
    type: 'Irrigation',
    date: '2026-06-20',
    productName: 'Well Pump Irrigation',
    quantity: '4',
    unit: 'hours',
    cost: 1000,
    income: 0,
    notes: 'Light irrigation given post seed emergence.',
    image: null
  },
  {
    id: 'act-3',
    cropId: 'crop-1',
    cropName: 'Soybean',
    farmId: 'farm-1',
    farmName: 'Main Farm',
    type: 'Spray',
    date: '2026-06-25',
    productName: 'Emamectin Benzoate 5% SG',
    quantity: '100',
    unit: 'gm',
    cost: 1800,
    income: 0,
    notes: 'Preventive spray against early caterpillar infestation.',
    image: null
  },
  {
    id: 'act-4',
    cropId: 'crop-1',
    cropName: 'Soybean',
    farmId: 'farm-1',
    farmName: 'Main Farm',
    type: 'Fertilizer',
    date: '2026-06-30',
    productName: 'NPK 10:26:26',
    quantity: '50',
    unit: 'kg',
    cost: 3200,
    income: 0,
    notes: 'Applied during first hoeing.',
    image: null
  },
  {
    id: 'act-5',
    cropId: 'crop-2',
    cropName: 'Cotton',
    farmId: 'farm-2',
    farmName: 'Riverbank Land',
    type: 'Weeding',
    date: '2026-07-05',
    productName: 'Manual Labour Weeding',
    quantity: '3',
    unit: 'workers',
    cost: 4000,
    income: 0,
    notes: 'Cleared weeds between cotton rows.',
    image: null
  },
  {
    id: 'act-6',
    cropId: 'crop-1',
    cropName: 'Soybean',
    farmId: 'farm-1',
    farmName: 'Main Farm',
    type: 'Harvest',
    date: '2026-10-01',
    productName: 'Combine Harvester Yield (18 Quintal)',
    quantity: '18',
    unit: 'quintal',
    cost: 4000,
    income: 48000, // Harvest gained revenue ₹48,000
    notes: 'Harvested early crop yield sold at Satara APMC Mandi.',
    image: null
  },
  {
    id: 'act-7',
    cropId: 'crop-2',
    cropName: 'Cotton',
    farmId: 'farm-2',
    farmName: 'Riverbank Land',
    type: 'Harvest',
    date: '2026-09-28',
    productName: 'First Cotton Pick (8 Quintal)',
    quantity: '8',
    unit: 'quintal',
    cost: 2000,
    income: 32000, // Harvest gained revenue ₹32,000
    notes: 'First picking cotton sold to local trader.',
    image: null
  }
];

const initialReminders = [
  {
    id: 'rem-1',
    title: 'Second Pesticide Spray (Soybean)',
    cropId: 'crop-1',
    cropName: 'Soybean',
    farmId: 'farm-1',
    farmName: 'Main Farm',
    activityType: 'Spray',
    reminderDate: '2026-07-02',
    notes: 'Check crop leaves for pod borer symptoms before spraying.',
    status: 'overdue'
  },
  {
    id: 'rem-2',
    title: 'Cotton Top Dressing Fertilizer',
    cropId: 'crop-2',
    cropName: 'Cotton',
    farmId: 'farm-2',
    farmName: 'Riverbank Land',
    activityType: 'Fertilizer',
    reminderDate: '2026-10-03',
    notes: 'Apply 25kg Urea per acre near root zone.',
    status: 'today'
  },
  {
    id: 'rem-3',
    title: 'Sugarcane Irrigation Round 8',
    cropId: 'crop-3',
    cropName: 'Sugarcane',
    farmId: 'farm-1',
    farmName: 'Main Farm',
    activityType: 'Irrigation',
    reminderDate: '2026-10-07',
    notes: 'Run drip system for 5 hours in afternoon.',
    status: 'upcoming'
  }
];

const initialExpenses = [
  {
    id: 'exp-1',
    cropId: 'crop-1',
    cropName: 'Soybean',
    category: 'Seeds',
    amount: 2500,
    date: '2026-06-15',
    description: 'Sowing cost: JS 335 Certified Seed bags (30kg)',
    activityId: 'act-1',
    receiptImage: null
  },
  {
    id: 'exp-2',
    cropId: 'crop-1',
    cropName: 'Soybean',
    category: 'Fertilizer',
    amount: 3200,
    date: '2026-06-30',
    description: 'Fertilizer cost: NPK 10:26:26 1 Bag (50kg)',
    activityId: 'act-4',
    receiptImage: null
  },
  {
    id: 'exp-3',
    cropId: 'crop-1',
    cropName: 'Soybean',
    category: 'Spray',
    amount: 1800,
    date: '2026-06-25',
    description: 'Spray cost: Emamectin Benzoate 5% SG',
    activityId: 'act-3',
    receiptImage: null
  },
  {
    id: 'exp-4',
    cropId: 'crop-1',
    cropName: 'Soybean',
    category: 'Harvest',
    amount: 4000,
    date: '2026-10-01',
    description: 'Harvest cost: Combine Harvester machinery charges',
    activityId: 'act-6',
    receiptImage: null
  },
  {
    id: 'exp-5',
    cropId: 'crop-1',
    cropName: 'Soybean',
    category: 'Irrigation',
    amount: 1000,
    date: '2026-06-20',
    description: 'Irrigation cost: Electricity bill & pump diesel',
    activityId: 'act-2',
    receiptImage: null
  },
  {
    id: 'exp-6',
    cropId: 'crop-2',
    cropName: 'Cotton',
    category: 'Seeds',
    amount: 5500,
    date: '2026-05-28',
    description: 'Bt Cotton seed packets (3 packets)',
    receiptImage: null
  },
  {
    id: 'exp-7',
    cropId: 'crop-2',
    cropName: 'Cotton',
    category: 'Labour',
    amount: 4000,
    date: '2026-07-05',
    description: 'Weeding cost: Manual Labour Weeding',
    activityId: 'act-5',
    receiptImage: null
  },
  {
    id: 'exp-8',
    cropId: 'crop-3',
    cropName: 'Sugarcane',
    category: 'Transport',
    amount: 1200,
    date: '2026-01-09',
    description: 'Tractor transport for cane setts',
    receiptImage: null
  }
];

const initialAIChatHistory = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Maine soybean mein last spray kab kiya tha?',
    timestamp: '2026-06-26 10:15 AM'
  },
  {
    id: 'msg-2',
    sender: 'ai',
    text: 'Your latest recorded Soybean spray was on 25 June 2026 (Emamectin Benzoate 5% SG - 100 gm).',
    timestamp: '2026-06-26 10:15 AM'
  }
];

const initialNotifications = [
  {
    id: 'notif-1',
    title: 'Overdue Reminder',
    message: '🌾 Soybean — Second Pesticide Spray reminder was due on 2 July.',
    type: 'warning',
    date: '2026-10-03',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Today\'s Task',
    message: '💧 Cotton — Top Dressing Fertilizer application scheduled for today.',
    type: 'info',
    date: '2026-10-03',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Harvest Profit Summary',
    message: '💰 Soybean Harvest Gain: ₹48,000 against ₹12,500 expenses. Net Profit: ₹35,500!',
    type: 'success',
    date: '2026-10-01',
    read: true
  }
];

// Helper to manage LocalStorage caching
const loadOrInit = (key, defaultData) => {
  try {
    const item = localStorage.getItem(`khet_saathi_${key}`);
    if (item) return JSON.parse(item);
  } catch (e) {
    console.error('LocalStorage read error', e);
  }
  return defaultData;
};

const saveStorage = (key, data) => {
  try {
    localStorage.setItem(`khet_saathi_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
};

export const mockApi = {
  // Profiles
  async getProfile() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    return loadOrInit('profile', initialFarmerProfile);
  },

  async updateProfile(profileData) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const current = loadOrInit('profile', initialFarmerProfile);
    const updated = { ...current, ...profileData };
    saveStorage('profile', updated);
    return updated;
  },

  // Farms
  async getFarms() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    return loadOrInit('farms', initialFarms);
  },

  async getFarmById(id) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const farms = loadOrInit('farms', initialFarms);
    return farms.find(f => f.id === id) || null;
  },

  async createFarm(farmData) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const farms = loadOrInit('farms', initialFarms);
    const newFarm = {
      id: `farm-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...farmData
    };
    farms.unshift(newFarm);
    saveStorage('farms', farms);
    return newFarm;
  },

  async updateFarm(id, farmData) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const farms = loadOrInit('farms', initialFarms);
    const index = farms.findIndex(f => f.id === id);
    if (index !== -1) {
      farms[index] = { ...farms[index], ...farmData };
      saveStorage('farms', farms);
      return farms[index];
    }
    throw new Error('Farm not found');
  },

  async deleteFarm(id) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    let farms = loadOrInit('farms', initialFarms);
    farms = farms.filter(f => f.id !== id);
    saveStorage('farms', farms);
    return true;
  },

  // Crops
  async getCrops() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    return loadOrInit('crops', initialCrops);
  },

  async getCropById(id) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const crops = loadOrInit('crops', initialCrops);
    return crops.find(c => c.id === id) || null;
  },

  async createCrop(cropData) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const crops = loadOrInit('crops', initialCrops);
    const newCrop = {
      id: `crop-${Date.now()}`,
      status: 'active',
      ...cropData
    };
    crops.unshift(newCrop);
    saveStorage('crops', crops);
    return newCrop;
  },

  async updateCrop(id, cropData) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const crops = loadOrInit('crops', initialCrops);
    const index = crops.findIndex(c => c.id === id);
    if (index !== -1) {
      crops[index] = { ...crops[index], ...cropData };
      saveStorage('crops', crops);
      return crops[index];
    }
    throw new Error('Crop not found');
  },

  async deleteCrop(id) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    let crops = loadOrInit('crops', initialCrops);
    crops = crops.filter(c => c.id !== id);
    saveStorage('crops', crops);
    return true;
  },

  // Activities & Expense / Income Integration
  async getActivities() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    return loadOrInit('activities', initialActivities);
  },

  async getActivityById(id) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const activities = loadOrInit('activities', initialActivities);
    return activities.find(a => a.id === id) || null;
  },

  async createActivity(activityData) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const activities = loadOrInit('activities', initialActivities);
    const cost = parseFloat(activityData.cost) || 0;
    const income = parseFloat(activityData.income) || 0;

    const newActivity = {
      id: `act-${Date.now()}`,
      cost,
      income,
      ...activityData
    };
    activities.unshift(newActivity);
    saveStorage('activities', activities);

    // Automatically create corresponding Crop Expense entry if activity has a cost > 0
    if (cost > 0) {
      const expenses = loadOrInit('expenses', initialExpenses);
      expenses.unshift({
        id: `exp-${Date.now()}`,
        cropId: activityData.cropId,
        cropName: activityData.cropName,
        category: activityData.type || 'Other',
        amount: cost,
        date: activityData.date,
        description: `${activityData.type} cost: ${activityData.productName || 'Activity expense'}`,
        activityId: newActivity.id,
        receiptImage: activityData.image || null
      });
      saveStorage('expenses', expenses);
    }

    // Auto create follow up reminder if requested
    if (activityData.createReminder && activityData.reminderDate) {
      const reminders = loadOrInit('reminders', initialReminders);
      reminders.unshift({
        id: `rem-${Date.now()}`,
        title: `Follow up: ${activityData.type} - ${activityData.cropName || 'Crop'}`,
        cropId: activityData.cropId,
        cropName: activityData.cropName,
        farmId: activityData.farmId,
        farmName: activityData.farmName,
        activityType: activityData.type,
        reminderDate: activityData.reminderDate,
        notes: `Follow up after ${activityData.type} on ${activityData.date}`,
        status: 'upcoming'
      });
      saveStorage('reminders', reminders);
    }

    return newActivity;
  },

  async updateActivity(id, activityData) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const activities = loadOrInit('activities', initialActivities);
    const index = activities.findIndex(a => a.id === id);
    if (index !== -1) {
      const cost = parseFloat(activityData.cost) || 0;
      const income = parseFloat(activityData.income) || 0;

      activities[index] = { ...activities[index], ...activityData, cost, income };
      saveStorage('activities', activities);

      // Update linked expense entry if cost exists
      const expenses = loadOrInit('expenses', initialExpenses);
      const expIdx = expenses.findIndex(e => e.activityId === id);
      if (expIdx !== -1) {
        if (cost > 0) {
          expenses[expIdx].amount = cost;
          expenses[expIdx].date = activityData.date;
          expenses[expIdx].category = activityData.type;
          expenses[expIdx].description = `${activityData.type} cost: ${activityData.productName || 'Activity expense'}`;
        } else {
          expenses.splice(expIdx, 1);
        }
        saveStorage('expenses', expenses);
      } else if (cost > 0) {
        expenses.unshift({
          id: `exp-${Date.now()}`,
          cropId: activityData.cropId,
          cropName: activityData.cropName,
          category: activityData.type || 'Other',
          amount: cost,
          date: activityData.date,
          description: `${activityData.type} cost: ${activityData.productName || 'Activity expense'}`,
          activityId: id,
          receiptImage: activityData.image || null
        });
        saveStorage('expenses', expenses);
      }

      return activities[index];
    }
    throw new Error('Activity not found');
  },

  async deleteActivity(id) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    let activities = loadOrInit('activities', initialActivities);
    activities = activities.filter(a => a.id !== id);
    saveStorage('activities', activities);

    // Remove linked expense
    let expenses = loadOrInit('expenses', initialExpenses);
    expenses = expenses.filter(e => e.activityId !== id);
    saveStorage('expenses', expenses);

    return true;
  },

  // Reminders
  async getReminders() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    return loadOrInit('reminders', initialReminders);
  },

  async createReminder(reminderData) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const reminders = loadOrInit('reminders', initialReminders);
    const newReminder = {
      id: `rem-${Date.now()}`,
      status: 'upcoming',
      ...reminderData
    };
    reminders.unshift(newReminder);
    saveStorage('reminders', reminders);
    return newReminder;
  },

  async updateReminderStatus(id, newStatus) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const reminders = loadOrInit('reminders', initialReminders);
    const index = reminders.findIndex(r => r.id === id);
    if (index !== -1) {
      reminders[index].status = newStatus;
      saveStorage('reminders', reminders);
      return reminders[index];
    }
    throw new Error('Reminder not found');
  },

  async deleteReminder(id) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    let reminders = loadOrInit('reminders', initialReminders);
    reminders = reminders.filter(r => r.id !== id);
    saveStorage('reminders', reminders);
    return true;
  },

  // Expenses
  async getExpenses() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    return loadOrInit('expenses', initialExpenses);
  },

  async createExpense(expenseData) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const expenses = loadOrInit('expenses', initialExpenses);
    const newExpense = {
      id: `exp-${Date.now()}`,
      amount: parseFloat(expenseData.amount) || 0,
      ...expenseData
    };
    expenses.unshift(newExpense);
    saveStorage('expenses', expenses);
    return newExpense;
  },

  async deleteExpense(id) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    let expenses = loadOrInit('expenses', initialExpenses);
    expenses = expenses.filter(e => e.id !== id);
    saveStorage('expenses', expenses);
    return true;
  },

  // Financial Calculations for Crop & Farm Profitability
  async getFinancialSummary() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const expenses = loadOrInit('expenses', initialExpenses);
    const activities = loadOrInit('activities', initialActivities);

    const totalExpense = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const totalHarvestGain = activities.reduce((sum, a) => sum + (parseFloat(a.income) || 0), 0);
    const netProfit = totalHarvestGain - totalExpense;

    return { totalExpense, totalHarvestGain, netProfit };
  },

  // AI Assistant & Voice/Text Parser
  async getAIChatHistory() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    return loadOrInit('ai_history', initialAIChatHistory);
  },

  async askAI(userQuestion) {
    await new Promise(r => setTimeout(r, DELAY_MS * 2));
    const history = loadOrInit('ai_history', initialAIChatHistory);
    
    // Create User Message
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    history.push(userMsg);

    let replyText = "I have checked your digital records for AI Khet Saathi.";
    const qLower = userQuestion.toLowerCase();

    if (qLower.includes('spray') || qLower.includes('फवारणी') || qLower.includes('स्प्रे')) {
      replyText = "Your latest recorded soybean spray was on 25 June 2026 using Emamectin Benzoate 5% SG (100 gm) on Main Farm (Cost: ₹1,800).";
    } else if (qLower.includes('profit') || qLower.includes('मुनाफा') || qLower.includes('नफा') || qLower.includes('gain') || qLower.includes('kamai')) {
      replyText = "Your total recorded Soybean Harvest Gain is ₹48,000 against ₹12,500 total expenses. Your net Soybean crop profit is ₹35,500!";
    } else if (qLower.includes('water') || qLower.includes('irrigation') || qLower.includes('पाणी') || qLower.includes('सिंचाई')) {
      replyText = "Your last recorded irrigation was on 20 June 2026 for Soybean (Well Pump - 4 hours). Next sugarcane irrigation is due on 7 October.";
    } else if (qLower.includes('expense') || qLower.includes('खर्च') || qLower.includes('total') || qLower.includes('पैसा')) {
      replyText = "Your total recorded farming expenses for this season are ₹23,500. Soybean accounts for ₹12,500, Cotton accounts for ₹9,500, and Sugarcane for ₹1,200.";
    } else {
      replyText = `Based on your digital record, your farms (Main Farm & Riverbank Land) have recorded ₹80,000 total Harvest Gain and ₹23,500 expenses, giving you ₹56,500 overall net profit!`;
    }

    const aiMsg = {
      id: `msg-${Date.now() + 1}`,
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    history.push(aiMsg);
    saveStorage('ai_history', history);

    return { userMsg, aiMsg };
  },

  async parseTellKhetSaathiInput(textInput) {
    await new Promise(r => setTimeout(r, DELAY_MS * 1.5));
    const lower = textInput.toLowerCase();
    
    let activityType = 'Other';
    let cost = 0;
    let income = 0;

    if (lower.includes('paani') || lower.includes('pani') || lower.includes('water') || lower.includes('irrigation') || lower.includes('सिंचाई')) {
      activityType = 'Irrigation';
      cost = 500;
    } else if (lower.includes('spray') || lower.includes('fawarni') || lower.includes('दवा')) {
      activityType = 'Spray';
      cost = 1500;
    } else if (lower.includes('khat') || lower.includes('fertilizer') || lower.includes('खाद')) {
      activityType = 'Fertilizer';
      cost = 3000;
    } else if (lower.includes('harvest') || lower.includes('katayi') || lower.includes('काढणी') || lower.includes('sold')) {
      activityType = 'Harvest';
      cost = 2500;
      income = 35000;
    }

    let cropName = 'Soybean';
    let cropId = 'crop-1';
    if (lower.includes('cotton') || lower.includes('kapus') || lower.includes('कापूस')) {
      cropName = 'Cotton';
      cropId = 'crop-2';
    } else if (lower.includes('sugarcane') || lower.includes('us') || lower.includes('ऊस')) {
      cropName = 'Sugarcane';
      cropId = 'crop-3';
    }

    return {
      cropId,
      cropName,
      farmId: 'farm-1',
      farmName: 'Main Farm',
      type: activityType,
      date: new Date().toISOString().split('T')[0],
      productName: activityType === 'Harvest' ? 'Harvest Yield Sale' : (activityType === 'Irrigation' ? 'Canal / Pump Water' : 'Standard Application'),
      quantity: '1',
      unit: activityType === 'Harvest' ? 'quintal' : (activityType === 'Irrigation' ? 'hours' : 'dose'),
      cost,
      income,
      notes: `Captured via Khet Saathi voice/text logger: "${textInput}"`,
      rawText: textInput
    };
  },

  // Notifications
  async getNotifications() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    return loadOrInit('notifications', initialNotifications);
  },

  async markNotificationRead(id) {
    await new Promise(r => setTimeout(r, DELAY_MS));
    const notifs = loadOrInit('notifications', initialNotifications);
    const index = notifs.findIndex(n => n.id === id);
    if (index !== -1) {
      notifs[index].read = true;
      saveStorage('notifications', notifs);
    }
    return notifs;
  },

  // Admin Mock Services
  async getAdminStats() {
    await new Promise(r => setTimeout(r, DELAY_MS));
    return {
      totalFarmers: 1420,
      totalFarms: 2180,
      totalCrops: 3450,
      totalActivities: 18920,
      totalReminders: 9340,
      activeUsersToday: 890,
      topCrops: [
        { name: 'Soybean', percentage: 42 },
        { name: 'Cotton', percentage: 28 },
        { name: 'Sugarcane', percentage: 18 },
        { name: 'Wheat', percentage: 12 }
      ],
      recentFarmers: [
        { id: 'usr-101', name: 'Suresh More', district: 'Satara', farmsCount: 2, joined: '2026-10-02' },
        { id: 'usr-102', name: 'Anand Deshmukh', district: 'Sangli', farmsCount: 3, joined: '2026-10-01' },
        { id: 'usr-103', name: 'Balasaheb Kadam', district: 'Kolhapur', farmsCount: 1, joined: '2026-09-29' },
        { id: 'usr-104', name: 'Vikas Jadhav', district: 'Pune', farmsCount: 2, joined: '2026-09-28' }
      ]
    };
  }
};
