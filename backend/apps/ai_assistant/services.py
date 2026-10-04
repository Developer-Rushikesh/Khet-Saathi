import re
from datetime import date
from django.db.models import Sum
from apps.farms.models import Farm
from apps.crops.models import Crop
from apps.activities.models import Activity
from apps.reminders.models import Reminder
from apps.expenses.models import Expense

def generate_grounded_ai_response(user, prompt: str) -> str:
    """
    Data-Grounded AI Engine for AI Khet Saathi.
    Strictly uses user-owned database records. Never invents farm history.
    """
    text = prompt.lower().strip()

    # 1. Fetch User Data
    user_farms = list(Farm.objects.filter(owner=user))
    user_crops = list(Crop.objects.filter(farm__owner=user))
    user_activities = Activity.objects.filter(crop__farm__owner=user).order_by('-activity_date')
    user_expenses = Expense.objects.filter(crop__farm__owner=user)
    user_reminders = Reminder.objects.filter(farmer=user).exclude(status='COMPLETED')

    # Identify if a specific crop is mentioned in prompt
    matched_crop = None
    for crop in user_crops:
        if crop.crop_name.lower() in text or (crop.variety and crop.variety.lower() in text):
            matched_crop = crop
            break

    # Intent 1: Spray inquiry
    if 'spray' in text or 'औषध' in text or 'दवा' in text:
        acts = user_activities.filter(activity_type='SPRAY')
        if matched_crop:
            acts = acts.filter(crop=matched_crop)
        
        last_act = acts.first()
        if last_act:
            p_name = f" with {last_act.product_name}" if last_act.product_name else ""
            return f"Your last recorded spray activity for {last_act.crop.crop_name} was on {last_act.activity_date}{p_name}."
        else:
            c_name = f" for {matched_crop.crop_name}" if matched_crop else ""
            return f"The app does not have a recorded spray activity{c_name}."

    # Intent 2: Irrigation inquiry
    elif 'irrigation' in text or 'paani' in text or 'पानी' in text or 'पाणी' in text:
        acts = user_activities.filter(activity_type='IRRIGATION')
        if matched_crop:
            acts = acts.filter(crop=matched_crop)

        last_act = acts.first()
        if last_act:
            return f"Your last recorded irrigation for {last_act.crop.crop_name} was on {last_act.activity_date} ({last_act.quantity or ''} {last_act.unit or 'hours'})."
        else:
            c_name = f" for {matched_crop.crop_name}" if matched_crop else ""
            return f"The app does not have a recorded irrigation activity{c_name}."

    # Intent 3: Fertilizer inquiry
    elif 'fertilizer' in text or 'khad' in text or 'खाद' in text or 'खत' in text:
        acts = user_activities.filter(activity_type='FERTILIZER')
        if matched_crop:
            acts = acts.filter(crop=matched_crop)

        last_act = acts.first()
        if last_act:
            p_name = f" ({last_act.product_name})" if last_act.product_name else ""
            return f"Your last fertilizer application for {last_act.crop.crop_name} was recorded on {last_act.activity_date}{p_name}."
        else:
            return "The app does not have a recorded fertilizer activity."

    # Intent 4: Total Expenses / Expense inquiry
    elif 'expense' in text or 'kharcha' in text or 'खर्च' in text or 'cost' in text:
        exps = user_expenses
        if matched_crop:
            exps = exps.filter(crop=matched_crop)
            total = exps.aggregate(Sum('amount'))['amount__sum'] or 0
            return f"Total recorded expenses for {matched_crop.crop_name} stand at ₹{total:,.2f}."
        else:
            total = exps.aggregate(Sum('amount'))['amount__sum'] or 0
            return f"Total season expenses recorded across your farms stand at ₹{total:,.2f}."

    # Intent 5: Reminders inquiry
    elif 'reminder' in text or 'aathvan' in text or 'आठवण' in text:
        if 'next' in text or 'upcoming' in text:
            rem = user_reminders.filter(reminder_date__gte=date.today()).first()
            if rem:
                return f"Next upcoming reminder is '{rem.title}' scheduled for {rem.reminder_date} ({rem.crop.crop_name if rem.crop else 'Farm'})."
            return "You have no upcoming reminders scheduled."
        elif 'overdue' in text:
            rems = user_reminders.filter(reminder_date__lt=date.today())
            if rems.exists():
                return f"You have {rems.count()} overdue reminders, starting with '{rems.first().title}' ({rems.first().reminder_date})."
            return "Great news! You have no overdue reminders."
        else:
            return f"You currently have {user_reminders.count()} active reminders pending."

    # Intent 6: Monthly / Recent Activities summary
    elif 'month' in text or 'mahine' in text or 'महीने' in text or 'महिना' in text or 'recent' in text:
        recent_acts = list(user_activities[:5])
        if not recent_acts:
            return "No activities recorded in recent timeline."
        summary_lines = [f"• {a.activity_type} on {a.crop.crop_name} ({a.activity_date})" for a in recent_acts]
        return "Recent farm activities recorded in your digital diary:\n" + "\n".join(summary_lines)

    # Intent 7: Farm summary
    elif 'farm' in text or 'shat' in text or 'शेत' in text or 'खेत' in text:
        return f"You have {len(user_farms)} registered farm(s) and {len(user_crops)} active crop(s) recorded in your Khet Sathi profile."

    # Fallback default response with data context
    if user_crops:
        crop_names = ", ".join([c.crop_name for c in user_crops])
        return f"I am your Khet Sathi assistant. I have access to your database records for {crop_names}. Ask me about your last spray, irrigation, total expenses, or upcoming reminders!"
    else:
        return "Welcome to Khet Sathi! Add your farms and crops to enable database-grounded AI history tracking."


