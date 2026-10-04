// Real REST API Client connecting React Frontend to Django REST Backend
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  const token = localStorage.getItem('khet_saathi_access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const realApi = {
  // Auth APIs
  async login(emailOrMobile, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrMobile.trim(), password })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      const msg = json.message || (json.detail ? json.detail : (json.non_field_errors ? json.non_field_errors[0] : 'Login failed'));
      throw new Error(typeof msg === 'string' ? msg : 'Invalid login credentials');
    }

    const { access, refresh, user } = json.data;
    localStorage.setItem('khet_saathi_access_token', access);
    localStorage.setItem('khet_saathi_refresh_token', refresh);
    localStorage.setItem('khet_saathi_user', JSON.stringify(user));

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      mobile: user.phone || '+91 98765 43210',
      role: user.role,
      language: user.preferred_language || 'en'
    };
  },

  async register(userData) {
    const email = userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '')}@khetsaathi.com`;
    const res = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name || 'Farmer User',
        email,
        phone: userData.phone || userData.mobile || '',
        password: userData.password || 'password123',
        preferred_language: userData.language || 'en'
      })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Registration failed');
    }

    return this.login(email, userData.password || 'password123');
  },

  async getProfile() {
    const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: getHeaders()
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error('Unauthenticated');
    }

    const user = json.data;
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      mobile: user.phone || '+91 98765 43210',
      role: user.role,
      language: user.preferred_language || 'en',
      village: 'Satara',
      district: 'Satara',
      joinedDate: user.created_at ? user.created_at.split('T')[0] : '2026-01-01'
    };
  },

  // Farm APIs
  async getFarms() {
    const res = await fetch(`${API_BASE_URL}/farms/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Fetch farms failed');
    const data = await res.json();
    const items = data.results || data;

    return items.map(f => ({
      id: f.id.toString(),
      name: f.name,
      village: f.village || 'Satara',
      area: parseFloat(f.area) || 0,
      unit: f.unit || 'acre',
      notes: f.notes || '',
      image: f.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      createdAt: f.created_at ? f.created_at.split('T')[0] : '2026-06-01'
    }));
  },

  async getFarmById(id) {
    const res = await fetch(`${API_BASE_URL}/farms/${id}/`, { headers: getHeaders() });
    if (!res.ok) return null;
    const f = await res.json();
    return {
      id: f.id.toString(),
      name: f.name,
      village: f.village || 'Satara',
      area: parseFloat(f.area) || 0,
      unit: f.unit || 'acre',
      notes: f.notes || '',
      image: f.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    };
  },

  async createFarm(farmData) {
    const res = await fetch(`${API_BASE_URL}/farms/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: farmData.name,
        village: farmData.village || '',
        location: farmData.location || farmData.village || '',
        area: parseFloat(farmData.area) || 1.0,
        unit: farmData.unit || 'acre',
        notes: farmData.notes || ''
      })
    });
    if (!res.ok) throw new Error('Create farm failed');
    const f = await res.json();
    return {
      id: f.id.toString(),
      name: f.name,
      village: f.village || 'Satara',
      area: parseFloat(f.area),
      unit: f.unit,
      notes: f.notes || ''
    };
  },

  async updateFarm(id, farmData) {
    const res = await fetch(`${API_BASE_URL}/farms/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        name: farmData.name,
        village: farmData.village,
        area: parseFloat(farmData.area),
        unit: farmData.unit,
        notes: farmData.notes
      })
    });
    if (!res.ok) throw new Error('Update farm failed');
    return this.getFarmById(id);
  },

  async deleteFarm(id) {
    const res = await fetch(`${API_BASE_URL}/farms/${id}/`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  },

  // Crop APIs
  async getCrops() {
    const res = await fetch(`${API_BASE_URL}/crops/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Fetch crops failed');
    const data = await res.json();
    const items = data.results || data;

    return items.map(c => ({
      id: c.id.toString(),
      name: c.crop_name,
      farmId: c.farm ? c.farm.toString() : '',
      farmName: c.farm_name || 'Farm',
      variety: c.variety || '',
      season: c.season || 'Kharif 2026',
      area: parseFloat(c.area) || 0,
      sowingDate: c.sowing_date,
      expectedHarvestDate: c.expected_harvest_date || '',
      status: c.status || 'active',
      notes: c.notes || ''
    }));
  },

  async getCropById(id) {
    const res = await fetch(`${API_BASE_URL}/crops/${id}/`, { headers: getHeaders() });
    if (!res.ok) return null;
    const c = await res.json();
    return {
      id: c.id.toString(),
      name: c.crop_name,
      farmId: c.farm ? c.farm.toString() : '',
      farmName: c.farm_name || 'Farm',
      variety: c.variety || '',
      season: c.season || 'Kharif 2026',
      area: parseFloat(c.area) || 0,
      sowingDate: c.sowing_date,
      expectedHarvestDate: c.expected_harvest_date || '',
      status: c.status || 'active',
      notes: c.notes || ''
    };
  },

  async createCrop(cropData) {
    const res = await fetch(`${API_BASE_URL}/crops/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        farm: parseInt(cropData.farmId),
        crop_name: cropData.name,
        variety: cropData.variety || '',
        season: cropData.season || 'Kharif 2026',
        area: parseFloat(cropData.area) || 1.0,
        sowing_date: cropData.sowingDate || new Date().toISOString().split('T')[0],
        expected_harvest_date: cropData.expectedHarvestDate || null,
        status: cropData.status || 'active',
        notes: cropData.notes || ''
      })
    });
    if (!res.ok) throw new Error('Create crop failed');
    const c = await res.json();
    return {
      id: c.id.toString(),
      name: c.crop_name,
      farmId: c.farm ? c.farm.toString() : '',
      farmName: c.farm_name || 'Farm',
      variety: c.variety || '',
      season: c.season || '',
      area: parseFloat(c.area),
      sowingDate: c.sowing_date,
      expectedHarvestDate: c.expected_harvest_date || '',
      status: c.status
    };
  },

  async updateCrop(id, cropData) {
    const res = await fetch(`${API_BASE_URL}/crops/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        crop_name: cropData.name,
        variety: cropData.variety,
        season: cropData.season,
        area: parseFloat(cropData.area),
        sowing_date: cropData.sowingDate,
        expected_harvest_date: cropData.expectedHarvestDate || null,
        status: cropData.status,
        notes: cropData.notes
      })
    });
    if (!res.ok) throw new Error('Update crop failed');
    return this.getCropById(id);
  },

  async deleteCrop(id) {
    const res = await fetch(`${API_BASE_URL}/crops/${id}/`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  },

  // Activity APIs
  async getActivities() {
    const res = await fetch(`${API_BASE_URL}/activities/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Fetch activities failed');
    const data = await res.json();
    const items = data.results || data;

    return items.map(a => {
      const typeStr = a.activity_type ? (a.activity_type.charAt(0).toUpperCase() + a.activity_type.slice(1).toLowerCase()) : 'Spray';
      return {
        id: a.id.toString(),
        cropId: a.crop ? a.crop.toString() : '',
        cropName: a.crop_name || 'Crop',
        farmId: a.farm_id ? a.farm_id.toString() : '',
        farmName: a.farm_name || 'Farm',
        type: typeStr === 'Pest_disease' ? 'Pest/Disease' : typeStr,
        date: a.activity_date,
        productName: a.product_name || '',
        quantity: a.quantity || '',
        unit: a.unit || '',
        personCount: a.person_count || 0,
        costPerPerson: parseFloat(a.cost_per_person) || 0,
        laborCost: parseFloat(a.labor_cost) || 0,
        materialCost: parseFloat(a.material_cost) || 0,
        cost: parseFloat(a.cost) || 0,
        income: parseFloat(a.income) || 0,
        notes: a.notes || '',
        image: a.image || null
      };
    });
  },

  async getActivityById(id) {
    const res = await fetch(`${API_BASE_URL}/activities/${id}/`, { headers: getHeaders() });
    if (!res.ok) return null;
    const a = await res.json();
    const typeStr = a.activity_type ? (a.activity_type.charAt(0).toUpperCase() + a.activity_type.slice(1).toLowerCase()) : 'Spray';

    return {
      id: a.id.toString(),
      cropId: a.crop ? a.crop.toString() : '',
      cropName: a.crop_name || 'Crop',
      farmId: a.farm_id ? a.farm_id.toString() : '',
      farmName: a.farm_name || 'Farm',
      type: typeStr === 'Pest_disease' ? 'Pest/Disease' : typeStr,
      date: a.activity_date,
      productName: a.product_name || '',
      quantity: a.quantity || '',
      unit: a.unit || '',
      personCount: a.person_count || 0,
      costPerPerson: parseFloat(a.cost_per_person) || 0,
      laborCost: parseFloat(a.labor_cost) || 0,
      materialCost: parseFloat(a.material_cost) || 0,
      cost: parseFloat(a.cost) || 0,
      income: parseFloat(a.income) || 0,
      notes: a.notes || '',
      image: a.image || null
    };
  },

  async createActivity(activityData) {
    const typeMap = {
      'Sowing': 'SOWING',
      'Irrigation': 'IRRIGATION',
      'Spray': 'SPRAY',
      'Fertilizer': 'FERTILIZER',
      'Pest/Disease': 'PEST_DISEASE',
      'Weeding': 'WEEDING',
      'Harvest': 'HARVEST',
      'Other': 'OTHER'
    };

    const pCount = parseInt(activityData.personCount) || 0;
    const pCost = parseFloat(activityData.costPerPerson) || 0;
    const lCost = pCount * pCost;
    const mCost = parseFloat(activityData.materialCost) || (pCount > 0 ? (parseFloat(activityData.cost) || 0) - lCost : (parseFloat(activityData.cost) || 0));
    const totalCost = (mCost > 0 ? mCost : 0) + lCost;

    const res = await fetch(`${API_BASE_URL}/activities/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        crop: parseInt(activityData.cropId),
        activity_type: typeMap[activityData.type] || 'SPRAY',
        activity_date: activityData.date || new Date().toISOString().split('T')[0],
        product_name: activityData.productName || '',
        quantity: activityData.quantity || '',
        unit: activityData.unit || '',
        person_count: pCount,
        cost_per_person: pCost,
        labor_cost: lCost,
        material_cost: mCost > 0 ? mCost : 0,
        cost: totalCost,
        income: parseFloat(activityData.income) || 0,
        notes: activityData.notes || ''
      })
    });

    if (!res.ok) throw new Error('Create activity failed');
    const a = await res.json();
    return this.getActivityById(a.id);
  },

  async updateActivity(id, activityData) {
    const typeMap = {
      'Sowing': 'SOWING',
      'Irrigation': 'IRRIGATION',
      'Spray': 'SPRAY',
      'Fertilizer': 'FERTILIZER',
      'Pest/Disease': 'PEST_DISEASE',
      'Weeding': 'WEEDING',
      'Harvest': 'HARVEST',
      'Other': 'OTHER'
    };

    const pCount = parseInt(activityData.personCount) || 0;
    const pCost = parseFloat(activityData.costPerPerson) || 0;
    const lCost = pCount * pCost;
    const mCost = parseFloat(activityData.materialCost) || (pCount > 0 ? (parseFloat(activityData.cost) || 0) - lCost : (parseFloat(activityData.cost) || 0));
    const totalCost = (mCost > 0 ? mCost : 0) + lCost;

    const res = await fetch(`${API_BASE_URL}/activities/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        activity_type: typeMap[activityData.type] || 'SPRAY',
        activity_date: activityData.date,
        product_name: activityData.productName,
        quantity: activityData.quantity,
        unit: activityData.unit,
        person_count: pCount,
        cost_per_person: pCost,
        material_cost: mCost > 0 ? mCost : 0,
        cost: totalCost,
        income: parseFloat(activityData.income) || 0,
        notes: activityData.notes
      })
    });
    if (!res.ok) throw new Error('Update activity failed');
    return this.getActivityById(id);
  },

  async deleteActivity(id) {
    const res = await fetch(`${API_BASE_URL}/activities/${id}/`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  },

  // Reminder APIs
  async getReminders() {
    const res = await fetch(`${API_BASE_URL}/reminders/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Fetch reminders failed');
    const data = await res.json();
    const items = data.results || data;

    return items.map(r => ({
      id: r.id.toString(),
      title: r.title,
      cropId: r.crop ? r.crop.toString() : '',
      cropName: r.crop_name || 'Crop',
      farmName: r.farm_name || 'Farm',
      reminderDate: r.reminder_date,
      notes: r.notes || '',
      status: r.due_status || r.status.toLowerCase()
    }));
  },

  async createReminder(reminderData) {
    const res = await fetch(`${API_BASE_URL}/reminders/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title: reminderData.title,
        crop: reminderData.cropId ? parseInt(reminderData.cropId) : null,
        reminder_date: reminderData.reminderDate,
        notes: reminderData.notes || '',
        status: 'PENDING'
      })
    });
    if (!res.ok) throw new Error('Create reminder failed');
    const r = await res.json();
    return {
      id: r.id.toString(),
      title: r.title,
      cropId: r.crop ? r.crop.toString() : '',
      cropName: r.crop_name || '',
      reminderDate: r.reminder_date,
      notes: r.notes || '',
      status: r.due_status || 'upcoming'
    };
  },

  async updateReminderStatus(id, newStatus) {
    const endpoint = newStatus === 'completed' ? `mark-completed` : `snooze`;
    const res = await fetch(`${API_BASE_URL}/reminders/${id}/${endpoint}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ days: 2 })
    });
    if (!res.ok) throw new Error('Update reminder failed');
    const json = await res.json();
    const r = json.data;
    return {
      id: r.id.toString(),
      title: r.title,
      reminderDate: r.reminder_date,
      status: r.due_status || newStatus
    };
  },

  async deleteReminder(id) {
    const res = await fetch(`${API_BASE_URL}/reminders/${id}/`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  },

  // Expense APIs
  async getExpenses() {
    const res = await fetch(`${API_BASE_URL}/expenses/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Fetch expenses failed');
    const data = await res.json();
    const items = data.results || data;

    return items.map(e => ({
      id: e.id.toString(),
      cropId: e.crop ? e.crop.toString() : '',
      cropName: e.crop_name || 'Crop',
      category: e.category,
      amount: parseFloat(e.amount),
      date: e.expense_date,
      description: e.description || '',
      receiptImage: e.receipt_image || null
    }));
  },

  async createExpense(expenseData) {
    const res = await fetch(`${API_BASE_URL}/expenses/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        crop: parseInt(expenseData.cropId),
        category: expenseData.category || 'Other',
        amount: parseFloat(expenseData.amount) || 0,
        expense_date: expenseData.date || new Date().toISOString().split('T')[0],
        description: expenseData.description || ''
      })
    });
    if (!res.ok) throw new Error('Create expense failed');
    const e = await res.json();
    return {
      id: e.id.toString(),
      cropId: e.crop ? e.crop.toString() : '',
      cropName: e.crop_name || 'Crop',
      category: e.category,
      amount: parseFloat(e.amount),
      date: e.expense_date,
      description: e.description || ''
    };
  },

  async deleteExpense(id) {
    const res = await fetch(`${API_BASE_URL}/expenses/${id}/`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  },

  // AI Assistant APIs
  async getAIChatHistory() {
    const res = await fetch(`${API_BASE_URL}/ai/conversations/`, { headers: getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    const convs = data.results || data;
    if (convs.length === 0) return [];

    const messages = convs[0].messages || [];
    return messages.map(m => ({
      id: m.id.toString(),
      sender: m.role === 'user' ? 'user' : 'ai',
      text: m.message,
      timestamp: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    }));
  },

  async askAI(userQuestion) {
    const res = await fetch(`${API_BASE_URL}/ai/chat/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message: userQuestion })
    });

    if (!res.ok) throw new Error('AI request failed');
    const json = await res.json();
    const data = json.data;

    const userMsg = {
      id: data.user_message.id.toString(),
      sender: 'user',
      text: data.user_message.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const aiMsg = {
      id: data.ai_message.id.toString(),
      sender: 'ai',
      text: data.ai_message.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    return { userMsg, aiMsg };
  },

  async parseTellKhetSaathiInput(textInput) {
    const res = await fetch(`${API_BASE_URL}/ai/parse-activity/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message: textInput })
    });

    if (!res.ok) throw new Error('Parse activity failed');
    const json = await res.json();
    const d = json.data;

    return {
      cropId: d.crop_id ? d.crop_id.toString() : '',
      cropName: d.crop_name || 'Crop',
      farmId: d.farm_id ? d.farm_id.toString() : '',
      farmName: d.farm_name || 'Farm',
      type: d.activity_type === 'IRRIGATION' ? 'Irrigation' : (d.activity_type === 'SPRAY' ? 'Spray' : (d.activity_type === 'FERTILIZER' ? 'Fertilizer' : 'Other')),
      date: d.activity_date || new Date().toISOString().split('T')[0],
      productName: d.activity_type === 'IRRIGATION' ? 'Pump Water' : 'Application',
      quantity: d.quantity || '1',
      unit: d.unit || 'hours',
      cost: 500,
      income: 0,
      notes: d.notes || `Parsed from text: ${textInput}`
    };
  },

  // Notifications APIs
  async getNotifications() {
    const res = await fetch(`${API_BASE_URL}/notifications/`, { headers: getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.results || data;

    return items.map(n => ({
      id: n.id.toString(),
      title: n.title,
      message: n.message,
      type: n.notification_type === 'REMINDER' ? 'info' : 'warning',
      date: n.created_at ? n.created_at.split('T')[0] : '2026-10-03',
      read: n.read
    }));
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read/`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return res.ok;
  }
};
