from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            "success": False,
            "message": "An error occurred while processing your request.",
            "errors": response.data
        }
        
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_data['message'] = str(response.data['detail'])
            elif 'non_field_errors' in response.data:
                custom_data['message'] = str(response.data['non_field_errors'][0])
            else:
                first_key = list(response.data.keys())[0]
                first_err = response.data[first_key]
                if isinstance(first_err, list):
                    custom_data['message'] = f"{first_key}: {first_err[0]}"
                else:
                    custom_data['message'] = f"{first_key}: {first_err}"

        response.data = custom_data

    return response
