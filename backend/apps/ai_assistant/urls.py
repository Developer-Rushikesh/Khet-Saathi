from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIChatView, AIActivityParseView, AIConversationViewSet

router = DefaultRouter()
router.register(r'conversations', AIConversationViewSet, basename='ai-conversation')

urlpatterns = [
    path('chat/', AIChatView.as_view(), name='ai_chat'),
    path('parse-activity/', AIActivityParseView.as_view(), name='ai_parse_activity'),
    path('', include(router.urls)),
]