def parse_natural_activity(user, prompt: str) -> dict:
    """
    Parses natural sentences into structured activity drafts for farmer confirmation.
    Does NOT save directly to database.
    """
    text = prompt.lower()
    today_str = date.today().isoformat()

    # Determine activity type
    act_type = 'OTHER'
    if 'paani' in text or 'पानी' in text or 'पाणी' in text or 'water' in text or 'irrigation' in text:
        act_type = 'IRRIGATION'
    elif 'spray' in text or 'औषध' in text or 'दवा' in text or 'fawarni' in text or 'फवारणी' in text:
        act_type = 'SPRAY'
    elif 'khad' in text or 'खाद' in text or 'खत' in text or 'fertilizer' in text or 'urea' in text or 'npk' in text:
        act_type = 'FERTILIZER'
    elif 'weeding' in text or 'khurpani' in text or 'खुरपणी' in text or 'निंदाई' in text:
        act_type = 'WEEDING'
    elif 'harvest' in text or 'katai' in text or 'कापणी' in text or 'कटाई' in text or 'kaadni' in text:
        act_type = 'HARVEST'
    elif 'sow' in text or 'bunaai' in text or 'पेरणी' in text or 'बुवाई' in text:
        act_type = 'SOWING'

    # Match crop name
    user_crops = Crop.objects.filter(farm__owner=user)
    matched_crop = user_crops.first()
    for crop in user_crops:
        if crop.crop_name.lower() in text:
            matched_crop = crop
            break

    # Extract quantity / numeric values
    numbers = re.findall(r'\d+', text)
    quantity = numbers[0] if numbers else "1"

    return {
        'activity_type': act_type,
        'crop_id': matched_crop.id if matched_crop else None,
        'crop_name': matched_crop.crop_name if matched_crop else 'Crop',
        'farm_id': matched_crop.farm.id if matched_crop else None,
        'farm_name': matched_crop.farm.name if matched_crop else 'Farm',
        'activity_date': today_str,
        'quantity': quantity,
        'unit': 'hours' if act_type == 'IRRIGATION' else ('kg' if act_type in ['FERTILIZER', 'SOWING'] else 'liter'),
        'confidence': 0.95,
        'notes': f"Parsed from input: '{prompt}'"
    }
