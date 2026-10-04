from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User
from apps.farms.models import Farm
from apps.crops.models import Crop
from apps.activities.models import Activity

class ComprehensiveBackendTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer1 = User.objects.create_user(
            email='farmer1@example.com',
            password='password123',
            name='Farmer One',
            role='farmer'
        )
        self.farmer2 = User.objects.create_user(
            email='farmer2@example.com',
            password='password123',
            name='Farmer Two',
            role='farmer'
        )
        self.admin = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpassword123',
            name='Admin User',
            role='admin'
        )

        # Login Farmer 1
        res = self.client.post('/api/auth/login/', {'email': 'farmer1@example.com', 'password': 'password123'})
        self.farmer1_token = res.data['data']['access']

        # Setup Farm & Crop for Farmer 1
        self.farm1 = Farm.objects.create(owner=self.farmer1, name='Farm 1', area=2.0, unit='acre')
        self.crop1 = Crop.objects.create(farm=self.farm1, crop_name='Soybean', area=2.0, sowing_date='2026-06-15')

    def test_authentication_workflow(self):
        # Register new user
        reg_data = {
            'email': 'newfarmer@example.com',
            'password': 'password123',
            'name': 'New Farmer',
            'phone': '+91 91234 56789'
        }
        res = self.client.post('/api/auth/register/', reg_data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data['success'])

        # Login new user
        login_res = self.client.post('/api/auth/login/', {'email': 'newfarmer@example.com', 'password': 'password123'})
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_res.data['data'])

        # Test invalid login
        invalid_res = self.client.post('/api/auth/login/', {'email': 'newfarmer@example.com', 'password': 'wrongpassword'})
        self.assertEqual(invalid_res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_farm_data_isolation(self):
        # Farmer 1 headers
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.farmer1_token}')

        # List farms
        res = self.client.get('/api/farms/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 1)

        # Create Farm for Farmer 2 directly in DB
        farm2 = Farm.objects.create(owner=self.farmer2, name='Farm 2', area=1.5, unit='acre')

        # Farmer 1 tries to access Farmer 2's farm detail -> should return 404 Not Found
        res_detail = self.client.get(f'/api/farms/{farm2.id}/')
        self.assertEqual(res_detail.status_code, status.HTTP_404_NOT_FOUND)

    def test_activity_labor_cost_and_expense_sync(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.farmer1_token}')

        activity_data = {
            'crop': self.crop1.id,
            'activity_type': 'WEEDING',
            'activity_date': '2026-07-10',
            'product_name': 'Manual Labor Weeding',
            'person_count': 5,
            'cost_per_person': 400.00,
            'material_cost': 500.00
        }
        res = self.client.post('/api/activities/', activity_data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        act_id = res.data['id']
        act_obj = Activity.objects.get(id=act_id)
        self.assertEqual(act_obj.labor_cost, 2000.00)  # 5 * 400
        self.assertEqual(act_obj.cost, 2500.00)        # 500 + 2000

        # Verify linked expense auto-created
        exp_res = self.client.get('/api/expenses/')
        self.assertEqual(exp_res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(exp_res.data['results']) > 0)
        self.assertEqual(float(exp_res.data['results'][0]['amount']), 2500.00)

    def test_ai_chat_and_activity_parsing(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.farmer1_token}')

        # AI Grounded Chat
        chat_res = self.client.post('/api/ai/chat/', {'message': 'Soybean का kharcha kitna hai?'})
        self.assertEqual(chat_res.status_code, status.HTTP_200_OK)
        self.assertTrue(chat_res.data['success'])

        # AI Natural Activity Parser
        parse_res = self.client.post('/api/ai/parse-activity/', {'message': 'Aaj subah soybean ko paani diya'})
        self.assertEqual(parse_res.status_code, status.HTTP_200_OK)
        self.assertEqual(parse_res.data['data']['activity_type'], 'IRRIGATION')
