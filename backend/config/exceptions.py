from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Global exception handler for DRF returning clean JSON responses.
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            'success': False,
            'message': 'An error occurred while processing your request.',
            'errors': response.data
        }

        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_data['message'] = str(response.data['detail'])
            elif 'non_field_errors' in response.data:
                custom_data['message'] = str(response.data['non_field_errors'][0])
            else:
                first_key = list(response.data.keys())[0]
                first_val = response.data[first_key]
                if isinstance(first_val, list):
                    custom_data['message'] = f"{first_key}: {first_val[0]}"
                else:
                    custom_data['message'] = f"{first_key}: {first_val}"

        response.data = custom_data
    else:
        logger.error("Unhandled Backend Exception:", exc_info=exc)
        response = Response({
            'success': False,
            'message': 'Internal Server Error. Our team has been notified.',
            'errors': str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
