from django.core.management.base import BaseCommand
from datetime import date, timedelta
from apps.accounts.models import User
from apps.farms.models import Farm
from apps.crops.models import Crop
from apps.activities.models import Activity
from apps.reminders.models import Reminder
from apps.expenses.models import Expense
from apps.notifications.models import Notification

class Command(BaseCommand):
    help = 'Seeds initial demo farmer, farms, crops, activities, reminders, expenses, and notifications.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting demo database seed...'))

        # 1. Create Farmer User
        if not User.objects.filter(email='ramesh@example.com').exists():
            farmer = User.objects.create_user(
                email='ramesh@example.com',
                password='password123',
                name='Ramesh Patil',
                phone='+91 98765 43210',
                preferred_language='en',
                role='farmer'
            )
            self.stdout.write(self.style.SUCCESS('Created farmer user: ramesh@example.com (password123)'))
        else:
            farmer = User.objects.get(email='ramesh@example.com')

        # 2. Create Admin User
        if not User.objects.filter(email='admin@example.com').exists():
            admin_user = User.objects.create_superuser(
                email='admin@example.com',
                password='adminpassword123',
                name='System Administrator',
                phone='+91 99999 88888',
                preferred_language='en',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user: admin@example.com (adminpassword123)'))
        else:
            admin_user = User.objects.get(email='admin@example.com')

        # 3. Create Farms
        farm1, _ = Farm.objects.get_or_create(
            owner=farmer,
            name='Main Farm (मुख्य शेत)',
            defaults={
                'village': 'Satara Rural',
                'location': 'Satara, Maharashtra',
                'area': 2.0,
                'unit': 'acre',
                'notes': 'Well irrigation with fertile black cotton soil.'
            }
        )

        farm2, _ = Farm.objects.get_or_create(
            owner=farmer,
            name='Riverbank Land (नदीकाठचे रान)',
            defaults={
                'village': 'Koregaon',
                'location': 'Koregaon, Satara',
                'area': 1.5,
                'unit': 'acre',
                'notes': 'Canal water access, ideal for sugarcane and cotton.'
            }
        )

        # 4. Create Crops
        crop1, _ = Crop.objects.get_or_create(
            farm=farm1,
            crop_name='Soybean (सोयाबीन)',
            defaults={
                'variety': 'JS 335',
                'season': 'Kharif 2026',
                'area': 2.0,
                'sowing_date': date(2026, 6, 15),
                'expected_harvest_date': date(2026, 10, 15),
                'notes': 'Treated seeds with Rhizobium before sowing.',
                'status': 'active'
            }
        )

        crop2, _ = Crop.objects.get_or_create(
            farm=farm2,
            crop_name='Cotton (कापूस)',
            defaults={
                'variety': 'Bt Cotton Bollgard II',
                'season': 'Kharif 2026',
                'area': 1.5,
                'sowing_date': date(2026, 6, 1),
                'expected_harvest_date': date(2026, 11, 30),
                'notes': 'Drip irrigation installed with 4-ft spacing.',
                'status': 'active'
            }
        )

        # 5. Create Activities
        act1, _ = Activity.objects.get_or_create(
            crop=crop1,
            activity_type='SOWING',
            activity_date=date(2026, 6, 15),
            defaults={
                'product_name': 'JS 335 Certified Seed',
                'quantity': '15',
                'unit': 'kg',
                'person_count': 2,
                'cost_per_person': 350.00,
                'material_cost': 1800.00,
                'cost': 2500.00,
                'income': 0,
                'notes': 'Sown with seed drill after first rainfall with 2 helpers.',
                'created_by': farmer
            }
        )

        act2, _ = Activity.objects.get_or_create(
            crop=crop1,
            activity_type='SPRAY',
            activity_date=date(2026, 6, 25),
            defaults={
                'product_name': 'Emamectin Benzoate 5% SG',
                'quantity': '100',
                'unit': 'gm',
                'person_count': 2,
                'cost_per_person': 400.00,
                'material_cost': 1000.00,
                'cost': 1800.00,
                'income': 0,
                'notes': 'Preventive spray against early caterpillar infestation.',
                'created_by': farmer
            }
        )

        act3, _ = Activity.objects.get_or_create(
            crop=crop2,
            activity_type='WEEDING',
            activity_date=date(2026, 7, 5),
            defaults={
                'product_name': 'Manual Labour Weeding',
                'quantity': '10',
                'unit': 'workers',
                'person_count': 10,
                'cost_per_person': 400.00,
                'material_cost': 0,
                'cost': 4000.00,
                'income': 0,
                'notes': 'Cleared weeds between cotton rows with 10 laborers.',
                'created_by': farmer
            }
        )

        act4, _ = Activity.objects.get_or_create(
            crop=crop1,
            activity_type='HARVEST',
            activity_date=date(2026, 10, 1),
            defaults={
                'product_name': 'Combine Harvester Yield (18 Quintal)',
                'quantity': '18',
                'unit': 'quintal',
                'person_count': 4,
                'cost_per_person': 500.00,
                'material_cost': 2000.00,
                'cost': 4000.00,
                'income': 48000.00,
                'notes': 'Harvested early crop yield sold at Satara APMC Mandi.',
                'created_by': farmer
            }
        )

        # 6. Create Reminders
        Reminder.objects.get_or_create(
            farmer=farmer,
            title='Second Pesticide Spray (Soybean)',
            defaults={
                'crop': crop1,
                'activity': act2,
                'reminder_date': date.today() - timedelta(days=1),
                'notes': 'Check crop leaves for pod borer symptoms before spraying.',
                'status': 'PENDING'
            }
        )

        Reminder.objects.get_or_create(
            farmer=farmer,
            title='Cotton Top Dressing Fertilizer',
            defaults={
                'crop': crop2,
                'reminder_date': date.today(),
                'notes': 'Apply 25kg Urea per acre near root zone.',
                'status': 'PENDING'
            }
        )

        Reminder.objects.get_or_create(
            farmer=farmer,
            title='Sugarcane Irrigation Round 8',
            defaults={
                'crop': crop1,
                'reminder_date': date.today() + timedelta(days=4),
                'notes': 'Run drip system for 5 hours in afternoon.',
                'status': 'PENDING'
            }
        )

        # 7. Create Notifications
        Notification.objects.get_or_create(
            user=farmer,
            title='Cotton Top Dressing Fertilizer due today',
            defaults={
                'message': 'Your scheduled activity Cotton Top Dressing Fertilizer is due today.',
                'notification_type': 'REMINDER',
                'read': False
            }
        )

        Notification.objects.get_or_create(
            user=farmer,
            title='Welcome to Khet Sathi',
            defaults={
                'message': 'Start tracking your digital farming activities and ask AI anything about your crop history!',
                'notification_type': 'SYSTEM',
                'read': True
            }
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded demo database!'))
