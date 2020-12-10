from django.http import request
from django.http import response
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from . import execution

# Create your views here.


@api_view(['POST'])
def loginUser(request):
    body = request.body.decode('utf-8')
    credentials = json.loads(body)
    response = execution.login(credentials)
    return Response(response)


@api_view(['POST'])
def getPatientData(request):
    body = request.body.decode('utf-8')
    credentials = json.loads(body)
    print(credentials)

    response = execution.getPatientData(credentials)
    print(response)

    return Response(response)


@api_view(['POST'])
def registerPatient(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    print(data)

    response = execution.registerPatient(data)

    return Response(response)


@api_view(['POST'])
def adminAddUser(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(execution.verifyToken(userID, token)):
        response = execution.adminAddUser(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def getNotification(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(execution.verifyToken(userID, token)):
        response = execution.getNotification(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def markNotificationAsRead(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(execution.verifyToken(userID, token)):
        response = execution.markNotificationAsRead(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def updateUser(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(execution.verifyToken(userID, token)):
        response = execution.updateUser(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def getDashBoardData(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(execution.verifyToken(userID, token)):
        response = execution.getDashBoardData(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)
