from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import AIConversation, AIMessage
from .serializers import (
    AIConversationSerializer,
    AIMessageSerializer,
    AIChatInputSerializer,
    AIActivityParseSerializer
)
from .services import generate_grounded_ai_response, parse_natural_activity

class AIChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AIChatInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        prompt = serializer.validated_data['message']
        conv_id = serializer.validated_data.get('conversation_id')

        if conv_id:
            try:
                conv = AIConversation.objects.get(id=conv_id, user=user)
            except AIConversation.DoesNotExist:
                conv = AIConversation.objects.create(user=user, title=prompt[:30])
        else:
            conv = AIConversation.objects.create(user=user, title=prompt[:30])

        # Save user message
        user_msg = AIMessage.objects.create(conversation=conv, role='user', message=prompt)

        # Generate Grounded AI Response
        ai_reply = generate_grounded_ai_response(user, prompt)

        # Save AI message
        ai_msg = AIMessage.objects.create(conversation=conv, role='assistant', message=ai_reply)

        return Response({
            'success': True,
            'data': {
                'conversation_id': conv.id,
                'user_message': AIMessageSerializer(user_msg).data,
                'ai_message': AIMessageSerializer(ai_msg).data,
            }
        }, status=status.HTTP_200_OK)

class AIActivityParseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AIActivityParseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        prompt = serializer.validated_data['message']

        draft_data = parse_natural_activity(user, prompt)

        return Response({
            'success': True,
            'message': 'AI parsed natural activity draft for user confirmation.',
            'data': draft_data
        }, status=status.HTTP_200_OK)

class AIConversationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AIConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIConversation.objects.filter(user=self.request.user)
