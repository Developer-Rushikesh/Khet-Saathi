from celery import shared_task
from datetime import date
from .models import Reminder
from apps.notifications.models import Notification

@shared_task
def check_due_reminders():
    """Celery scheduled task to check due/overdue reminders and push notifications"""
    today_date = date.today()
    due_reminders = Reminder.objects.filter(reminder_date=today_date, status__in=['PENDING', 'SNOOZED'])

    count = 0
    for rem in due_reminders:
        # Check if notification already sent for today
        already_notified = Notification.objects.filter(
            user=rem.farmer,
            notification_type='REMINDER',
            title__icontains=rem.title,
            created_at__date=today_date
        ).exists()

        if not already_notified:
            Notification.objects.create(
                user=rem.farmer,
                title=f"Reminder Due: {rem.title}",
                message=f"Your reminder for {rem.crop.crop_name if rem.crop else 'farm'} is due today ({today_date}).",
                notification_type='REMINDER'
            )
            count += 1

    return f"Processed {count} due reminder notifications."
