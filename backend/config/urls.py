from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)

from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'ok', 'app': 'Khet Sathi API'})

urlpatterns = [
    # Health Check Endpoint
    path('api/health/', health_check, name='health_check'),

    # Admin Portal
    path('admin/', admin.site.urls),

    # REST API Endpoints
    path('api/auth/', include('apps.accounts.urls')),
    path('api/farms/', include('apps.farms.urls')),
    path('api/crops/', include('apps.crops.urls')),
    path('api/activities/', include('apps.activities.urls')),
    path('api/reminders/', include('apps.reminders.urls')),
    path('api/expenses/', include('apps.expenses.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/ai/', include('apps.ai_assistant.urls')),
    path('api/reports/', include('apps.reports.urls')),

    # OpenAPI Schema & Swagger Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
