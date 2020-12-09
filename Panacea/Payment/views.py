from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from . import execution
from UserHandler.execution import verifyToken

# Create your views here.
@api_view(['POST'])
def getPaymentData(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if 'patientID' in data:
        patientID = data['patientID']
    if(verifyToken(userID, token)):
        return Response(execution.returnPaymentData(patientID))
    else:
        return Response({'success': False, 'alertMessage': 'Verification Failed'})

        
@api_view(['POST'])
def savePayment(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if 'patientID' in data:
        patientID = data['patientID']
    if 'total_amount' in data:
        total_amount = data['total_amount']
    if(verifyToken(userID, token)):
        return Response(execution.confirmPayment(patientID, total_amount))
    else:
        return Response({'success': False, 'alertMessage': 'Verification Failed'})
